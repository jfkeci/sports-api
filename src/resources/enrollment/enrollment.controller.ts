import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import EnrollmentService from '@/resources/enrollment/enrollment.service';
import { isValidId } from '@/utils/validate.utils';
import EnrollmentRoutes from './enrollment.routes';

class EnrollmentController implements Controller {
    public router = Router();

    private EnrollmentService = new EnrollmentService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = new EnrollmentRoutes().init(this);
    }

    /**
     * Create enrollment
     */
    public createEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId, classId } = req.body;

            if (!isValidId(userId)) return next(new HttpException(404, 'Invalid user id'));
            if (!isValidId(classId)) return next(new HttpException(404, 'Invalid class id'));

            if (await this.EnrollmentService.hasMaxEnrollments(userId, classId)) {
                return next(
                    new HttpException(409, 'Max number of enrollments reached for user')
                );
            }

            if (await this.EnrollmentService.hasMaxUsers(classId)) {
                return next(
                    new HttpException(409, 'Max number of enrolled users reached for class')
                );
            }

            if (await this.EnrollmentService.userEnrolledInClass(userId, classId)) {
                return next(
                    new HttpException(409, 'User already enrolled in this class')
                );
            }

            const enrollment = await this.EnrollmentService.createEnrollment(userId, classId);

            if (!enrollment) return next(new HttpException(400, 'Something went wrong'));

            return res.status(201).json(enrollment);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get all enrollments
     */
    public getEnrollments = async (
        _: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const enrollments = await this.EnrollmentService.getEnrollments();

            if (!enrollments) return next(new HttpException(404, 'No enrollments found'));

            return res.status(200).json({ enrollments });
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }

    /**
     * Get single enrollment by id
     */
    public getEnrollment = async (
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
            return next(new HttpException(500, error.message))
        }
    }

    /**
     * Get enrollments by user
     */
    public enrollmentsByUserId = async (
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
            return next(new HttpException(500, error.message))
        }
    }

    /**
     * Get enrollments by class
     */
    public enrollmentsByClassId = async (
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
            return next(new HttpException(500, error.message))
        }
    }

    /**
     * Get enrollment by user class pair
     */
    public enrollmentByUserClassPair = async (
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
            return next(new HttpException(500, error.message))
        }
    }

    /**
     * Delete enrollment by id
     */
    public deleteEnrollment = async (
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


    /**
     * Update single enrollment
     */
    public updateEnrollment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const enrollment = req.body;

            if (!isValidId(enrollment.userId)) return next(new HttpException(404, 'Invalid id'));
            if (!isValidId(enrollment.classId)) return next(new HttpException(404, 'Invalid class id'));

            if (await this.EnrollmentService.hasMaxEnrollments(enrollment.userId, enrollment.classId)) {
                return next(
                    new HttpException(409, 'Max number of enrollments reached for user')
                );
            }
            if (await this.EnrollmentService.hasMaxUsers(enrollment.classId)) {
                return next(
                    new HttpException(409, 'Max number of enrolled users reached for class')
                );
            }

            const updatedEnrollment = await this.EnrollmentService.updateEnrollment(id, enrollment);

            if (!updatedEnrollment) return next(new HttpException(404, 'Failed to update'))

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message))
        }
    }
}

export default EnrollmentController;