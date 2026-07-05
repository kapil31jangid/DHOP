import { Stethoscope, UsersRound, Activity } from 'lucide-react'
import { DataTable, type Cell } from '@/components/dhop/data-table'
import { KpiCard } from '@/components/dhop/kpi-card'
import { PageHeader } from '@/components/dhop/page-header'

const columns = ['Patient ID', 'Name', 'Age', 'Gender', 'Visit Type', 'Disease Category', 'Assigned Doctor', 'Visit Date']

const rows: Cell[][] = [
  ['PT-1042', 'Ramesh Kumar', '46', 'Male', { badge: 'OPD', tone: 'info' }, 'Hypertension', 'Dr. S. Verma', 'Today'],
  ['PT-1041', 'Sunita Devi', '34', 'Female', { badge: 'IPD', tone: 'warning' }, 'Maternity', 'Dr. P. Singh', 'Today'],
  ['PT-1040', 'Arjun Yadav', '8', 'Male', { badge: 'OPD', tone: 'info' }, 'Fever / Viral', 'Dr. T. Roy', 'Today'],
  ['PT-1039', 'Meena Kumari', '61', 'Female', { badge: 'IPD', tone: 'warning' }, 'Diabetes', 'Dr. S. Verma', 'Yesterday'],
  ['PT-1038', 'Farhan Ali', '27', 'Male', { badge: 'OPD', tone: 'info' }, 'Minor Injury', 'Dr. K. Iyer', 'Yesterday'],
  ['PT-1037', 'Lakshmi Bai', '52', 'Female', { badge: 'OPD', tone: 'info' }, 'Respiratory', 'Dr. R. Nair', 'Yesterday'],
  ['PT-1036', 'Vikram Singh', '39', 'Male', { badge: 'IPD', tone: 'warning' }, 'Dengue', 'Dr. M. Das', '2 days ago'],
  ['PT-1035', 'Anita Sharma', '29', 'Female', { badge: 'OPD', tone: 'info' }, 'Skin / Allergy', 'Dr. V. Gupta', '2 days ago'],
  ['PT-1034', 'Gopal Das', '70', 'Male', { badge: 'OPD', tone: 'info' }, 'Arthritis', 'Dr. S. Verma', '3 days ago'],
]

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patients"
        description="Register and manage patient records for this centre."
        action="Register Patient"
      />
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Today's Patients" value="64" icon={UsersRound} />
        <KpiCard label="OPD Count" value="52" icon={Stethoscope} />
        <KpiCard label="IPD Count" value="12" icon={Activity} />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        filters={['Visit Type', 'Date']}
        searchPlaceholder="Search patients..."
        emptyLabel="No patients found."
        emptyAction="Register Patient"
      />
    </div>
  )
}
