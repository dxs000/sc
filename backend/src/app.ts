import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middleware/errorHandler";
import likeRoute from './routes/likeRoute'
import userRouter from './routes/userRoute';
import postRouter from './routes/postRoute';
import commentRouter from './routes/commentRoute';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/likes', likeRoute)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)

app.use(errorHandler);

export default app;