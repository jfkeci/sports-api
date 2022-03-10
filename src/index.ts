import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import AuthController from '@/resources/auth/auth.controller';
import SportController from '@/resources/sport/sport.controller';
import EnrollmentController from '@/resources/enrollment/enrollment.controller';
import RatingController from '@/resources/rating/rating.controller';
import SportsClassController from '@/resources/sportsClass/sportsClass.controller';

validateEnv();

const app = new App(
    [
        new UserController,
        new AuthController,
        new SportController,
        new EnrollmentController,
        new RatingController,
        new SportsClassController,
    ],
    Number(process.env.PORT)
);

app.listen();
