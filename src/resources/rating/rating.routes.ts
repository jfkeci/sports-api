import { authAdmin, authUser } from "@/middleware/authenticated.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import RatingController from "@/resources/rating/rating.controller";
import { validate } from "@/resources/rating/rating.validation";

class RatingRoutes {
    private router = Router();
    private path = '/ratings';

    public init(controller: RatingController): Router {

        // [x] Create a new rating - user auth
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate), authUser],
            controller.createRating
        );

        // [x] Get all ratings, admin auth
        this.router.get(
            `${this.path}`,
            authAdmin,
            controller.getRatings
        );

        // [x] Get rating by id - admin auth
        this.router.get(
            `${this.path}/:id`,
            authAdmin,
            controller.getRating
        );

        // [x] Get ratings by class - admin auth
        this.router.get(
            `${this.path}/class/:classId`,
            authAdmin,
            controller.ratingsByClass
        );

        // [x] Get ratings by user - admin auth
        this.router.get(
            `${this.path}/user/:userId`,
            authAdmin,
            controller.ratingsByUser
        );

        // [x] test route - admin auth
        this.router.get(
            `${this.path}/average/:classId`,
            authAdmin,
            controller.getAverageRatingForClass
        )

        // [x] Delete rating - for development
        // this.router.delete(
        //     `${this.path}/:id`,
        //     this.deleteRating
        // );

        return this.router
    }
}

export default RatingRoutes;