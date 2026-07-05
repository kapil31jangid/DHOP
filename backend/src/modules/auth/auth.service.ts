import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from '../../database/firebase.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
  ) {}

  async triggerPasswordReset(email: string): Promise<string> {
    try {
      const link = await this.firebaseAdmin.auth().generatePasswordResetLink(email);
      return link;
    } catch (error) {
      throw new Error(`Firebase password reset generation failed: ${error.message}`);
    }
  }
}
