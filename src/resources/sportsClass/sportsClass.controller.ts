import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/sportsClass/sportsClass.validation'
import SportsClassService from '@/resources/sportsClass/sportsClass.service';
import { authAdmin } from '@/middleware/authenticated.middleware';
import { isValidId } from '@/utils/validateId';

class SportsClassController implements Controller {
    public path = '/classes';
    public router = Router();

    private SportsClassService = new SportsClassService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate),
            this.createSportsClass
        );

        this.router.get(
            `${this.path}`,
            this.getSportsClasses
        );
    }

    private createSportsClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                title,
                description,
                sport,
                ageLevel,
                weekSchedule,
                classStart,
                classDuration,
                createdBy
            } = req.body;

            const sportsClass = await this.SportsClassService.createSportsClass(
                title,
                description,
                sport,
                ageLevel,
                weekSchedule,
                classStart,
                classDuration,
                createdBy
            );

            if (!sportsClass) return next(new HttpException(400, 'Failed to create'));

            return res.status(201).json(sportsClass);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    private getSportsClasses = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const sportsClasses = this.SportsClassService.getSportsClasses();

            if (!sportsClasses) return next(new HttpException(404, 'No classes found'));

            return res.status(201).json(sportsClasses);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

}

export default SportsClassController;