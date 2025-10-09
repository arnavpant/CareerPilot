export interface Application {
  id: string
  company: string
  position: string
  status: "wishlist" | "applied" | "interview" | "offer" | "rejected"
  location: string
  salary?: string
  appliedDate: string
  priority: "low" | "medium" | "high"
  description?: string
}

export const mockApplications: Application[] = [
  {
    id: "1",
    company: "Google",
    position: "Senior Software Engineer",
    status: "interview",
    location: "Mountain View, CA",
    salary: "$180k - $250k",
    appliedDate: "2025-01-15",
    priority: "high",
    description: "Working on Google Cloud infrastructure",
  },
  {
    id: "2",
    company: "Meta",
    position: "Frontend Engineer",
    status: "applied",
    location: "Menlo Park, CA",
    salary: "$160k - $220k",
    appliedDate: "2025-01-20",
    priority: "high",
    description: "Building React-based products",
  },
  {
    id: "3",
    company: "Amazon",
    position: "Full Stack Developer",
    status: "applied",
    location: "Seattle, WA",
    salary: "$150k - $200k",
    appliedDate: "2025-01-22",
    priority: "medium",
    description: "AWS services development",
  },
  {
    id: "4",
    company: "Apple",
    position: "iOS Engineer",
    status: "wishlist",
    location: "Cupertino, CA",
    salary: "$170k - $230k",
    appliedDate: "2025-01-10",
    priority: "high",
    description: "Native iOS app development",
  },
  {
    id: "5",
    company: "Microsoft",
    position: "Cloud Solutions Architect",
    status: "interview",
    location: "Redmond, WA",
    salary: "$165k - $215k",
    appliedDate: "2025-01-18",
    priority: "medium",
    description: "Azure cloud architecture",
  },
  {
    id: "6",
    company: "Netflix",
    position: "Backend Engineer",
    status: "offer",
    location: "Los Gatos, CA",
    salary: "$190k - $260k",
    appliedDate: "2025-01-12",
    priority: "high",
    description: "Streaming infrastructure",
  },
  {
    id: "7",
    company: "Stripe",
    position: "Software Engineer",
    status: "applied",
    location: "San Francisco, CA",
    salary: "$175k - $240k",
    appliedDate: "2025-01-25",
    priority: "high",
    description: "Payment processing systems",
  },
  {
    id: "8",
    company: "Airbnb",
    position: "Product Engineer",
    status: "rejected",
    location: "San Francisco, CA",
    salary: "$155k - $210k",
    appliedDate: "2025-01-08",
    priority: "medium",
    description: "Marketplace platform development",
  },
  {
    id: "9",
    company: "Uber",
    position: "Mobile Engineer",
    status: "wishlist",
    location: "San Francisco, CA",
    salary: "$160k - $220k",
    appliedDate: "2025-01-28",
    priority: "low",
    description: "Rider and driver apps",
  },
  {
    id: "10",
    company: "Salesforce",
    position: "Platform Engineer",
    status: "applied",
    location: "San Francisco, CA",
    salary: "$165k - $225k",
    appliedDate: "2025-01-30",
    priority: "medium",
    description: "CRM platform development",
  },
]
