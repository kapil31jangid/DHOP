import { DataTable, type Cell } from '@/components/dhop/data-table'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Name', 'Email', 'Role', 'Health Centre', 'Status']

const rows: Cell[][] = [
  ['Dr. A. Sharma', 'a.sharma@district.health', 'District Admin', 'District Wide', { badge: 'Active', tone: 'success' }],
  ['Dr. S. Verma', 's.verma@district.health', 'Facility Admin', 'PHC Rampur', { badge: 'Active', tone: 'success' }],
  ['Dr. K. Iyer', 'k.iyer@district.health', 'Facility Admin', 'CHC Sundarpur', { badge: 'Active', tone: 'success' }],
  ['Nurse R. Kaur', 'r.kaur@district.health', 'Healthcare Staff', 'PHC Rampur', { badge: 'Active', tone: 'success' }],
  ['A. Prasad', 'a.prasad@district.health', 'Healthcare Staff', 'PHC Rampur', { badge: 'Active', tone: 'success' }],
  ['M. Rathore', 'm.rathore@district.health', 'Operations Staff', 'PHC Rampur', { badge: 'Active', tone: 'success' }],
  ['Dr. R. Nair', 'r.nair@district.health', 'Facility Admin', 'CHC Bhairavi', { badge: 'Active', tone: 'success' }],
  ['J. Thomas', 'j.thomas@district.health', 'Healthcare Staff', 'CHC Bhairavi', { badge: 'Invited', tone: 'pending' }],
  ['D. Chauhan', 'd.chauhan@district.health', 'Operations Staff', 'CHC Motihari', { badge: 'Disabled', tone: 'neutral' }],
]

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Manage platform users and their roles."
        action="Invite User"
      />
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Role', 'Health Centre', 'Status']}
        searchPlaceholder="Search users..."
        emptyLabel="No users found."
        emptyAction="Invite User"
      />
    </div>
  )
}
