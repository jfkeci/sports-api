import { authAdmin } from "@/middleware/authenticated.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import UserController from "@/resources/user/user.controller";
import validate from '@/resources/user/user.validation'

class UserRoutes {
    private router = Router();
    private path = '/users';

    public init(controller: UserController): Router {

        // [x] register a new user
        this.router.post(
            `${this.path}/user/register`,
            validationMiddleware(validate.register),
            controller.registerUser
        );

        // [x] Register a new admin
        this.router.post(
            `${this.path}/admin/register`,
            validationMiddleware(validate.register),
            controller.registerAdmin
        );

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
        this.router.get(
            `${this.path}/password/reset/:id/:passwordResetCode`,
            validationMiddleware(validate.passwordReset),
            controller.resetPassword
        );

        // [x] Get user by id
        this.router.get(`${this.path}/:id`, authAdmin, controller.getUser);

        // [x] Update user
        this.router.patch(`${this.path}/:id`, authAdmin, controller.updateUser);

        // [x] Get all users
        this.router.get(`${this.path}`, authAdmin, controller.getUsers);

        // [x] Delete user by id
        this.router.delete(`${this.path}/:id`, authAdmin, controller.deleteUser);

        return this.router
    }

}

export default UserRoutes;