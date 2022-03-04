import { Document } from 'mongoose';

export default interface Sport extends Document {
    userId: string;
    classId: string;
}