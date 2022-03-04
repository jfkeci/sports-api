import { Schema, model } from 'mongoose';
import Sport from '@/resources/sport/sport.interface'

const SportSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

export default model<Sport>('Sport', SportSchema);