import { PageHeader } from "@/components/layout/PageHeader"
import { ApplicationTable } from "@/components/tables/ApplicationTable"

export default function TablePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Applications" description="View and manage all your job applications" />
      <ApplicationTable />
    </div>
  )
}
