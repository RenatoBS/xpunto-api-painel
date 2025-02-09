import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module as AdminModule } from 'src/common/admin/module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.register({}), AdminModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
