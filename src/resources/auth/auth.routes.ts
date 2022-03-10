import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import AuthController from "@/resources/auth/auth.controller";
import validate from '@/resources/user/user.validation'

class AuthRoutes {
    private router = Router();
    private path = '/users';

    public init(controller: AuthController): Router {

        // [x] Login any user
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            controller.login
        );

        // [x] Verify user
        this.router.get(
            `${this.path}/verify/:id/:verificationCode`,
            controller.verifyUser
        );

        // [x] Set passwordResetCode and send email for password reset
        this.router.post(
            `${this.path}/password/forgot`,
            validationMiddleware(validate.forgotPassword),
            controller.forgotPasswordHandler
        );

        // [x] Reset user password
        this.router.post(
            `${this.path}/password/reset/:id/:passwordResetCode`,
            validationMiddleware(validate.passwordReset),
            controller.resetPassword
        );

        return this.router
    }

}

export default AuthRoutes;