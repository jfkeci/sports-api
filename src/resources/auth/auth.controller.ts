import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import UserService from '@/resources/user/user.service';
import { isValidId } from '@/utils/validate.utils';
import { sendEmail } from '@/utils/mailer/mailer'
import AuthRoutes from '@/resources/auth/auth.routes';
import { nanoid } from 'nanoid';
import token from '@/utils/token';
import bcrypt from 'bcrypt';

class AuthController implements Controller {
    public router = Router();

    private UserService = new UserService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = new AuthRoutes().init(this);
    }

    /**
     * Login user
     */
    public login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body
            const user = await this.UserService.getUserByEmail(email);

            if (!user) return next(new HttpException(404, 'Invalid credentials'));

            if (!user.verified) return next(new HttpException(400, 'User not verified'));

            if (!await user.isValidPassword(password)) {
                return next(new HttpException(404, 'Invalid credentials'));
            }

            const authToken = await token.createToken(user);

            if (!authToken) return next(new HttpException(404, 'Invalid credentials'));

            return res.status(200).json({ authToken });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };

    /**
     * Reset user password
     */
    public resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id, passwordResetCode } = req.params;

            const { password } = req.body;

            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const user = await this.UserService.getUser(id);

            if (!user) return next(new HttpException(404, 'No user found'));

            if (!user.passwordResetCode || user.passwordResetCode != passwordResetCode) {
                return next(new HttpException(400, 'Bad request'));
            }

            user.passwordResetCode = '';

            const hash = await bcrypt.hash(password, 10);

            user.password = hash;

            const updatedUser = this.UserService.updateUser(id, user);

            if (!updatedUser) return next(new HttpException(400, 'Something went wrong'));

            return res.status(200).send("Successfully updated password");
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    }

    /**
     * Set passwordResetCode and send email for password reset
     */
    public forgotPasswordHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email } = req.body;

            const user = await this.UserService.getUserByEmail(email);

            if (!user) return next(new HttpException(404, 'No user with this email'));

            if (!user.verified) return next(new HttpException(409, 'User not verified'));

            const resetCode = nanoid();

            user.passwordResetCode = resetCode;

            const updatedUser = await this.UserService.updateUser(user._id, user);

            if (!updatedUser) return next(new HttpException(400, 'Something went wrong'))

            await sendEmail({
                from: 'sportscomplex@info.com',
                to: user.email,
                subject: "Reset your password",
                text: `Password reset code: ${resetCode}. Id ${user._id}`,
            });

            return res.status(200).send('If user with this email is registered, you will recieve a password reset email');
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    }

    /**
     * Verify user
     */
    public verifyUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id, verificationCode } = req.params;

            if (!isValidId) return next(new HttpException(404, 'Invalid id'));

            const user = await this.UserService.getUser(id);

            if (!user) return next(new HttpException(404, 'No user found'));

            if (user.verified) return res.status(200).send('User already verified');

            if (user.verificationCode == verificationCode) {
                user.verified = true;

                const updatedUser = await this.UserService.updateUser(id, user);

                if (!updatedUser) {
                    return next(new HttpException(400, 'Something went wrong'))
                }

                return res.status(200).send('User successfully verified')
            }

            return next(new HttpException(400, 'Couldn\'t verify user'))
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    }
}

export default AuthController;
