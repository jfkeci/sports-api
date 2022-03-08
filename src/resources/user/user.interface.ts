import { Document } from 'mongoose';

export default interface User extends Document {
    email: string;
    name: string;
    password: string;
    role: string;
    verificationCode: string;
    passwordResetCode: string;
    verified: boolean;

    isValidPassword(password: string): Promise<Error | boolean>;
}