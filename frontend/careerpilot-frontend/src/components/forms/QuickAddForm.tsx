"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApplication } from "@/lib/api/applications"
import { toast } from "sonner"

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  salary: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface QuickAddFormProps {
  onSuccess: () => void
}

export function QuickAddForm({ onSuccess }: QuickAddFormProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await createApplication({
        ...data,
        stage: "discovered",
        appliedDate: new Date().toISOString().split("T")[0],
      })
      toast.success("Application added successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to add application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="url">Job Posting URL</Label>
        <Input id="url" {...register("url")} placeholder="https://..." />
        {errors.url && <p className="text-sm text-red-400 mt-1">{errors.url.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} placeholder="Vercel" />
          {errors.company && <p className="text-sm text-red-400 mt-1">{errors.company.message}</p>}
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input id="position" {...register("position")} placeholder="Software Engineer" />
          {errors.position && <p className="text-sm text-red-400 mt-1">{errors.position.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} placeholder="Remote" />
        </div>

        <div>
          <Label htmlFor="salary">Salary Range</Label>
          <Input id="salary" {...register("salary")} placeholder="$120k - $180k" />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Application"}
      </Button>
    </form>
  )
}
