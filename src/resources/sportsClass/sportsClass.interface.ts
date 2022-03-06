import { Document } from 'mongoose';

export default interface SportsClass extends Document {
    title: string;
    description: string;
    sport: string;
    ageLevel: string;
    weekSchedule: Array<Date>;
    classStart: Date;
    classDuration: number;
    createdBy: string;
}