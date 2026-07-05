import { BaseRepository } from '../../database/base.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

export abstract class BaseService<T> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async findMany(options?: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<T[]> {
    return this.repository.findMany(options);
  }

  async findOne(id: string, select?: string): Promise<T> {
    const record = await this.repository.findOne(id, select);
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }

  /**
   * Asserts if the logged-in user is allowed to access/mutate a resource scoped to a facility.
   * District admins bypass this. Other roles are restricted to their own facilityId.
   */
  assertFacilityScope(user: any, facilityIdInRecord: string | null): void {
    if (user.role !== 'DISTRICT_ADMIN') {
      if (!user.facilityId || user.facilityId !== facilityIdInRecord) {
        throw new ForbiddenException(
          'Access denied: Action is restricted to the user\'s assigned facility context',
        );
      }
    }
  }

  /**
   * Helper to build filters scoped by the user's role and facility ID.
   */
  getFacilityFilters(
    user: any,
    additionalFilters?: Record<string, any>,
  ): Record<string, any> {
    const filters: Record<string, any> = { ...additionalFilters };
    if (user.role !== 'DISTRICT_ADMIN') {
      filters.facility_id = user.facilityId;
    }
    return filters;
  }
}
