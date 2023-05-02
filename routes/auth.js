const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("welcome to auth page.")
})

module.exports = router;