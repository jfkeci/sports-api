import EnrollmentService from "@/resources/enrollment/enrollment.service";
import mongoose from "mongoose";

const enrollmentService = new EnrollmentService();

export const isValidId = (id: string): boolean => {
    if (!id) return false;

    if (!mongoose.Types.ObjectId.isValid(id)) return false

    return true;
}

export const validateDateRange = (
    schedule: Array<Date>,
    duration: number
): boolean => {
    const date1 = schedule[0].getTime();
    const date2 = schedule[schedule.length - 1].getTime();

    const difference = (date2 - date1) / (1000 * 3600 * 24);


    return difference <= duration;
}

export const validateStartDate = (
    start: Date,
    schedule: Array<Date>
): boolean => {
    const date1 = start.getTime();
    const date2 = schedule[0].getTime();

    return date1 <= date2
}