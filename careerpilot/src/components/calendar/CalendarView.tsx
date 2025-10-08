"use client"

import { useState } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import { ChevronLeft, ChevronRight, Download, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCard } from "./EventCard"
import type { Interview, Task } from "@prisma/client"

interface CalendarEvent {
  id: string
  title: string
  type: "interview" | "task"
  date: Date
  time?: string
  location?: string
  priority?: string
  status?: string
  applicationId?: string
  company?: string
  role?: string
}

interface CalendarViewProps {
  interviews: (Interview & {
    application: {
      id: string
      roleTitle: string
      company: { name: string }
    }
  })[]
  tasks: (Task & {
    application?: {
      id: string
      roleTitle: string
      company: { name: string }
    } | null
  })[]
}

export function CalendarView({ interviews, tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Convert interviews and tasks to calendar events
  const events: CalendarEvent[] = [
    ...interviews.map((interview) => ({
      id: interview.id,
      title: `Interview: ${interview.application.company.name}`,
      type: "interview" as const,
      date: interview.scheduledAt,
      time: format(interview.scheduledAt, "h:mm a"),
      location: interview.location || undefined,
      applicationId: interview.application.id,
      company: interview.application.company.name,
      role: interview.application.roleTitle,
    })),
    ...tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.id,
        title: task.title,
        type: "task" as const,
        date: task.dueDate!,
        priority: task.priority,
        status: task.status,
        applicationId: task.application?.id,
        company: task.application?.company.name,
        role: task.application?.roleTitle,
      })),
  ]

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  // Calendar grid generation
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    calendarDays.push(day)
    day = addDays(day, 1)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleToday = () => setCurrentDate(new Date())

  const handleExportICS = () => {
    // Generate .ics file content
    const icsContent = generateICSContent(events)
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `career-pilot-calendar-${format(new Date(), "yyyy-MM-dd")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleGetSubscribeLink = async () => {
    // TODO: Implement calendar subscription endpoint
    // For now, copy a placeholder to clipboard
    const subscribeUrl = `${window.location.origin}/api/calendar/subscribe?token=placeholder`
    await navigator.clipboard.writeText(subscribeUrl)
    alert("Subscribe link copied to clipboard!\n\n(Subscription endpoint coming soon)")
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousMonth}
              className="hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportICS}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export .ics
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetSubscribeLink}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Subscribe Link
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            const hasEvents = dayEvents.length > 0
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-xl p-2 text-center transition-all relative
                  ${!isCurrentMonth && "opacity-40"}
                  ${isTodayDate && "ring-2 ring-indigo-500"}
                  ${isSelected && "ring-2 ring-purple-500"}
                  ${
                    hasEvents
                      ? "bg-gradient-to-br from-blue-500/20 to-indigo-600/20 text-white font-semibold hover:from-blue-500/30 hover:to-indigo-600/30"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }
                `}
              >
                <div className="text-sm">{format(day, "d")}</div>
                {hasEvents && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          event.type === "interview"
                            ? "bg-indigo-400"
                            : event.priority === "HIGH"
                            ? "bg-red-400"
                            : event.priority === "MEDIUM"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Events Sidebar */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          {selectedDate
            ? format(selectedDate, "MMMM d, yyyy")
            : "Select a date"}
        </h3>

        {selectedDate ? (
          <div className="space-y-3">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                No events on this date
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">
            Click on a date to see events
          </p>
        )}
      </div>
    </div>
  )
}

// Helper function to generate ICS file content
function generateICSContent(events: CalendarEvent[]): string {
  const now = new Date()
  const timestamp = format(now, "yyyyMMdd'T'HHmmss'Z'")

  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CareerPilot//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:CareerPilot Events",
    "X-WR-TIMEZONE:UTC",
  ].join("\r\n")

  events.forEach((event) => {
    const startDate = format(event.date, "yyyyMMdd'T'HHmmss")
    const endDate = format(addDays(event.date, 0), "yyyyMMdd'T'HHmmss")

    let description = event.type === "interview" ? "Interview" : "Task"
    if (event.company) description += ` - ${event.company}`
    if (event.role) description += ` (${event.role})`

    icsContent += "\r\n" + [
      "BEGIN:VEVENT",
      `UID:${event.id}@careerpilot.app`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      event.location ? `LOCATION:${event.location}` : "",
      `STATUS:CONFIRMED`,
      "END:VEVENT",
    ].filter(Boolean).join("\r\n")
  })

  icsContent += "\r\nEND:VCALENDAR"
  return icsContent
}
