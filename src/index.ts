import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import SportController from '@/resources/sport/sport.controller';
import EnrollmentController from '@/resources/enrollment/enrollment.controller';
import RatingController from '@/resources/rating/rating.controller';

validateEnv();

const app = new App(
    [
        new UserController,
        new SportController,
        new EnrollmentController,
        new RatingController,
    ],
    Number(process.env.PORT)
);

app.listen();
