import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import SportsClassService from '@/resources/sportsClass/sportsClass.service';
import { isValidId, validateDateRange, validateStartDate } from '@/utils/validate.utils';
import SportService from '@/resources/sport/sport.service';
import SportsClassRoutes from './sportsClass.routes';

class SportsClassController implements Controller {
    public router = Router();

    private SportsClassService = new SportsClassService();
    private SportService = new SportService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = new SportsClassRoutes().init(this);
    }

    /**
     * Create a new sports class
     */
    public createSportsClass = async (
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

            if (!isValidId(createdBy)) return next(new HttpException(404, 'Invalid id'));

            const sports = await this.SportService.getSports(String(sport))

            if (sports.length == 0 || !sports) return next(
                new HttpException(404, 'No sport found - ' + sport)
            );

            if (!validateDateRange(weekSchedule, classDuration)) {
                return next(new HttpException(
                    409,
                    '"classDuration" too short'
                ));
            }

            if (!validateStartDate(classStart, weekSchedule)) {
                return next(new HttpException(
                    409,
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
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get all sports classes
     */
    public getSportsClasses = async (
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

            return res.status(200).json(sportsClasses);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get single sports class by id
     */
    public getSportsClass = async (
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
            return next(new HttpException(500, error.message));
        }
    }

    /**
     * Delete a sports class by id
     */
    public deleteSportsClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const sportsClass = await this.SportsClassService.deleteSportsClass(id);

            if (!sportsClass) return next(new HttpException(400, 'Failed to delete'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }

    /**
     * Update a sports class
     */
    public updateSportsClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;

            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const sportsClass = req.body;

            const updatedSportsClass = await this.SportsClassService.updateSportsClass(
                id,
                sportsClass
            );

            if (!updatedSportsClass) return next(new HttpException(400, 'Failed to update'))

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }
}

export default SportsClassController;