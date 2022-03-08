import { authAdmin, authPublic } from "@/middleware/authenticated.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import SportsClassController from "@/resources/sportsClass/sportsClass.controller";
import { validate } from "@/resources/sportsClass/sportsClass.validation";

class SportsClassRoutes {
    private router = Router();
    private path = '/classes';

    public init(controller: SportsClassController): Router {

        // [x] Create a sports class
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate), authAdmin],
            controller.createSportsClass
        );

        // [x] Get all sports classes - user or admin
        this.router.get(
            `${this.path}`,
            authPublic,
            controller.getSportsClasses
        );

        // [x] Get get single sports class - user or admin
        this.router.get(
            `${this.path}/:id`,
            authPublic,
            controller.getSportsClass
        );

        // [x] Delete a sports class - admin auth
        this.router.delete(
            `${this.path}/:id`,
            [validationMiddleware(validate), authAdmin],
            controller.deleteSportsClass
        );

        // [x] Update a sports class - admin auth
        this.router.put(
            `${this.path}/:id`,
            [validationMiddleware(validate), authAdmin],
            controller.updateSportsClass
        );

        return this.router
    }

}

export default SportsClassRoutes;