import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  createCompanySchema,
  listCompaniesSchema,
} from "@/lib/validations/company"
import {
  successResponse,
  paginatedResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { Prisma } from "@prisma/client"

/**
 * GET /api/companies
 * List companies with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const filters = listCompaniesSchema.parse(queryParams)

    // Build where clause
    const where: Prisma.CompanyWhereInput = {
      userId: user!.id,
    }

    if (filters.industry) {
      where.industry = filters.industry
    }

    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          industry: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ]
    }

    // Build orderBy
    const orderBy: Prisma.CompanyOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit

    // Fetch companies with related data
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        include: {
          _count: {
            select: {
              applications: true,
              contacts: true,
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ])

    return paginatedResponse(companies, filters.page, filters.limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/companies
 * Create a new company
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const body = await req.json()
    const data = createCompanySchema.parse(body)

    // Check if company with same name already exists for this user
    const existingCompany = await prisma.company.findFirst({
      where: {
        userId: user!.id,
        name: {
          equals: data.name,
          mode: "insensitive",
        },
      },
    })

    if (existingCompany) {
      return successResponse(
        { error: "Company with this name already exists" },
        409
      )
    }

    const company = await prisma.company.create({
      data: {
        userId: user!.id,
        name: data.name,
        website: data.website || null,
        industry: data.industry || null,
        size: data.size || null,
        locations: data.locations || [],
        notes: data.notes || null,
      },
      include: {
        _count: {
          select: {
            applications: true,
            contacts: true,
          },
        },
      },
    })

    return successResponse(company, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
