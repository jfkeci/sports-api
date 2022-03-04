import { Schema, model } from 'mongoose';
import Enrollment from '@/resources/enrollment/enrollment.interface'

const EnrollmentSchema = new Schema(
    {
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