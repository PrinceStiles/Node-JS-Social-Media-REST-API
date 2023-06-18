const router = require("express").Router();
const User = require("../modules/User");
const bcrypt = require("bcrypt")

// REGISTER
router.post("/register", async (req, res) => {
    try{
        // bcrypt user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // save user and post req
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
    
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).send("user not found");

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        !isValidPassword && res.status(404).send("wrong password");

        res.status(200).send(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;