import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from './config/app.config';
import firebaseConfig from './config/firebase.config';
import supabaseConfig from './config/supabase.config';
import { validate } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { HealthCentresModule } from './modules/health-centres/health-centres.module';
import { PatientsModule } from './modules/patients/patients.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { BedsModule } from './modules/beds/beds.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, firebaseConfig, supabaseConfig],
      validate,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DistrictsModule,
    HealthCentresModule,
    PatientsModule,
    MedicinesModule,
    BedsModule,
    AttendanceModule,
    ReportsModule,
    NotificationsModule,
    AuditLogsModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
