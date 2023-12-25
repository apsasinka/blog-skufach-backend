import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js';
import { UserController, PostController, CommentController, ThemeController } from './controllers/index.js';
import { handleValidationErrors, checkAuth} from './utils/index.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

mongoose
    .connect('')
    .then(() => console.log('Mongoose connected!'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')){
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer( { storage });

app.use(express.json());
app.use(cors());
app.use('/api/uploads', express.static('uploads'))

app.post('/api/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/api/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/api/auth/me', checkAuth, UserController.getMe)

app.post('/api/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/api/tags', PostController.getLastTags);

app.get('/api/posts', PostController.getAllNew);
app.get('/api/posts/populare', PostController.getAllPopulare);
app.get('/api/posts/tags', PostController.getLastTags);
app.get('/api/posts/:id', PostController.getOne);
app.post('/api/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/api/posts/:id', checkAuth, PostController.remove);
app.patch('/api/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.get('/api/posts/:id/comments', CommentController.getAllForPost);
app.post('/api/posts/:id/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.delete('/api/posts/:postId/comments/:commentId', checkAuth, CommentController.remove);
app.get('/api/comments', CommentController.getLastComment);

app.get('/api/theme/:newThemeValue', ThemeController.changeTheme);
app.get('/api/gettheme', ThemeController.getTheme)

app.listen(process.env.PORT || 4444, (err) => {
    if (err) return console.log(err);

    console.log('Server OK');
});