"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteApplicationDialogProps {
  applicationId: string
  applicationTitle: string
  companyName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteApplicationDialog({
  applicationId,
  applicationTitle,
  companyName,
  open,
  onOpenChange,
}: DeleteApplicationDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete application")
      }

      toast.success("Application deleted", {
        description: `${applicationTitle} at ${companyName} has been removed`,
      })

      // Navigate back to table/pipeline
      router.push("/table")
      router.refresh()
    } catch (error) {
      console.error("Error deleting application:", error)
      toast.error("Failed to delete application", {
        description: error instanceof Error ? error.message : "Please try again",
      })
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-panel border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Application?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete <span className="font-semibold text-white">{applicationTitle}</span> at{" "}
            <span className="font-semibold text-white">{companyName}</span>?
            <br />
            <br />
            This action cannot be undone. This will permanently delete the application and all
            associated data including interviews, tasks, and activities.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
