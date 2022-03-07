import { Schema, model } from 'mongoose';
import Enrollment from '@/resources/enrollment/enrollment.interface'


//enrollment schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Enrollment ID.
 *           example: 62124b4fbed6940f1b55d992
 *         userId:
 *           type: string
 *           description: User that is enrolling a class.
 *           example: 62124b4fbed69adqwb55d992
 *         classId:
 *           type: string
 *           description: Class the user is enrolling to.
 *           example: 62124b4fbed6940f1b55da2w
 *         createdAt:
 *           type: string
 *           description: Date and time when the enrollment was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the enrollment was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */
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


//enrollment body schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Create enrollment body:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: User that is enrolling a class.
 *           example: 62124b4fbed69adqwb55d992
 *         classId:
 *           type: string
 *           description: Class the user is enrolling to.
 *           example: 62124b4fbed6940f1b55da2w
 */