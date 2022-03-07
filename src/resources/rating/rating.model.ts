import { Schema, model } from 'mongoose';
import Rating from '@/resources/rating/rating.interface'

//rating schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Rating ID.
 *           example: 62124b4fbed6940f1b55d992
 *         text:
 *           type: string
 *           description: Rating comment.
 *           example: Class was fun
 *         rating:
 *           type: number
 *           description: Rating value (Accepts numbers from 1 to 5).
 *           example: 3
 *         userId:
 *           type: string
 *           description: User that is rating a class.
 *           example: 62124b4fbed69adqwb55d992
 *         classId:
 *           type: string
 *           description: Class the user is commenting.
 *           example: 62124b4fbed6940f1b55da2w
 *         createdAt:
 *           type: string
 *           description: Date and time when the rating was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the rating was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */
const RatingSchema = new Schema(
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

export default model<Rating>('Rating', RatingSchema);

//rating body schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Create rating body:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Rating comment.
 *           example: Class was fun
 *         rating:
 *           type: number
 *           description: Rating value (Accepts numbers from 1 to 5).
 *           example: 3
 *         userId:
 *           type: string
 *           description: User that is rating a class.
 *           example: 62124b4fbed69adqwb55d992
 *         classId:
 *           type: string
 *           description: Class the user is commenting.
 *           example: 62124b4fbed6940f1b55da2w
 */