const router = require('express').Router();

const auth = require('../components/auth');

router.get('/', async (req, res, next) => {
    return res.json("Hello World");
})

router.post('/login', async (req, res, next) => {
    auth.authenticate(req.body)
        .then(user=>{
            if(user){
                return res.json(user)
            }
            return res.status(400).json({message: 'Username or password incorrect'});
        })
        .catch(e=>{
            return next(e)
        })
})


module.exports = router;