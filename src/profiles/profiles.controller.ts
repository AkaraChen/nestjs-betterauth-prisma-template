import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserId } from '../auth/decorators/user-id.decorator';
import { ProfileVo } from './vo/profile.vo';
import { Role } from '../../generated/prisma';
import { Auth } from '../auth/decorators/auth.decorators';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user profile has been successfully returned.',
    type: ProfileVo,
  })
  @Auth(Role.USER)
  findMyProfile(@UserId() userId: string) {
    return this.profilesService.findOne(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user profile has been successfully updated.',
    type: ProfileVo,
  })
  @Auth(Role.USER)
  updateMyProfile(
    @UserId() userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.upsert(userId, updateProfileDto);
  }

  @Public()
  @Get(':userId')
  @ApiParam({ name: 'userId', description: 'The ID of the user to retrieve' })
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user profile has been successfully returned.',
    type: ProfileVo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
  })
  findUserPofile(@Param('userId') userId: string) {
    return this.profilesService.findOne(userId);
  }
}
