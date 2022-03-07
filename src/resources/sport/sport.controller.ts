import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/sport/sport.validation'
import SportService from '@/resources/sport/sport.service';
import { authAdmin, authPublic } from '@/middleware/authenticated.middleware';
import { isValidId } from '@/utils/validate.utils';

class SportController implements Controller {
    public path = '/sports';
    public router = Router();

    private SportService = new SportService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        // [x] Create a new sport - admin auth
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate), authAdmin],
            this.createSport
        );

        // [x] Get all sports - user or admin
        this.router.get(
            `${this.path}`,
            authPublic,
            this.getSports
        );

        // [x] Get sport by id - admin auth
        this.router.get(
            `${this.path}/:id`,
            authAdmin,
            this.getSport
        );

        // [x] Delete sport - admin auth
        this.router.delete(
            `${this.path}/:id`,
            authAdmin,
            this.deleteSport
        );
    }

    private createSport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name } = req.body;

            const sport = await this.SportService.createSport(name);

            return res.status(201).json(sport);
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    };

    private getSports = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const name = req.query.name || '';

            const sports = await this.SportService.getSports(String(name));

            if (!sports) next(new HttpException(404, 'No sports found'))

            return res.status(200).json(sports);
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    };

    private getSport = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId) next(new HttpException(404, 'Invalid id'));

            const sport = await this.SportService.getSport(id);

            if (!sport) next(new HttpException(404, 'No sport found'));

            return res.status(201).json(sport);
        } catch (error: any) {
            return next(new HttpException(400, error.message))
        }
    };

    private deleteSport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id
            if (!isValidId(id)) next(new HttpException(404, 'Invalid id'))

            const sport = this.SportService.deleteSport(id);

            if (!sport) return next(new HttpException(404, 'No sport found'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    }
}

export default SportController;