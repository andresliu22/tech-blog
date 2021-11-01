const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User, attributes: ['first_name', 'last_name']}]
        })
        const posts = postData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts, logged_in: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['first_name', 'last_name']}]
        })
        const post = postData.get({ plain: true });
        res.render('post', { post, logged_in: req.session.logged_in })
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            include: [{ model: User, attributes: ['first_name', 'last_name']}]
        })

        const posts = postData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, logged_in: true })
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
})