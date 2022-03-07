import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/sportsClass/sportsClass.validation'
import SportsClassService from '@/resources/sportsClass/sportsClass.service';
import { authAdmin } from '@/middleware/authenticated.middleware';
import { isValidId, validateDateRange, validateStartDate } from '@/utils/validate.utils';
import SportService from '@/resources/sport/sport.service';

class SportsClassController implements Controller {
    public path = '/classes';
    public router = Router();

    private SportsClassService = new SportsClassService();
    private SportService = new SportService();

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

        this.router.delete(
            `${this.path}/:id`,
            this.deleteSportsClass
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

            const sports = await this.SportService.getSports(String(sport))

            if (sports.length == 0 || !sports) return next(
                new HttpException(404, 'No sport found - ' + sport)
            );

            if (!validateDateRange(weekSchedule, classDuration)) {
                return next(new HttpException(
                    400,
                    '"classDuration" too short'
                ));
            }

            if (!validateStartDate(classStart, weekSchedule)) {
                return next(new HttpException(
                    400,
                    '"classStart" cannot be greater than "weekSchedule[0]"'
                ));
            }

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
            return next(new HttpException(400, error.message));
        }
    };

    private getSportsClasses = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, age } = req.params;

            const sportsClasses = await this.SportsClassService.getSportsClasses(
                String(name),
                String(age),
            );

            if (!sportsClasses) return next(new HttpException(404, 'No classes found'));

            return res.status(201).json(sportsClasses);
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    };

    private getSportsClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const sportsClass = await this.SportsClassService.getSportsClass(id);

            if (!sportsClass) return next(new HttpException(404, 'No class found'));

            return res.status(200).json(sportsClass);
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }

    private deleteSportsClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const sportsClass = await this.SportsClassService.deleteSportsClass(id);

            if (!sportsClass) return next(new HttpException(404, 'Invalid id'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }
}

export default SportsClassController;