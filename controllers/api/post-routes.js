const router = require('express').Router();
const {Post, User, Comment } =require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'text', 'title', 'created_at'],
        order: [['created_at', SESC]],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);

    });
});

router.get('/id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'text', 'title', 'created_at'],
        include: [
            {
                model: Comment,
                attriutes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(data => {
        if (!data) {
            res.status(404).json({ message: 'No post found with this id'});
            return
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req,res) => {
    Post.create({
        title: req.body.title,
        text: req.body.text,
        user_id: req.session.user_id
    })
    .then(data => res.json(data)
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    }));
});

router.put('/id', withAuth, (req,res) => {
    Post.update(
        {
            title: req.body.title,
            text: req.body.text
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'No post was found with this id'});
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/id', withAuth, (req,res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({ message: 'No post found with this id'});
            return;
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });

    module.exports = router;