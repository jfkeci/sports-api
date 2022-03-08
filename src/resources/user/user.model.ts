import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'
import User from '@/resources/user/user.interface'
import { string } from 'joi';
import { nanoid } from 'nanoid';
//user schema
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID.
 *           example: 62124b4fbed6940f1b55d992
 *         name:
 *           type: string
 *           description: User first name and last name.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User email.
 *           example: john.doe@mail.com
 *         password:
 *           type: string
 *           description: User password, hashed with bcryptjs.
 *           example: $2a$12$qkd8Fk/kN5UFPuT25b3kpum/xr4pSCHZwlk3Ho9Oa6DVCrBhV45RW
 *         createdAt:
 *           type: string
 *           description: Date and time when the user was created
 *           example: 2022-02-20T13:51:31.537+00:00
 *         updatedAt:
 *           type: string
 *           description: Date and time when the user was updated
 *           example: 2022-02-20T13:51:31.537+00:00
 */
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
        },
        verificationCode: {
            type: String,
            default: () => nanoid()
        },
        passwordResetCode: {
            type: String,
        },
        verified: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);


UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, Number(process.env.SALT));

    this.password = hash;

    next();
})


UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password)
}

export default model<User>('User', UserSchema);

// Register user schema
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User first name and last name.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User email.
 *           example: john.doe@mail.com
 *         password:
 *           type: string
 *           description: User password.
 *           example: password
 *     LoginUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User email.
 *           example: john.doe@mail.com
 *         password:
 *           type: string
 *           description: User password.
 *           example: password
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Auth token.
 *           example: token
 */