const { Router } = require("express");
const { auth } = require("../controllers/authController");

const router = Router();

router.get("/auth", auth);
module.exports = router;
