import { Document } from 'mongoose';

export default interface Sport extends Document {
    name: string;
}