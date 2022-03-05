import { Schema, model } from 'mongoose';
import Enrollment from '@/resources/enrollment/enrollment.interface'
import { number } from 'joi';

const EnrollmentSchema = new Schema(
    {
        text: {
            type: String,
            maxLength: 255,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        classId: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

export default model<Enrollment>('Enrollment', EnrollmentSchema);