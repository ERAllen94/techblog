const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models')

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exlude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);

    });
});

router.get('/:id', (req,res) => {
    User.findOne({
        attributes: {exclude: ['password'] },
        include: [
            {
                model: Post,
                attributes: ['id','title','post_url','created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'

            }
        ],
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this id!'});
            return;
        
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res)=> {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user found with that email address'});
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Invalid password!' });
            return;
        }

        req.session.save(()=>{
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn - true;
            
            res.json({ user: dbUserData, message: 'You are logged in'});
        })
    });
});

router.post('/logout',(req,res) =>{
    if (req.session.loggedIn) {
        req.session.destroy(()=> {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

router.route('/:id', (req, res)=> {
    user.update(req.body,{
        indivitualHooks: true,
        where: {
            id: req.params.id
        }
    })
.then(dbUserData => {
    if(!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id'});
        return;

    }
    res.json(dbUserData);
})
.catch(err =>{
    console.log(err);
    res.status(500).json(err);
});
});

router.delete('/:id', (req, res)=> {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'no user was found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;