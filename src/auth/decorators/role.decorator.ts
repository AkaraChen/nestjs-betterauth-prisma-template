import { Reflector } from '@nestjs/core';
import { Role } from '../types/auth.types';

export const Roles = Reflector.createDecorator<Role[]>();
