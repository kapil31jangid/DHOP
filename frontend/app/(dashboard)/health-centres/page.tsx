import { DataTable, type Cell } from '@/components/dhop/data-table'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Centre Name', 'Type', 'Address', 'Contact', 'Facility Admin', 'Status']

const rows: Cell[][] = [
  ['PHC Rampur', 'PHC', 'Ward 4, Rampur Block', '+91 94xxx 21034', 'Dr. S. Verma', { badge: 'Active', tone: 'success' }],
  ['CHC Sundarpur', 'CHC', 'Main Rd, Sundarpur', '+91 98xxx 44120', 'Dr. K. Iyer', { badge: 'Active', tone: 'success' }],
  ['CHC Bhairavi', 'CHC', 'Sector 2, Bhairavi', '+91 90xxx 87455', 'Dr. R. Nair', { badge: 'Active', tone: 'success' }],
  ['PHC Lakshmi Nagar', 'PHC', 'Lakshmi Nagar Colony', '+91 96xxx 30217', 'Dr. P. Singh', { badge: 'Active', tone: 'success' }],
  ['PHC Devgarh', 'PHC', 'Devgarh Village Rd', '+91 97xxx 65089', 'Dr. M. Das', { badge: 'Active', tone: 'success' }],
  ['District Hospital Central', 'District Hospital', 'Civil Lines, District HQ', '+91 91xxx 11223', 'Dr. A. Khan', { badge: 'Active', tone: 'success' }],
  ['PHC Kishanpur', 'PHC', 'Kishanpur Chowk', '+91 93xxx 78341', 'Dr. T. Roy', { badge: 'Active', tone: 'success' }],
  ['CHC Motihari', 'CHC', 'Station Rd, Motihari', '+91 95xxx 52960', 'Dr. V. Gupta', { badge: 'Active', tone: 'success' }],
  ['PHC Shantipur', 'PHC', 'Shantipur East', '+91 99xxx 40871', 'Unassigned', { badge: 'Inactive', tone: 'neutral' }],
]

export default function HealthCentresPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Health Centres"
        description="Manage all PHCs, CHCs, and hospitals in the district."
        action="Add Centre"
      />
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Type', 'Status']}
        searchPlaceholder="Search centres..."
        emptyLabel="No health centres found."
        emptyAction="Add Centre"
      />
    </div>
  )
}
