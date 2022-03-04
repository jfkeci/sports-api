import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/sport/sport.validation'
import SportService from '@/resources/sport/sport.service';
import { authAdmin } from '@/middleware/authenticated.middleware';

class SportController implements Controller {
    public path = '/sports';
    public router = Router();

    private SportService = new SportService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate),
            this.createSport
        );

        this.router.get(`${this.path}`, this.getSports);
        this.router.get(`${this.path}/:id`, this.getSport);
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
            next(new HttpException(400, error.message));
        }
    };

    private getSports = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const sports = await this.SportService.getSports();
            return res.status(201).json(sports);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getSport = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        const { id } = req.params
        const sport = await this.SportService.getSport(id);
        return res.status(201).json(sport);
    };

    /* private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) return next(new HttpException(404, 'No logged in user'));

        return res.status(200).json({ user: req.body });
    } */
}

export default SportController;