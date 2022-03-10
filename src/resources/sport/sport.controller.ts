import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import SportService from '@/resources/sport/sport.service';
import { isValidId } from '@/utils/validate.utils';
import SportRoutes from '@/resources/sport/sport.routes';

class SportController implements Controller {
    public router = Router();

    private SportService = new SportService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = new SportRoutes().init(this);
    }

    /**
     * Create a new sport
     */
    public createSport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name } = req.body;

            const sport = await this.SportService.createSport(name);

            if (!sport) return next(new HttpException(400, 'Something went wrong'));

            return res.status(201).json(sport);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get all sports
     */
    public getSports = async (
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
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get single sport by id
     */
    public getSport = async (
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
            return next(new HttpException(500, error.message))
        }
    };

    /**
     * Delete sport by id
     */
    public deleteSport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id
            if (!isValidId(id)) next(new HttpException(404, 'Invalid id'))

            const sport = this.SportService.deleteSport(id);

            if (!sport) return next(new HttpException(400, 'Failed to delete'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }
}

export default SportController;