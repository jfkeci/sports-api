import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation'
import UserService from '@/resources/user/user.service';
import { authAdmin, authUser } from '@/middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();

    private UserService = new UserService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}/user/register`,
            validationMiddleware(validate.register),
            this.registerUser
        );

        this.router.post(
            `${this.path}/admin/register`,
            validationMiddleware(validate.register),
            this.registerAdmin
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authUser, this.getUser);
        this.router.get(`${this.path}/admin`, authAdmin, this.getUser);
    }

    private registerUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(
                name,
                email,
                password,
                'user'
            );

            return res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private registerAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(
                name,
                email,
                password,
                'admin'
            );

            return res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);

            return res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) return next(new HttpException(404, 'No logged in user'));

        return res.status(200).json({ user: req.body });
    }
}

export default UserController;