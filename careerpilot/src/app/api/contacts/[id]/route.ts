import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth/apiAuth"
import { prisma } from "@/lib/db/prisma"
import { updateContactSchema } from "@/lib/validations/contact"
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response"
import { Prisma } from "@prisma/client"

/**
 * GET /api/contacts/[id]
 * Get a single contact by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    const contact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
      include: {
        company: true,
        applicationContacts: {
          include: {
            application: {
              include: {
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        interviewPanelMembers: {
          include: {
            interview: {
              include: {
                application: {
                  include: {
                    company: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
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

    if (!contact) {
      return errorResponse("Contact not found", 404)
    }

    return successResponse(contact)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/contacts/[id]
 * Update a contact
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify contact belongs to user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    if (!existingContact) {
      return errorResponse("Contact not found", 404)
    }

    const body = await req.json()
    const data = updateContactSchema.parse(body)

    // Check if email is being changed to an existing contact email (dedupe)
    if (data.email && data.email !== existingContact.email) {
      const duplicateContact = await prisma.contact.findFirst({
        where: {
          userId: user!.id,
          email: {
            equals: data.email,
            mode: "insensitive",
          },
          id: {
            not: params.id,
          },
        },
      })

      if (duplicateContact) {
        return errorResponse("Contact with this email already exists", 409)
      }
    }

    // If companyId is being changed, verify new company belongs to user
    if (data.companyId !== undefined && data.companyId !== null) {
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

    // Prepare update data
    const updateData: Prisma.ContactUpdateInput = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.companyId !== undefined) {
      updateData.company = data.companyId
        ? { connect: { id: data.companyId } }
        : { disconnect: true }
    }
    if (data.role !== undefined) updateData.role = data.role
    if (data.relationship !== undefined)
      updateData.relationship = data.relationship
    if (data.notes !== undefined) updateData.notes = data.notes

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: updateData,
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

    return successResponse(contact)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/contacts/[id]
 * Delete a contact
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireAuth(req)
    if (response) return response

    // Verify contact belongs to user
    const contact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    if (!contact) {
      return errorResponse("Contact not found", 404)
    }

    // Delete the contact (cascades to application_contacts and interview_panel_members)
    await prisma.contact.delete({
      where: { id: params.id },
    })

    return successResponse(
      {
        message: "Contact deleted successfully",
        id: params.id,
      },
      200
    )
  } catch (error) {
    return handleApiError(error)
  }
}
