import { CalendarClock, Pill, TriangleAlert } from 'lucide-react'
import { DataTable, type Cell } from '@/components/dhop/data-table'
import { KpiCard } from '@/components/dhop/kpi-card'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Medicine', 'Category', 'Batch No.', 'Expiry Date', 'Quantity', 'Threshold', 'Status']

const rows: Cell[][] = [
  ['Paracetamol 500mg', 'Analgesic', 'A-102', '12 Sep 2026', '48', '100', { badge: 'Low Stock', tone: 'critical' }],
  ['ORS Sachets', 'Rehydration', 'C-310', '02 Mar 2027', '35', '80', { badge: 'Low Stock', tone: 'critical' }],
  ['Amoxicillin 250mg', 'Antibiotic', 'A-204', '06 Jul 2026', '210', '150', { badge: 'Expiring Soon', tone: 'warning' }],
  ['Metformin 500mg', 'Antidiabetic', 'M-118', '20 Jan 2027', '460', '200', { badge: 'Good', tone: 'success' }],
  ['Ibuprofen 400mg', 'Analgesic', 'B-203', '18 Nov 2026', '820', '200', { badge: 'Good', tone: 'success' }],
  ['Amlodipine 5mg', 'Antihypertensive', 'H-077', '30 Apr 2027', '390', '150', { badge: 'Good', tone: 'success' }],
  ['Cetirizine 10mg', 'Antihistamine', 'D-441', '11 Oct 2026', '275', '100', { badge: 'Good', tone: 'success' }],
  ['Iron-Folic Acid', 'Supplement', 'S-522', '25 Aug 2026', '95', '120', { badge: 'Low Stock', tone: 'critical' }],
  ['Azithromycin 500mg', 'Antibiotic', 'A-330', '14 Feb 2027', '180', '100', { badge: 'Good', tone: 'success' }],
]

export default function MedicinesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Medicines"
        description="Track inventory, stock levels, and expiry across the centre."
        action="Add Medicine"
        secondaryAction="Update Stock"
      />
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Total Medicines" value="148" icon={Pill} />
        <KpiCard label="Low Stock" value="3" icon={TriangleAlert} tone="critical" />
        <KpiCard label="Expiring Soon" value="5" icon={CalendarClock} tone="warning" />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Category', 'Status']}
        searchPlaceholder="Search medicines..."
        emptyLabel="No medicines found."
        emptyAction="Add Medicine"
      />
    </div>
  )
}
