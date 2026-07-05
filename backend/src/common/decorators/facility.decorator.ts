import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FacilityId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.facilityId || request.user?.facility_id || null;
  },
);
