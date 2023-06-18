const router = require("express").Router();
const User = require('../modules/User');
const bcrypt = require('bcrypt');
const { findById } = require("../modules/User");

//UPDATE USER
router.put('/:id', async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return req.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json("Account has been updated")
        } catch (err) {
            req.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
})

//DELETE USER
router.delete('/:id', async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch (err) {
            req.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
})


//GET A USER
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other)
    } catch (err) {
        req.status(500).json(err);
    }
    
})
//FOLLOW A USER
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const current_user = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}})
                await current_user.updateOne({$push: {following: req.params.id}})
                res.status(200).json("Followed!")
            } else {
                res.status(403).json("You're already a follower!");
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("Denied!");
    }
})

//UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const current_user = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}})
                await current_user.updateOne({$pull: {following: req.params.id}})
                res.status(200).json("Unfollowed!")
            } else {
                res.status(403).json("You're not a follower!");
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("Denied!");
    }
})

module.exports = router;