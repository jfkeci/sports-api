
import Joi from 'joi'

export const validate = Joi.object({
    text: Joi.string().min(2).max(255).required(),
    rating: Joi.number().min(1).max(5).required(),
    userId: Joi.string().required(),
    classId: Joi.string().required()
});