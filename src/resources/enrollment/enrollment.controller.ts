import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/enrollment/enrollment.validation'
import EnrollmentService from '@/resources/enrollment/enrollment.service';
import { authAdmin, authUser } from '@/middleware/authenticated.middleware';
import { isValidId } from '@/utils/validateId';

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
            next(new HttpException(400, error.message));
        }
    };
}

export default EnrollmentController;