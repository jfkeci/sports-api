import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/enrollment/enrollment.validation'
import EnrollmentService from '@/resources/enrollment/enrollment.service';
import { authAdmin, authUser } from '@/middleware/authenticated.middleware';
import { isValidId } from '@/utils/validateId';
import { ResolvedConfigFileName } from 'typescript';

class EnrollmentController implements Controller {
    public path = '/enrollments';
    public router = Router();

    private EnrollmentService = new EnrollmentService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate)],
            this.createEnrollment
        );

        this.router.get(`${this.path}`, this.getEnrollments)
        this.router.get(`${this.path}/:id`, this.getEnrollment)
        this.router.get(`${this.path}/pair/:userId/:classId`, this.enrollmentByUserClassPair)
        this.router.get(`${this.path}/user/:userId`, this.enrollmentsByUserId)
        this.router.get(`${this.path}/class/:classId`, this.enrollmentsByClassId)

        this.router.delete(`${this.path}/:id`, this.deleteEnrollment)
        this.router.put(`${this.path}/:id`, this.updateEnrollment)

    }

    private createEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, classId } = req.body;

            const enrollment = await this.EnrollmentService.createEnrollment(userId, classId);

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

            return res.status(201).json({ enrollments });
        } catch (error: any) {
            return next(new HttpException(500, error.message));
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

            return res.status(201).json(enrollment);
        } catch (error: any) {
            return next(new HttpException(500, error.message))
        }
    }

    private enrollmentsByUserId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userId = req.params.userId;
            console.log(userId)
            if (!isValidId(userId)) return next(new HttpException(404, 'Invalid id'));

            const enrollments = await this.EnrollmentService.enrollmentsByUserId(userId);

            if (!enrollments) return next(new HttpException(404, 'No enrollment found'));

            return res.status(201).json(enrollments);
        } catch (error: any) {
            return next(new HttpException(500, error.message))
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

            if (!enrollments) return next(new HttpException(404, 'No enrollment found'));

            return res.status(201).json(enrollments);
        } catch (error: any) {
            return next(new HttpException(500, error.message))
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

            return res.status(201).json(enrollment);
        } catch (error: any) {
            return next(new HttpException(500, error.message))
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
            return next(new HttpException(500, error.message))
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
            return next(new HttpException(500, error.message))
        }
    }
}

export default EnrollmentController;