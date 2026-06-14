import express from 'express';
import ENV from './src/lib/env.js';
import connectDB from './src/lib/db.js';

const app = express();

app.use(express.json());

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API');
});


const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();