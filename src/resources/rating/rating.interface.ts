import { Document } from 'mongoose';

export default interface Sport extends Document {
    text: string;
    rating: number;
    userId: string;
    classId: string;
}