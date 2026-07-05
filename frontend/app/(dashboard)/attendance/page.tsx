import { CalendarCheck, UserCheck, UserX } from 'lucide-react'
import { DataTable, type Cell } from '@/components/dhop/data-table'
import { KpiCard } from '@/components/dhop/kpi-card'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Staff Name', 'Role', 'Date', 'Check-In', 'Check-Out', 'Status']

const rows: Cell[][] = [
  ['Dr. S. Verma', 'Medical Officer', 'Today', '08:55 AM', '—', { badge: 'Present', tone: 'success' }],
  ['Dr. P. Singh', 'Medical Officer', 'Today', '09:20 AM', '—', { badge: 'Late', tone: 'warning' }],
  ['Nurse R. Kaur', 'Staff Nurse', 'Today', '08:45 AM', '—', { badge: 'Present', tone: 'success' }],
  ['Nurse J. Thomas', 'Staff Nurse', 'Today', '—', '—', { badge: 'Absent', tone: 'critical' }],
  ['A. Prasad', 'Pharmacist', 'Today', '09:02 AM', '—', { badge: 'Present', tone: 'success' }],
  ['K. Mishra', 'Lab Technician', 'Today', '—', '—', { badge: 'Leave', tone: 'neutral' }],
  ['S. Bano', 'ANM', 'Today', '08:50 AM', '—', { badge: 'Present', tone: 'success' }],
  ['M. Rathore', 'Ward Attendant', 'Today', '08:58 AM', '—', { badge: 'Present', tone: 'success' }],
  ['D. Chauhan', 'Sanitation Staff', 'Today', '09:35 AM', '—', { badge: 'Late', tone: 'warning' }],
]

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Attendance"
        description="Track daily attendance of doctors and staff."
        action="Mark Attendance"
        secondaryAction="Monthly Records"
      />
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Attendance %" value="92%" icon={CalendarCheck} trend="+3%" trendUp />
        <KpiCard label="Present" value="23" icon={UserCheck} />
        <KpiCard label="Absent" value="2" icon={UserX} tone="critical" />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Role', 'Status', 'Date']}
        searchPlaceholder="Search staff..."
        emptyLabel="No attendance records found."
        emptyAction="Mark Attendance"
      />
    </div>
  )
}
