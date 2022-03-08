import { authAdmin, authPublic } from "@/middleware/authenticated.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import SportController from "@/resources/sport/sport.controller";
import { validate } from "@/resources/sport/sport.validation";

class SportRoutes {
    private router = Router();
    private path = '/sports';

    public init(controller: SportController): Router {

        // [x] Get all sports - user or admin
        this.router.get(
            `${this.path}`,
            authPublic,
            controller.getSports
        );
        // [x] Create a new sport - admin auth
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate), authAdmin],
            controller.createSport
        );

        // [x] Get sport by id - admin auth
        this.router.get(
            `${this.path}/:id`,
            authAdmin,
            controller.getSport
        );

        // [x] Delete sport - admin auth
        this.router.delete(
            `${this.path}/:id`,
            authAdmin,
            controller.deleteSport
        );

        return this.router
    }

}

export default SportRoutes;