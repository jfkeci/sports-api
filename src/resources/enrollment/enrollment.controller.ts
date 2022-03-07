import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/enrollment/enrollment.validation'
import EnrollmentService from '@/resources/enrollment/enrollment.service';
import { authAdmin, authPublic, authUser } from '@/middleware/authenticated.middleware';
import { hasMaxEnrollments, hasMaxUsers, isValidId } from '@/utils/validate.utils';
import { ResolvedConfigFileName } from 'typescript';

class EnrollmentController implements Controller {
    public path = '/enrollments';
    public router = Router();

    private EnrollmentService = new EnrollmentService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        // [x] Create enrollment - user auth
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate), authUser],
            this.createEnrollment
        );

        // [x] Get all enrollments - admin auth
        this.router.get(
            `${this.path}`,
            authAdmin,
            this.getEnrollments
        );

        // [x] Get enrollment by id - admin auth
        this.router.get(
            `${this.path}/:id`,
            authAdmin,
            this.getEnrollment
        );

        // [x] Get enrollment by user and class pair - admin auth
        this.router.get(
            `${this.path}/pair/:userId/:classId`,
            authAdmin,
            this.enrollmentByUserClassPair
        );

        // [x] Get enrollment by user - user auth
        this.router.get(
            `${this.path}/user/:userId`,
            authUser,
            this.enrollmentsByUserId
        );

        // [x] Get enrollment by class - admin auth
        this.router.get(
            `${this.path}/class/:classId`,
            authAdmin,
            this.enrollmentsByClassId
        );

        // [x] Delete enrollment (unenroll) - admin and user
        this.router.delete(
            `${this.path}/:id`,
            authPublic,
            this.deleteEnrollment
        );

        // [] Update enrollment - user auth
        this.router.put(
            `${this.path}/:id`,
            authUser,
            this.updateEnrollment
        );
    }

    private createEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, classId } = req.body;

            if (!isValidId(userId)) return next(new HttpException(404, 'Invalid user id'));
            if (!isValidId(classId)) return next(new HttpException(404, 'Invalid class id'));

            const userHasMaxEnrollments = await hasMaxUsers(userId);
            const classHasMaxEnrollments = await hasMaxEnrollments(classId);

            if (userHasMaxEnrollments) return next(
                new HttpException(409, 'Max number of enrollments reached for user')
            );
            if (classHasMaxEnrollments) return next(
                new HttpException(409, 'Max number of enrolled users reached for class')
            );

            const enrollment = await this.EnrollmentService.createEnrollment(userId, classId);

            if (!enrollment) return next(new HttpException(400, 'Something went wrong'));

            return res.status(201).json(enrollment);
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    };

    private getEnrollments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const enrollments = await this.EnrollmentService.getEnrollments();

            if (!enrollments) return next(new HttpException(404, 'No enrollments found'));

            return res.status(200).json({ enrollments });
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private getEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const enrollment = await this.EnrollmentService.getEnrollment(id);

            if (!enrollment) return next(new HttpException(404, 'No enrollment found'));

            return res.status(200).json(enrollment);
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    }

    private enrollmentsByUserId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userId = req.params.userId;

            if (!isValidId(userId)) return next(new HttpException(404, 'Invalid id'));

            const enrollments = await this.EnrollmentService.enrollmentsByUserId(userId);

            if (!enrollments) return next(new HttpException(404, 'No enrollment found'));

            return res.status(200).json(enrollments);
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    }

    private enrollmentsByClassId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const classId = req.params.classId;
            if (!isValidId(classId)) return next(new HttpException(404, 'Invalid id'));

            const enrollments = await this.EnrollmentService.enrollmentsByClassId(classId);

            if (!enrollments) return next(new HttpException(404, 'No enrollments found'));

            return res.status(200).json(enrollments);
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    }

    private enrollmentByUserClassPair = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, classId } = req.params;
            if (
                !isValidId(userId) ||
                !isValidId(classId)
            ) return next(new HttpException(404, 'Invalid id'));

            const enrollment = await this.EnrollmentService.enrollmentByUserClassPair(userId, classId);

            if (!enrollment) return next(new HttpException(404, 'No enrollment found'));

            return res.status(200).json(enrollment);
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    }

    private deleteEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            let enrollment = await this.EnrollmentService.deleteEnrollment(id);

            if (!enrollment) return next(new HttpException(404, 'Failed to delete'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    }

    private updateEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const enrollment = req.body;

            const updatedEnrollment = await this.EnrollmentService.updateEnrollment(id, enrollment);

            if (!updatedEnrollment) return next(new HttpException(404, 'Failed to update'))

            return res.status(200).json(updatedEnrollment)
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    }
}

export default EnrollmentController;