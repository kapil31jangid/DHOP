import { DataTable, type Cell } from '@/components/dhop/data-table'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Date & Time', 'User', 'Module', 'Action', 'Description']

const rows: Cell[][] = [
  ['Today, 09:42 AM', 'A. Prasad', 'Medicines', { badge: 'Update', tone: 'info' }, 'Paracetamol 500mg stock updated to 48 units'],
  ['Today, 09:12 AM', 'Dr. S. Verma', 'Reports', { badge: 'Create', tone: 'success' }, 'Weekly summary report generated'],
  ['Today, 08:58 AM', 'M. Rathore', 'Attendance', { badge: 'Create', tone: 'success' }, 'Morning shift attendance submitted'],
  ['Today, 08:51 AM', 'Nurse R. Kaur', 'Patients', { badge: 'Create', tone: 'success' }, 'Patient PT-1042 registered (OPD)'],
  ['Today, 08:47 AM', 'Dr. S. Verma', 'Auth', { badge: 'Login', tone: 'neutral' }, 'User logged in successfully'],
  ['Yesterday, 05:30 PM', 'M. Rathore', 'Beds', { badge: 'Update', tone: 'info' }, 'Bed B-12 status changed to Available'],
  ['Yesterday, 04:40 PM', 'A. Prasad', 'Medicines', { badge: 'Create', tone: 'success' }, 'New medicine Azithromycin 500mg added'],
  ['Yesterday, 02:15 PM', 'District Admin', 'Users', { badge: 'Update', tone: 'info' }, 'User D. Chauhan disabled'],
  ['Yesterday, 11:08 AM', 'Dr. K. Iyer', 'Patients', { badge: 'Update', tone: 'info' }, 'Patient PT-1036 record updated'],
]

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit Logs"
        description="Track important actions performed in the system."
        secondaryAction="Export"
      />
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Module', 'User', 'Date']}
        searchPlaceholder="Search logs..."
        emptyLabel="No audit logs found."
      />
    </div>
  )
}
