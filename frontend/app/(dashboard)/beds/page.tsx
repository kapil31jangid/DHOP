import { BedDouble, BedSingle, CircleCheck } from 'lucide-react'
import { DataTable, type Cell } from '@/components/dhop/data-table'
import { KpiCard } from '@/components/dhop/kpi-card'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Bed No.', 'Ward', 'Bed Type', 'Assigned Patient', 'Status']

const rows: Cell[][] = [
  ['B-01', 'General', 'Standard', 'Sunita Devi (PT-1041)', { badge: 'Occupied', tone: 'warning' }],
  ['B-02', 'General', 'Standard', 'Meena Kumari (PT-1039)', { badge: 'Occupied', tone: 'warning' }],
  ['B-03', 'General', 'Standard', '—', { badge: 'Available', tone: 'success' }],
  ['B-04', 'General', 'Standard', 'Vikram Singh (PT-1036)', { badge: 'Occupied', tone: 'warning' }],
  ['B-05', 'General', 'Standard', '—', { badge: 'Available', tone: 'success' }],
  ['B-06', 'Maternity', 'Standard', 'Pooja Rani (PT-1029)', { badge: 'Occupied', tone: 'warning' }],
  ['B-07', 'Maternity', 'Standard', '—', { badge: 'Available', tone: 'success' }],
  ['B-08', 'Emergency', 'Oxygen Support', '—', { badge: 'Available', tone: 'success' }],
  ['B-09', 'Emergency', 'Oxygen Support', 'Rahul Verma (PT-1031)', { badge: 'Occupied', tone: 'warning' }],
  ['B-10', 'General', 'Standard', '—', { badge: 'Maintenance', tone: 'neutral' }],
]

export default function BedsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Beds"
        description="Track bed availability across wards in this centre."
        action="Add Bed"
        secondaryAction="Update Status"
      />
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Total Beds" value="20" icon={BedDouble} />
        <KpiCard label="Occupied" value="12" icon={BedSingle} tone="warning" />
        <KpiCard label="Available" value="8" icon={CircleCheck} />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Ward', 'Status']}
        searchPlaceholder="Search beds..."
        emptyLabel="No beds found."
        emptyAction="Add Bed"
      />
    </div>
  )
}
