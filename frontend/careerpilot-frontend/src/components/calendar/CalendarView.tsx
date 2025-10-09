"use client"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const events = [
  {
    title: "Phone Screen - Vercel",
    start: new Date(2025, 0, 20, 10, 0),
    end: new Date(2025, 0, 20, 10, 30),
  },
  {
    title: "Technical Interview - Stripe",
    start: new Date(2025, 0, 22, 14, 0),
    end: new Date(2025, 0, 22, 15, 30),
  },
  {
    title: "Onsite - OpenAI",
    start: new Date(2025, 0, 25, 9, 0),
    end: new Date(2025, 0, 25, 17, 0),
  },
]

export function CalendarView() {
  return (
    <div className="h-[600px]">
      <style jsx global>{`
        .rbc-calendar {
          color: white;
        }
        .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          color: rgb(226, 232, 240);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rbc-today {
          background-color: rgba(99, 102, 241, 0.1);
        }
        .rbc-event {
          background: linear-gradient(135deg, rgb(99, 102, 241), rgb(168, 85, 247));
          border: none;
          border-radius: 6px;
          padding: 4px 8px;
        }
        .rbc-event:hover {
          background: linear-gradient(135deg, rgb(79, 82, 221), rgb(148, 65, 227));
        }
        .rbc-off-range-bg {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .rbc-date-cell {
          padding: 8px;
          color: rgb(203, 213, 225);
        }
        .rbc-month-view, .rbc-time-view {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  )
}
