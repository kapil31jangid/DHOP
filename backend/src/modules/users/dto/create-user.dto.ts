import { Role } from '../../../common/constants/roles.constants';

export class CreateUserDto {
  facilityId?: string | null;
  name: string;
  email: string;
  role: Role;
  password?: string;
  firebaseUid?: string;
  status?: 'Active' | 'Inactive';
}
