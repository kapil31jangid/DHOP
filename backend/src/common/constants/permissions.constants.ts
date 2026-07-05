import { Role } from './roles.constants';

export type PermissionLevel = 'none' | 'view' | 'update' | 'full';

export interface ModulePermissions {
  dashboard: PermissionLevel;
  healthCentres: PermissionLevel;
  medicines: PermissionLevel;
  patients: PermissionLevel;
  beds: PermissionLevel;
  attendance: PermissionLevel;
  reports: PermissionLevel;
  auditLogs: PermissionLevel;
}

export const PERMISSIONS_MATRIX: Record<Role, ModulePermissions> = {
  [Role.DISTRICT_ADMIN]: {
    dashboard: 'full',
    healthCentres: 'full',
    medicines: 'view',
    patients: 'view',
    beds: 'view',
    attendance: 'view',
    reports: 'full',
    auditLogs: 'full',
  },
  [Role.FACILITY_ADMIN]: {
    dashboard: 'full',
    healthCentres: 'none',
    medicines: 'full',
    patients: 'full',
    beds: 'full',
    attendance: 'full',
    reports: 'full',
    auditLogs: 'view',
  },
  [Role.HEALTHCARE_STAFF]: {
    dashboard: 'full',
    healthCentres: 'none',
    medicines: 'update',
    patients: 'full',
    beds: 'view',
    attendance: 'view',
    reports: 'view',
    auditLogs: 'none',
  },
  [Role.OPERATIONS_STAFF]: {
    dashboard: 'full',
    healthCentres: 'none',
    medicines: 'view',
    patients: 'view',
    beds: 'full',
    attendance: 'update',
    reports: 'view',
    auditLogs: 'none',
  },
};
