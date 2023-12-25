import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 4 символа').isLength({ min: 4 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 4 символа').isLength({ min: 4 }),
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('avatarUrl', 'Невалидная ссылка на аватарку').optional().isString(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength( {min: 3} ).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isString(),
    body('imageUrl', 'Невалидная ссылка на изображение').optional().isString(),
];

export const commentCreateValidation = [
    body('text', 'Введите текст комментария').isLength({ min: 10 }).isString(),
];