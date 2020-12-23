const express = require("express");
const router = express.Router();

// add routes here
router.get("/test", (req, res) => res.json({ msg: "This is the tweets route" }));


module.exports = router;
