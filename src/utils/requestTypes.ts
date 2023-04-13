import { UserInfoResponse } from './userTypes'
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: any;
}