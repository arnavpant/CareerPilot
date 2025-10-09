import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"
import { ImportCsvForm } from "@/components/forms/ImportCsvForm"

export default function ImportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Import Data" description="Import applications from CSV or parse resumes" />
      <Section title="CSV Import" description="Upload a CSV file with your applications">
        <ImportCsvForm />
      </Section>
    </div>
  )
}
