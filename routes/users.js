const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({hey: "this is user route"})
})

module.exports = router;