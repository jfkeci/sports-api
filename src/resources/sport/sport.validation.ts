import Joi from 'joi'

export const validate = Joi.object({
    name: Joi.string().min(2).max(30).required(),
});