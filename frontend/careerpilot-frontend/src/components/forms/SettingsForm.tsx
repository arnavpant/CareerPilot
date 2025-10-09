"use client"

import { Section } from "@/components/layout/Section"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function SettingsForm() {
  return (
    <div className="space-y-8">
      <Section title="Profile" description="Manage your account information">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Section>

      <Section title="Notifications" description="Configure how you receive updates">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-slate-400">Receive updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Interview Reminders</p>
              <p className="text-sm text-slate-400">Get reminded before interviews</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Weekly Summary</p>
              <p className="text-sm text-slate-400">Receive weekly progress reports</p>
            </div>
            <Switch />
          </div>
        </div>
      </Section>

      <Section title="Preferences" description="Customize your experience">
        <div className="space-y-4">
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" defaultValue="America/New_York" />
          </div>
          <div>
            <Label htmlFor="retention">Data Retention (days)</Label>
            <Input id="retention" type="number" defaultValue="365" />
          </div>
        </div>
      </Section>
    </div>
  )
}
