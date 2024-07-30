const express = require('express');

const router = express.Router();

/* GET home page. test */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

module.exports = router;
