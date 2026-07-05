import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BaseService } from '../../common/services/base.service';
import { UsersRepository } from './users.repository';
import { FIREBASE_ADMIN } from '../../database/firebase.provider';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService extends BaseService<any> {
  constructor(
    protected readonly usersRepository: UsersRepository,
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
  ) {
    super(usersRepository);
  }

  async createUser(dto: CreateUserDto, creatorUser: any): Promise<any> {
    // Assert facility scope if creator is FACILITY_ADMIN
    if (creatorUser.role === 'FACILITY_ADMIN') {
      dto.facilityId = creatorUser.facilityId;
    }

    let firebaseUid = dto.firebaseUid;

    // If no firebaseUid is passed, create the user in Firebase Auth using Admin SDK
    if (!firebaseUid) {
      if (!dto.password) {
        throw new BadRequestException('Password is required to create a new user profile');
      }

      try {
        const firebaseUser = await this.firebaseAdmin.auth().createUser({
          email: dto.email,
          password: dto.password,
          displayName: dto.name,
        });
        firebaseUid = firebaseUser.uid;
      } catch (err) {
        throw new BadRequestException(`Firebase user creation failed: ${err.message}`);
      }
    }

    // Save user profile in Supabase
    try {
      const userRecord = await this.create({
        facility_id: dto.facilityId || null,
        name: dto.name,
        email: dto.email,
        role: dto.role,
        firebase_uid: firebaseUid,
        status: dto.status || 'Active',
      });
      return userRecord;
    } catch (err) {
      // Rollback Firebase user if Supabase insert fails and we created it
      if (!dto.firebaseUid && firebaseUid) {
        await this.firebaseAdmin.auth().deleteUser(firebaseUid).catch(() => {});
      }
      throw new BadRequestException(`PostgreSQL user record registration failed: ${err.message}`);
    }
  }

  async deleteUser(id: string, currentUser: any): Promise<void> {
    const user = await this.findOne(id);
    this.assertFacilityScope(currentUser, user.facility_id);

    // Delete from Firebase Auth
    if (user.firebase_uid) {
      await this.firebaseAdmin
        .auth()
        .deleteUser(user.firebase_uid)
        .catch((err) => {
          // Log but continue if user doesn't exist in Firebase
          console.warn(`[UsersService.deleteUser] Firebase user not found or failed to delete: ${err.message}`);
        });
    }

    // Delete from Supabase PostgreSQL
    await this.delete(id);
  }
}
