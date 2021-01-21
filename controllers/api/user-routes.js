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
    console.log(req.body)
    console.log('in route')
    User.create({

        username: req.body.username, 
        email: req.body.email,
        password: req.body.password

    }).then(dbUserData => {
       
        req.session.save(()=>{
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn - true;
            
            res.json({ user: dbUserData, message: 'You are logged in'});
        })
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(userData => {
        console.log(userData,'userdata')
        if (!userData) {
            res.status(400).json({message: 'No user found with this username'});
            return;
        }

        // Validate password
        const validatePass = userData.checkPassword(req.body.password);
        if (!validatePass) {
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }

        // Save new session
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.isLoggedIn = true;


            res.json({user: userData, message: 'Logged In!'});
        });
    })
    .catch(err => res.status(500).json(err));
});


router.post('/logout',(req,res) =>{
    console.log(req.session.loggedIn,'this is it')
    if (true) {
        req.session.destroy(()=> {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// router.route('/:id', (req, res)=> {
//     user.update(req.body,{
//         indivitualHooks: true,
//         where: {
//             id: req.params.id
//         }
//     })
// .then(dbUserData => {
//     if(!dbUserData[0]) {
//         res.status(404).json({ message: 'No user found with this id'});
//         return;

//     }
//     res.json(dbUserData);
// })
// .catch(err =>{
//     console.log(err);
//     res.status(500).json(err);
// });
// });

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