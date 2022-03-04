import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import SportController from '@/resources/sport/sport.controller';
import EnrollmentController from './resources/enrollment/enrollment.controller';

validateEnv();

const app = new App(
    [
        new UserController,
        new SportController,
        new EnrollmentController,
    ],
    Number(process.env.PORT)
);

app.listen();
