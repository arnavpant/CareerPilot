import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { updateCompanySchema } from "@/lib/validations/company"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { Prisma } from "@prisma/client"

/**
 * GET /api/companies/[id]
 * Get a single company by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        applications: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            _count: {
              select: {
                interviews: true,
                tasks: true,
              },
            },
          },
        },
        contacts: {
          orderBy: {
            name: "asc",
          },
        },
        _count: {
          select: {
            applications: true,
            contacts: true,
          },
        },
      },
    })

    if (!company) {
      return errorResponse("Company not found", 404)
    }

    return successResponse(company)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/companies/[id]
 * Update a company
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify company belongs to user
    const existingCompany = await prisma.company.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    if (!existingCompany) {
      return errorResponse("Company not found", 404)
    }

    const body = await req.json()
    const data = updateCompanySchema.parse(body)

    // Check if name is being changed to an existing company name
    if (data.name && data.name !== existingCompany.name) {
      const duplicateCompany = await prisma.company.findFirst({
        where: {
          userId: user!.id,
          name: {
            equals: data.name,
            mode: "insensitive",
          },
          id: {
            not: params.id,
          },
        },
      })

      if (duplicateCompany) {
        return errorResponse("Company with this name already exists", 409)
      }
    }

    // Prepare update data
    const updateData: Prisma.CompanyUpdateInput = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.website !== undefined) updateData.website = data.website || null
    if (data.industry !== undefined) updateData.industry = data.industry || null
    if (data.size !== undefined) updateData.size = data.size || null
    if (data.locations !== undefined) updateData.locations = data.locations
    if (data.notes !== undefined) updateData.notes = data.notes || null

    const company = await prisma.company.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            applications: true,
            contacts: true,
          },
        },
      },
    })

    return successResponse(company)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/companies/[id]
 * Delete a company
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify company belongs to user
    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    if (!company) {
      return errorResponse("Company not found", 404)
    }

    // Check if company has applications
    if (company._count.applications > 0) {
      return errorResponse(
        "Cannot delete company with existing applications. Please delete or reassign applications first.",
        400
      )
    }

    // Delete the company (cascades to contacts)
    await prisma.company.delete({
      where: { id: params.id },
    })

    return successResponse(
      {
        message: "Company deleted successfully",
        id: params.id,
      },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
