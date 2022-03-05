import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';

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

    private initErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initDbConnection(): void {
        const { DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

        mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gg0cz.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`)
            .then(() => console.log('Connected to database'))
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`)
        })
    }

    public getApp(): Application {
        return this.express;
    }
}

export default App;