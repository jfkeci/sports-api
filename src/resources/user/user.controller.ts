import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation'
import UserService from '@/resources/user/user.service';
import { isValidId } from '@/utils/validate.utils';
import { authAdmin, authUser } from '@/middleware/authenticated.middleware';
import { sendEmail } from '@/utils/mailer'
import UserRoutes from './user.routes';

class UserController implements Controller {
    public router = Router();

    private UserService = new UserService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = new UserRoutes().init(this);
    }

    /**
     * Register user with role: 'user'
     */
    public registerUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const user = await this.UserService.getUserByEmail(email);
            if (user) return next(new HttpException(409, 'Account already exists'));

            await sendEmail({
                from: 'sportscomplex@info.com',
                to: email,
                subject: 'SportsComplex account verification',
                text: `Verification code: ${email}`
            });

            return res.send('')

            const token = await this.UserService.register(
                name,
                email,
                password,
                'user'
            );

            if (!token) return next(new HttpException(400, 'Something went wrong'));

            return res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * Register user with role: 'admin'
     */
    public registerAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const user = await this.UserService.getUserByEmail(email);
            if (user) return next(new HttpException(409, 'Account already exists'))

            const token = await this.UserService.register(
                name,
                email,
                password,
                'admin'
            );

            if (!token) next(new HttpException(400, 'Something went wrong'));

            return res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * Login user
     */
    public login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const token = await this.UserService.login(req.body);

            if (!token) return next(new HttpException(404, 'Invalid credentials'));

            return res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**
     * Get single user by id
     */
    public getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;

            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const user = await this.UserService.getUser(id);
            if (!user) return next(new HttpException(404, 'No user found'));

            return res.status(200).json({ user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    /**
     * Get all users
     */
    public getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const users = await this.UserService.getUsers();

            if (!users) return next(new HttpException(404, 'No users found'));

            return res.status(200).json({ users });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    /**
     * Delete single user by id
     */
    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;

            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const user = await this.UserService.deleteUser(id);

            if (!user) return next(new HttpException(404, 'No user found'));

            return res.status(204).send();
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    /**
     * Update single user by id
     */
    public updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const user = await this.UserService.getUser(id);

            if (!user) return next(new HttpException(404, 'No user found'));

            const updatedUser = await this.UserService.updateUser(id, req.body)

            if (!updatedUser) return next(new HttpException(400, 'Failed to update'));

            return res.status(200).json({ user: updatedUser });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }
}

export default UserController;

/**
 * @swagger
 * /users/user/register:
 *   get:
 *     summary: Register a new user
 *     description: Add a new user with 'user' role to the database
 *     tags:
 *       - user
 *     requestBody:
 *       description: Register user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: A successfull operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
     
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of Picture Gallery users.
 *     description: Retrieve a list of Sports compley users with user role
 *     tags:
 *       - user
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */