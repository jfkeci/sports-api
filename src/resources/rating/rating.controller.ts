import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import { validate } from '@/resources/rating/rating.validation'
import RatingService from '@/resources/rating/rating.service';
import { authAdmin } from '@/middleware/authenticated.middleware';
import { isValidId } from '@/utils/validateId';

class RatingController implements Controller {
    public path = '/ratings';
    public router = Router();

    private RatingService = new RatingService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate),
            this.createRating
        );

        this.router.get(
            `${this.path}`,
            this.getRatings
        );

        this.router.get(
            `${this.path}/:id`,
            this.getRating
        );

        this.router.get(
            `${this.path}/class/:classId`,
            this.ratingsByClass
        );

        this.router.get(
            `${this.path}/user/:userId`,
            this.ratingsByUser
        );

        this.router.delete(
            `${this.path}/:id`,
            this.deleteRating
        );

        this.router.put(
            `${this.path}/:id`,
            this.updateRating
        );
    }

    private createRating = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { text, rating, userId, classId } = req.body;

            if (!isValidId(userId)) next(new HttpException(404, 'Invalid user id'));
            if (!isValidId(classId)) next(new HttpException(404, 'Invalid class id'));

            const newRating = await this.RatingService.createRating(
                text,
                rating,
                userId,
                classId
            );

            return res.status(201).json(newRating);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    private getRatings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const ratings = await this.RatingService.getRatings();

            if (!ratings) return next(new HttpException(404, 'No ratings found'));

            return res.status(200).json(ratings)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    private getRating = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;

            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const rating = await this.RatingService.getRating(id);

            if (!rating) return next(new HttpException(404, 'No rating found'));

            return res.status(200).json(rating)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    private ratingsByClass = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const classId = req.params.classId;

            if (!isValidId(classId)) return next(new HttpException(404, 'Invalid class id'));

            const ratings = await this.RatingService.ratingsByClass(classId);

            if (!ratings) return next(new HttpException(404, 'No rating found'));

            return res.status(200).json(ratings)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    private ratingsByUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const userId = req.params.userId;

            if (!isValidId(userId)) return next(new HttpException(404, 'Invalid user id'));

            const ratings = await this.RatingService.ratingsByUser(userId);

            if (!ratings) return next(new HttpException(404, 'No rating found'));

            return res.status(200).json(ratings)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    private updateRating = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const rating = req.body;

            const updatedRating = await this.RatingService.updateRating(id, rating);

            if (!updatedRating) return next(new HttpException(404, 'Failed to update'))

            return res.status(200).json(updatedRating)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }

    private deleteRating = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const rating = await this.RatingService.deleteRating(id);

            if (!rating) return next(new HttpException(404, 'Failed to remove'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }
}

export default RatingController;