import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express'
import { swaggerDocs } from '@/utils/swagger/swagger';
import log from '@/utils/logger/logger';


class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initDbConnection();
        this.initMiddleware();
        this.initControllers(controllers);
        this.initErrorHandling();
        this.initSwagger();

        this.express.use('/api', (req, res) => { res.send('Welcome to Sports API') })
        this.express.use('/', (req, res) => { res.send('Welcome to Sports API') })
    }

    private initMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api/', controller.router);
        })
    }

    private initSwagger() {
        this.express.use(
            '/api-docs',
            swaggerUi.serve,
            swaggerUi.setup(swaggerDocs)
        );
    }

    private initErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initDbConnection(): void {
        const { DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

        mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gg0cz.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`)
            .then(() => log.info('Connected to database'))
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            log.info(`App listening on port ${this.port}`)
        })
    }

    /* public getApp(): Application { // For testing
        return this.express;
    } */
}

export default App;