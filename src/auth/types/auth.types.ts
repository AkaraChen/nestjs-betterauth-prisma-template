import { Request } from 'express';
import { betterAuth } from 'better-auth';

// Infer the session type from the better-auth instance
type AuthInstance = ReturnType<typeof betterAuth>;
type GetSessionReturn = ReturnType<AuthInstance['api']['getSession']>;
export type UserSession = NonNullable<Awaited<GetSessionReturn>>;

// Extend the Express Request type to include the session property
export interface RequestWithSession extends Request {
  session?: UserSession;
}
