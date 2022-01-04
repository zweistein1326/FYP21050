const router = require('express').Router();

router.get('/', async (req, res, next) => {
    return res.json("Hello World");
})

module.exports = router;