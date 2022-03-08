import { authAdmin, authPublic, authUser } from "@/middleware/authenticated.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import UserController from "@/resources/user/user.controller";
import validate from '@/resources/user/user.validation'

class UserRoutes {
    private router = Router();
    private path = '/users';

    public init(controller: UserController): Router {

        this.router.post(
            `${this.path}/user/register`,
            validationMiddleware(validate.register),
            controller.registerUser
        );

        this.router.post(
            `${this.path}/admin/register`,
            validationMiddleware(validate.register),
            controller.registerAdmin
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            controller.login
        );

        this.router.get(`${this.path}/:id`, controller.getUser);
        this.router.put(`${this.path}/:id`, controller.updateUser);
        this.router.get(`${this.path}`, controller.getUsers);
        this.router.delete(`${this.path}/:id`, controller.deleteUser);

        return this.router
    }

}

export default UserRoutes;