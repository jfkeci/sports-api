
import Joi from 'joi'

export const validate = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(255).required(),
    sport: Joi.string().max(30).required(),
    ageLevel: Joi.string().required().valid(
        'Children',
        'Youth',
        'Young adults',
        'Adults'
    ),
    weekSchedule: Joi.array().items(Joi.date()),
    classStart: Joi.date().required(),
    classDuration: Joi.number().required(),
    createdBy: Joi.string().required(),
});