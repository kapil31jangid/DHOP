import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMe(@CurrentUser() user: any) {
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new Error('Email is required');
    }
    const link = await this.authService.triggerPasswordReset(email);
    return {
      message: 'Password reset link generated successfully',
      resetLink: link,
    };
  }
}
