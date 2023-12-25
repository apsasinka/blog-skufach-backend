import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';


export const create = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Запись не найдена' });
        }

        const newComment = new Comment({
            text,
            user: req.userId,
            post: postId,
        });

        const savedComment = await newComment.save();
        res.json(savedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка при создании комментария' });
    }
};

export const getAllForPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId });

        const commentsWithUserDetails = await Promise.all(comments.map(async comment => {
            const user = await User.findById(comment.user);

            return {
                _id: comment._id,
                text: comment.text,
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    avatarUrl: user.avatarUrl,
                },
                createdAt: comment.createdAt,
            };
        }));

        res.status(200).json(commentsWithUserDetails);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении комментариев' });
    }
};

export const remove = async (req, res) => {
    try {
        const { postId, commentId } = req.params; 

        const deletedComment = await Comment.findOneAndDelete({
            _id: commentId,
            post: postId 
        });

        if (!deletedComment) {
            return res.status(404).json({
                message: 'Комментарий не найден'
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить комментарий',
        });
    }
};

export const getLastComment = async (req, res) => {
    try {
        const lastThreeComments = await Comment.find({})
            .sort({ createdAt: -1 }) 
            .limit(3)
            .populate({
                path: 'user',
                select: 'fullName avatarUrl' // Выбираем только fullName и avatarUrl
            });

        res.status(200).json(lastThreeComments);
    } catch (error) {
        console.error('Ошибка при получении последних комментариев', error);
        res.status(500).json({ error: 'Ошибка при получении последних комментариев' });
    }
};
