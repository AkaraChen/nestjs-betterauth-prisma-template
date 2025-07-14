import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  imports: [],
  controllers: [ProfilesController],
  providers: [ProfilesService, AuthGuard],
})
export class ProfilesModule {}
