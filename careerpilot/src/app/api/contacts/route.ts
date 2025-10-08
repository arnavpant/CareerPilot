import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import {
  createContactSchema,
  listContactsSchema,
} from "@/lib/validations/contact"
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { Prisma } from "@prisma/client"

/**
 * GET /api/contacts
 * List contacts with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const filters = listContactsSchema.parse(queryParams)

    // Build where clause
    const where: Prisma.ContactWhereInput = {
      userId: user!.id,
    }

    if (filters.companyId) {
      where.companyId = filters.companyId
    }

    if (filters.relationship) {
      where.relationship = {
        contains: filters.relationship,
        mode: "insensitive",
      }
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
          email: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ]
    }

    // Build orderBy
    const orderBy: Prisma.ContactOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit

    // Fetch contacts with related data
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
            },
          },
          _count: {
            select: {
              applicationContacts: true,
              interviewPanelMembers: true,
            },
          },
        },
      }),
      prisma.contact.count({ where }),
    ])

    return paginatedResponse(contacts, filters.page, filters.limit, total)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/contacts
 * Create a new contact (with email deduplication)
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const body = await req.json()
    const data = createContactSchema.parse(body)

    // Check if contact with same email already exists for this user (dedupe by email)
    const existingContact = await prisma.contact.findFirst({
      where: {
        userId: user!.id,
        email: {
          equals: data.email,
          mode: "insensitive",
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (existingContact) {
      return successResponse(
        {
          error: "Contact with this email already exists",
          existing: existingContact,
        },
        409
      )
    }

    // If companyId provided, verify it belongs to user
    if (data.companyId) {
      const company = await prisma.company.findFirst({
        where: {
          id: data.companyId,
          userId: user!.id,
        },
      })

      if (!company) {
        return errorResponse("Company not found or access denied", 404)
      }
    }

    const contact = await prisma.contact.create({
      data: {
        userId: user!.id,
        name: data.name,
        email: data.email,
        companyId: data.companyId || null,
        role: data.role || null,
        relationship: data.relationship || null,
        notes: data.notes || null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
        _count: {
          select: {
            applicationContacts: true,
            interviewPanelMembers: true,
          },
        },
      },
    })

    return successResponse(contact, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
