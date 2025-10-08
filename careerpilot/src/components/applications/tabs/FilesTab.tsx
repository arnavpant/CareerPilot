import { format } from "date-fns"
import { FileText, Download, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Attachment } from "@prisma/client"

interface FilesTabProps {
  attachments: Attachment[]
  applicationId: string
}

export function FilesTab({ attachments, applicationId }: FilesTabProps) {
  if (attachments.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-slate-400 mb-4">No files attached</p>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Attachments</h3>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      <div className="grid gap-4">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium mb-1 truncate">
                {attachment.fileName}
              </h4>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>{attachment.fileSize ? formatFileSize(attachment.fileSize) : "Unknown size"}</span>
                <span>•</span>
                <span>{format(new Date(attachment.uploadedAt), "MMM d, yyyy")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/5"
                onClick={() => window.open(attachment.fileUrl, "_blank")}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-500/10 text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
