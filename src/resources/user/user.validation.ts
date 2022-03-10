
import Joi from 'joi'

const register = Joi.object({
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const passwordReset = Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

const forgotPassword = Joi.object({
    email: Joi.string().email().required(),
});

export default { register, login, passwordReset, forgotPassword };