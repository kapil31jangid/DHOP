import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SupabaseClient } from '@supabase/supabase-js';
import { FIREBASE_ADMIN } from '../../database/firebase.provider';
import { SUPABASE_CLIENT } from '../../database/supabase.provider';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      const firebaseUid = decodedToken.uid;

      // Fetch user profile from Supabase
      const { data: user, error } = await this.supabase
        .from('users')
        .select('id, name, email, role, facility_id, status')
        .eq('firebase_uid', firebaseUid)
        .eq('status', 'Active')
        .maybeSingle();

      if (error || !user) {
        throw new UnauthorizedException('User profile not found or inactive');
      }

      // Attach user profile to request object
      request.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        facilityId: user.facility_id,
        firebaseUid,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message || 'Invalid authentication token');
    }
  }
}
