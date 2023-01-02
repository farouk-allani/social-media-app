import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import helmet from 'helmet';
import multer from 'multer';
import {register} from './controllers/auth.js';
import {createPost} from './controllers/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { verifyToken } from './middleware/auth.js';

/*configurations*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    }
});
const upload = multer({ storage });

/* routes with files */
app.post('/auth/register', upload.single('picture'),register);
app.post('/posts', verifyToken, upload.single('picture'), postRoutes,createPost);

/* routes */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts',postRoutes);

/* database connection */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=>{app.listen(PORT,() => console.log(`Database connected successfully on port ${PORT}`))} )
    .catch((err) => console.log(err));



