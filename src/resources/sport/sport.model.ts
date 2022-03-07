import { Schema, model } from 'mongoose';
import Sport from '@/resources/sport/sport.interface'

//sport schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Sport:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Sport ID.
 *           example: 62124b4fbed6940f1b55d992
 *         name:
 *           type: string
 *           description: Name of the sport.
 *           example: Football
 *         createdAt:
 *           type: string
 *           description: Date and time when the sport was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the sport was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */
const SportSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

export default model<Sport>('Sport', SportSchema);


//create sport body schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Create Sport body:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the sport.
 *           example: Football
 */