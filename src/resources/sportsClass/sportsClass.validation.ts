
import Joi from 'joi'

export const validate = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(255).required(),
    sport: Joi.string().max(30).required(),
    ageLevel: Joi.string().max(30).required(),
    weekSchedule: Joi.required(),
    classStart: Joi.date().greater('now').required(),
    classDuration: Joi.number().required(),
    createdBy: Joi.string().min(2).max(30).required(),
});