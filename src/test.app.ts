import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
    return res.json({ message: 'Hello World' })
})

export default app;