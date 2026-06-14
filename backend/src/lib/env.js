import env from 'dotenv';

env.config();

const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI
};

export default ENV;