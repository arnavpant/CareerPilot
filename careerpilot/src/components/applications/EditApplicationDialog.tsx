"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STAGE_ORDER, STAGE_CONFIG } from "@/lib/constants/stages"
import type { Application, Company } from "@prisma/client"

const editApplicationSchema = z.object({
  roleTitle: z.string().min(1, "Position title is required"),
  location: z.string().optional(),
  source: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  postingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
  tags: z.string().optional(),
})

type EditApplicationFormData = z.infer<typeof editApplicationSchema>

interface EditApplicationDialogProps {
  application: Application & { company: Company | null }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditApplicationDialog({
  application,
  open,
  onOpenChange,
}: EditApplicationDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditApplicationFormData>({
    resolver: zodResolver(editApplicationSchema),
    defaultValues: {
      roleTitle: application.roleTitle,
      location: application.location || "",
      source: application.source || "",
      salaryMin: application.salaryMin ? String(application.salaryMin / 1000) : "",
      salaryMax: application.salaryMax ? String(application.salaryMax / 1000) : "",
      postingUrl: application.postingUrl || "",
      notes: application.notes || "",
      tags: application.tags?.join(", ") || "",
    },
  })

  const onSubmit = async (data: EditApplicationFormData) => {
    setIsSubmitting(true)

    try {
      const salaryMin = data.salaryMin ? parseInt(data.salaryMin) * 1000 : undefined
      const salaryMax = data.salaryMax ? parseInt(data.salaryMax) * 1000 : undefined
      const tags = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : []

      const response = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: data.roleTitle,
          location: data.location || undefined,
          source: data.source || undefined,
          salaryMin,
          salaryMax,
          postingUrl: data.postingUrl || undefined,
          notes: data.notes || undefined,
          tags,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update application")
      }

      toast.success("Application updated!")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating application:", error)
      toast.error("Failed to update application", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Edit Application</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update the details for this application
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="roleTitle" className="text-slate-300">
              Position <span className="text-red-400">*</span>
            </Label>
            <Input
              id="roleTitle"
              {...register("roleTitle")}
              className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
            {errors.roleTitle && (
              <p className="text-sm text-red-400">{errors.roleTitle.message}</p>
            )}
          </div>

          {/* Location and Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300">
                Location
              </Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                {...register("location")}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-slate-300">
                Source
              </Label>
              <Input
                id="source"
                placeholder="LinkedIn"
                {...register("source")}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin" className="text-slate-300">
                Min Salary (in thousands)
              </Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="100"
                {...register("salaryMin")}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax" className="text-slate-300">
                Max Salary (in thousands)
              </Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="150"
                {...register("salaryMax")}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="postingUrl" className="text-slate-300">
              Job Posting URL
            </Label>
            <Input
              id="postingUrl"
              type="url"
              placeholder="https://..."
              {...register("postingUrl")}
              className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
            {errors.postingUrl && (
              <p className="text-sm text-red-400">{errors.postingUrl.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-slate-300">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              placeholder="frontend, react, remote"
              {...register("tags")}
              className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional information..."
              rows={3}
              {...register("notes")}
              className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

