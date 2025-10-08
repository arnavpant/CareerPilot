"use client"

import { useState, useMemo } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { ArrowUpDown, MapPin, DollarSign, Calendar, Columns, Filter } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { STAGE_CONFIG, STAGE_ORDER } from "@/lib/constants/stages"
import type { Application, Company, ApplicationStage } from "@prisma/client"

interface ApplicationsTableProps {
  applications: (Application & { company: Company | null })[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedStages, setSelectedStages] = useState<ApplicationStage[]>([])

  const columns = useMemo<ColumnDef<Application & { company: Company | null }>[]>(
    () => [
      {
        accessorKey: "company.name",
        id: "company",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-white/5"
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const companyName = row.original.company?.name || "Unknown"
          const initial = companyName[0]
          
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initial}
              </div>
              <span className="font-medium text-white">{companyName}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "roleTitle",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-white/5"
          >
            Position
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="text-white font-medium">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "stage",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-white/5"
          >
            Stage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => {
          const stage = getValue() as ApplicationStage
          const config = STAGE_CONFIG[stage]
          
          return (
            <Badge className={`${config.bgColor} ${config.textColor} border-0`}>
              {config.label}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ getValue }) => {
          const location = getValue() as string | null
          
          return location ? (
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          ) : (
            <span className="text-slate-600">-</span>
          )
        },
      },
      {
        accessorKey: "salaryMin",
        id: "salary",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-white/5"
          >
            Salary
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const min = row.original.salaryMin
          const max = row.original.salaryMax
          
          if (!min && !max) {
            return <span className="text-slate-600">-</span>
          }
          
          const range =
            min && max
              ? `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
              : min
              ? `$${(min / 1000).toFixed(0)}k+`
              : `Up to $${(max! / 1000).toFixed(0)}k`
          
          return (
            <div className="flex items-center gap-1.5 text-slate-400">
              <DollarSign className="w-4 h-4" />
              <span>{range}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "appliedAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-white/5"
          >
            Applied
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.original.appliedAt || row.original.createdAt
          
          return (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(date), "MMM d, yyyy")}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ getValue }) => {
          const source = getValue() as string | null
          
          return source ? (
            <span className="text-slate-400">{source}</span>
          ) : (
            <span className="text-slate-600">-</span>
          )
        },
      },
    ],
    []
  )

  // Filter by selected stages
  const filteredApplications = useMemo(() => {
    if (selectedStages.length === 0) return applications
    return applications.filter((app) => selectedStages.includes(app.stage))
  }, [applications, selectedStages])

  const table = useReactTable({
    data: filteredApplications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const toggleStage = (stage: ApplicationStage) => {
    setSelectedStages((prev) =>
      prev.includes(stage)
        ? prev.filter((s) => s !== stage)
        : [...prev, stage]
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm bg-white/5 border-white/10 focus-visible:ring-indigo-500"
          />
          
          <div className="text-sm text-slate-400">
            {table.getFilteredRowModel().rows.length} of {applications.length} applications
          </div>
        </div>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
              <Columns className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-panel border-white/10 w-48">
            <DropdownMenuLabel className="text-white">Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-slate-300 hover:bg-white/5 focus:bg-white/5"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stage Filter */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-white">Filter by Stage</span>
          {selectedStages.length > 0 && (
            <button
              onClick={() => setSelectedStages([])}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STAGE_ORDER.map((stage) => {
            const config = STAGE_CONFIG[stage]
            const isSelected = selectedStages.includes(stage)
            
            return (
              <button
                key={stage}
                onClick={() => toggleStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? `${config.bgColor} ${config.textColor} ring-2 ring-offset-1 ring-offset-transparent`
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-white/10"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No applications found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
