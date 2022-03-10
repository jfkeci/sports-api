import { Router, Request, Response, NextFunction, response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import RatingService from '@/resources/rating/rating.service';
import { isValidId } from '@/utils/validate.utils';
import RatingRoutes from '@/resources/rating/rating.routes';

class RatingController implements Controller {
    public router = Router();

    private RatingService = new RatingService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = new RatingRoutes().init(this);
    }

    /**
     * Create a rating
     */
    public createRating = async (
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

            if (!newRating) return next(new HttpException(400, 'Something went wrong'));

            return res.status(201).json(newRating);
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get all ratings
     */
    public getRatings = async (
        _: Request,
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

    /**
     * Get single rating by id
     */
    public getRating = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;

            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const rating = await this.RatingService.getRating(id);

            if (!rating) return next(new HttpException(400, 'No rating found'));

            return res.status(200).json(rating)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    };

    /**
     * Get all ratings by classId
     */
    public ratingsByClass = async (
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

    /**
     * Get all ratings by userId
     */
    public ratingsByUser = async (
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

    /**
     * Update rating
     */
    public updateRating = async (
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

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }

    /**
     * Delete rating by id
     */
    public deleteRating = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            if (!isValidId(id)) return next(new HttpException(404, 'Invalid id'));

            const rating = await this.RatingService.deleteRating(id);

            if (!rating) return next(new HttpException(404, 'Failed to delete'));

            return res.status(204).send();
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }

    /**
     * Get average rating for class
     */
    public getAverageRatingForClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const classId = req.params.classId;

            if (!isValidId(classId)) return next(new HttpException(
                404,
                'Invalid id'
            ))

            let average = await this.RatingService.getAverageRatingForClass(
                classId
            );

            if (!average) return next(new HttpException(400, 'Something went wrong'))

            return res.status(200).json(average)
        } catch (error: any) {
            return next(new HttpException(500, error.message));
        }
    }
}

export default RatingController;