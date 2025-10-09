"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const quickAddSchema = z.object({
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Position title is required"),
  stage: z.enum([
    "DISCOVERED",
    "APPLIED",
    "PHONE_SCREEN",
    "TECHNICAL",
    "ONSITE",
    "OFFER",
    "ACCEPTED",
    "REJECTED",
    "WITHDRAWN",
  ]),
  location: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  source: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
})

type QuickAddFormData = z.infer<typeof quickAddSchema>

export function QuickAddDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScraping, setIsScraping] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuickAddFormData>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: {
      stage: "DISCOVERED",
    },
  })

  const urlValue = watch("url")

  const handleUrlScrape = async () => {
    if (!urlValue) {
      toast.error("Please enter a URL first")
      return
    }

    setIsScraping(true)
    try {
      // TODO: Implement URL scraping API endpoint
      // For now, just show a placeholder
      toast.info("URL scraping coming soon!", {
        description: "For now, please enter details manually",
      })
    } catch (error) {
      toast.error("Failed to fetch job details", {
        description: "Please enter details manually",
      })
    } finally {
      setIsScraping(false)
    }
  }

  const onSubmit = async (data: QuickAddFormData) => {
    setIsSubmitting(true)

    try {
      // First, create or find the company
      const companyResponse = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.companyName,
        }),
      })

      if (!companyResponse.ok) {
        const errorData = await companyResponse.json()
        console.error("Company creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create company")
      }

      const companyResult = await companyResponse.json()
      const company = companyResult.data

      // Parse salary values
      const salaryMin = data.salaryMin ? parseInt(data.salaryMin) * 1000 : undefined
      const salaryMax = data.salaryMax ? parseInt(data.salaryMax) * 1000 : undefined

      // Parse tags
      const tags = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : []

      // Create the application
      const applicationPayload = {
        companyId: company.id,
        roleTitle: data.roleTitle,
        stage: data.stage,
        location: data.location || undefined,
        salaryMin,
        salaryMax,
        source: data.source || undefined,
        postingUrl: data.url || undefined,
        tags,
        notes: data.notes || undefined,
      }

      console.log("Creating application with payload:", applicationPayload)

      const applicationResponse = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationPayload),
      })

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json()
        console.error("Application creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create application")
      }

      const applicationResult = await applicationResponse.json()

      toast.success("Application added!", {
        description: `${data.roleTitle} at ${data.companyName}`,
      })

      // Close dialog and reset form
      setOpen(false)
      reset()

      // Refresh the current page
      router.refresh()
    } catch (error) {
      console.error("Error creating application:", error)
      toast.error("Failed to add application", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Add Application</DialogTitle>
          <DialogDescription className="text-slate-400">
            Paste a job posting URL to autofill or enter details manually
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* URL Field with Autofill */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-slate-300">
              Job Posting URL (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://..."
                {...register("url")}
                className="flex-1 bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUrlScrape}
                disabled={!urlValue || isScraping}
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                {isScraping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LinkIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
            {errors.url && (
              <p className="text-sm text-red-400">{errors.url.message}</p>
            )}
          </div>

          {/* Required Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-slate-300">
                Company <span className="text-red-400">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Google"
                {...register("companyName")}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
              {errors.companyName && (
                <p className="text-sm text-red-400">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleTitle" className="text-slate-300">
                Position <span className="text-red-400">*</span>
              </Label>
              <Input
                id="roleTitle"
                placeholder="Software Engineer"
                {...register("roleTitle")}
                className="bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
              {errors.roleTitle && (
                <p className="text-sm text-red-400">{errors.roleTitle.message}</p>
              )}
            </div>
          </div>

          {/* Stage Selection */}
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-slate-300">
              Stage <span className="text-red-400">*</span>
            </Label>
            <Select
              defaultValue="DISCOVERED"
              onValueChange={(value) => setValue("stage", value as any)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 focus:ring-indigo-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/10">
                {STAGE_ORDER.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {STAGE_CONFIG[stage].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Fields */}
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
              onClick={() => setOpen(false)}
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
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
