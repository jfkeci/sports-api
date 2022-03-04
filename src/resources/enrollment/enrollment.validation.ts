
import Joi from 'joi'

export const validate = Joi.object({
    userId: Joi.string().required(),
    classId: Joi.string().required(),
});