import mongoose from "mongoose";

export const isValidId = (id: string): boolean => {
    if (!id) return false;

    if (!mongoose.Types.ObjectId.isValid(id)) return false

    return true;
}