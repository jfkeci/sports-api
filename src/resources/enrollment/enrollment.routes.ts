import { authAdmin, authPublic, authUser } from "@/middleware/authenticated.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express";
import { validate } from "@/resources/enrollment/enrollment.validation";
import EnrollmentController from "@/resources/enrollment/enrollment.controller";

class EnrollmentRoutes {
    private router = Router();
    private path = '/enrollments';

    public init(controller: EnrollmentController): Router {

        // [x] Create enrollment - user auth
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate), authUser],
            controller.createEnrollment
        );

        // [x] Get all enrollments - admin auth
        this.router.get(
            `${this.path}`,
            authAdmin,
            controller.getEnrollments
        );

        // [x] Get enrollment by id - admin auth
        this.router.get(
            `${this.path}/:id`,
            authAdmin,
            controller.getEnrollment
        );

        // [x] Delete enrollment (unenroll) - admin and user
        this.router.delete(
            `${this.path}/:id`,
            authPublic,
            controller.deleteEnrollment
        );

        // [] Update enrollment - user auth
        this.router.patch(
            `${this.path}/:id`,
            [validationMiddleware(validate), authUser],
            controller.updateEnrollment
        );

        // [] Test route - dev only
        // this.router.get(
        //     `${this.path}/test/:userId`,
        //     controller.test
        // );

        return this.router
    }

}

export default EnrollmentRoutes;