import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

export const FirebaseAdminProvider: Provider = {
  provide: FIREBASE_ADMIN,
  useFactory: (configService: ConfigService) => {
    const projectId = configService.get<string>('firebase.projectId');
    const clientEmail = configService.get<string>('firebase.clientEmail');
    const privateKey = configService.get<string>('firebase.privateKey');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin configurations are missing');
    }

    if (admin.apps.length === 0) {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    return admin.app();
  },
  inject: [ConfigService],
};
export type FirebaseAdminApp = admin.app.App;
