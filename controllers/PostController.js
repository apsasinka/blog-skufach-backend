import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }).limit(5).exec();

        const tags = posts
            .flatMap(post => post.tags) 
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось загрузить статьи',
        });
    }
}

export const getAllNew = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .sort({ createdAt: -1 }) // Сортировка по убыванию даты создания
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось загрузить статьи',
        });
    }
};

export const getAllPopulare = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .sort({ 
                viewsCount: -1 }) // Сортировка по убыванию даты создания
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось загрузить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true } // Чтобы получить обновленный документ
        ).populate('user');

        if (!updatedPost) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Не удалось загрузить статью'
        });
    }
}


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findOneAndDelete(
            { _id: postId, },
        );
        if (!updatedPost) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        };

        res.json({ success: true, });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const updatePost = await PostModel.updateOne(
            { _id: postId, }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.split(','),
        },);
        res.json({ success: true, })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        })
    }
}