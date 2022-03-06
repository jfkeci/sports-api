import { Schema, model } from 'mongoose';
import SportsClass from '@/resources/sportsClass/sportsClass.interface'

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
            type: [Object],
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