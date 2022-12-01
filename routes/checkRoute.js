const Router = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.send("haha");
});

module.exports = router;
