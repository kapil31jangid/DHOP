import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/dhop/page-header'

function Field({
  label,
  value,
  type = 'text',
  id,
}: {
  label: string
  value?: string
  type?: string
  id: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={value}
        className="h-9 rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  )
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save Changes</Button>
      </div>
    </section>
  )
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, facility, and system preferences."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsCard
          title="Profile"
          description="Your personal account information."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Name" value="Dr. A. Sharma" />
            <Field id="email" label="Email" value="a.sharma@district.health" type="email" />
            <Field id="phone" label="Phone" value="+91 98xxx 12345" type="tel" />
            <Field id="password" label="Change Password" type="password" />
          </div>
        </SettingsCard>

        <SettingsCard
          title="Facility Settings"
          description="Health centre details and contact information."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="centre" label="Health Centre" value="PHC Rampur" />
            <Field id="contact" label="Contact Number" value="+91 94xxx 21034" type="tel" />
            <Field id="address" label="Address" value="Ward 4, Rampur Block" />
            <Field id="hours" label="Operating Hours" value="08:00 AM – 08:00 PM" />
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        title="System Settings"
        description="District-wide preferences. District Admin only."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="threshold" label="Default Low Stock Threshold" value="100 units" />
          <Field id="report-pref" label="Default Report Frequency" value="Weekly" />
          <Field id="notify-pref" label="Notification Preference" value="Critical + Warning" />
        </div>
      </SettingsCard>
    </div>
  )
}
