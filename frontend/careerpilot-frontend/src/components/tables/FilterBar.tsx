import { Search, Filter, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function FilterBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search applications..." className="pl-10" />
        </div>
      </div>
      <Button variant="outline" size="sm">
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Button>
      <Button variant="outline" size="sm">
        <Save className="w-4 h-4 mr-2" />
        Saved Views
      </Button>
    </div>
  )
}
