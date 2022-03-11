import swaggerJsDoc from 'swagger-jsdoc'

export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sports API",
            version: "1.0.0",
            description: "Express ts api with for managing a Sports complex",
            contact: {
                name: "Jakov Filip Saboliček",
                url: "https://github.com/jfkeci",
                email: "ja.lip132@gmail.com"
            }
        },
        host: "http://localhost:13374",
        basePath: "/api"
    },
    apis: [
        "./src/resources/user/user.model.ts",
        "./src/resources/user/user.controller.ts",
        "./src/resources/sport/sport.model.ts",
        "./src/resources/sport/sport.model.ts",
        "./src/resources/enrollment/enrollment.model.ts",
        "./src/resources/enrollment/enrollment.model.ts",
        "./src/resources/rating/rating.model.ts",
        "./src/resources/rating/rating.model.ts",
        "./src/resources/sportsClass/sportsClass.model.ts",
        "./src/resources/sportsClass/sportsClass.model.ts",
    ],
};

export const swaggerDocs = swaggerJsDoc(options);