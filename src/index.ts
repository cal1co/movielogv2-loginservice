import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import http from 'http'
import { UserInfoResponse } from './utils/userTypes'
declare global {
    namespace Express {
        interface Request {
            user: UserInfoResponse
        }
    }
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandlerMiddleware);
const server = http.createServer(app)
const PORT = process.env.PORT || '8888'
server.listen(PORT, () => console.log(`listening on ${PORT}`))
export default app;
