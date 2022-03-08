import { Schema, model } from 'mongoose';
import SportsClass from '@/resources/sportsClass/sportsClass.interface'


//sports class schema
/**
 * @swagger
 * components:
 *   schemas:
 *     SportsClass:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Sport ID.
 *           example: 62124b4fbed6940f1b55d992
 *         title:
 *           type: string
 *           description: Title of the sports class.
 *           example: Learn Football
 *         description:
 *           type: string
 *           description: Description of the sports class.
 *           example: Learning the rules and techniques of football
 *         sport:
 *           type: string
 *           description: Selected sport for the class.
 *           example: Football
 *         ageLevel:
 *           type: string
 *           description: Age level for the sport.
 *           example: Adults
 *         weekSchedule:
 *           type: string
 *           description: List of dates with time for the class schedule.
 *           example: [2022-02-20T13:51:31.537+00:00, 2022-02-21T13:51:31.537+00:00]
 *         classStart:
 *           type: string
 *           description: Date when the class starts.
 *           example: 2022-02-20T13:51:31.537+00:00
 *         classDuration:
 *           type: string
 *           description: How many days does the class last.
 *           example: 5
 *         createdBy:
 *           type: string
 *           description: Id of the admin that created the class.
 *           example: 62124b4fbed6940f1b55d992
 *         createdAt:
 *           type: string
 *           description: Date and time when the sport was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the sport was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */
const SportsClassSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        sport: {
            type: String,
            required: true
        },
        ageLevel: {
            type: String,
            required: true
        },
        weekSchedule: {
            type: [Date],
            required: true
        },
        classStart: {
            type: Date,
            required: true
        },
        classDuration: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

export default model<SportsClass>('SportsClass', SportsClassSchema);

//create sports class body
/**
 * @swagger
 * components:
 *   schemas:
 *     Create sports class:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the sports class.
 *           example: Learn Football
 *         description:
 *           type: string
 *           description: Description of the sports class.
 *           example: Learning the rules and techniques of football
 *         sport:
 *           type: string
 *           description: Selected sport for the class.
 *           example: Football
 *         ageLevel:
 *           type: string
 *           description: Age level for the sport.
 *           example: Adults
 *         weekSchedule:
 *           type: string
 *           description: List of dates with time for the class schedule.
 *           example: [2022-02-20T13:51:31.537+00:00, 2022-02-21T13:51:31.537+00:00]
 *         classStart:
 *           type: string
 *           description: Date when the class starts.
 *           example: 2022-02-20T13:51:31.537+00:00
 *         classDuration:
 *           type: string
 *           description: How many days does the class last.
 *           example: 5
 *         createdBy:
 *           type: string
 *           description: Id of the admin that created the class.
 *           example: 62124b4fbed6940f1b55d992
 */