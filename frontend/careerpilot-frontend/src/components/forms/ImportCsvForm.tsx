"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"
import { toast } from "sonner"

export function ImportCsvForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    // Mock import
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success("CSV imported successfully")
    setLoading(false)
    setFile(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-white/20 rounded-[var(--radius-md)] p-8 text-center hover:border-white/30 transition-colors">
        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-white font-medium mb-1">{file ? file.name : "Click to upload CSV"}</p>
          <p className="text-sm text-slate-400">or drag and drop</p>
        </label>
      </div>

      {file && (
        <div className="flex items-center gap-3 p-4 glass-panel rounded-[var(--radius-md)]">
          <FileText className="w-5 h-5 text-indigo-400" />
          <div className="flex-1">
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}

      <Button type="submit" disabled={!file || loading} className="w-full">
        {loading ? "Importing..." : "Import CSV"}
      </Button>
    </form>
  )
}
