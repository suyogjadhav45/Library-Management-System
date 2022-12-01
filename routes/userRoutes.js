const { Router } = require("express");

const {
  login,
  signup,
  getuser,
  issueBook,
  viewSelfIssuedBooks,
  viewAllIssuedBooks,
} = require("../controllers/userController");

const {
  viewAllBooks,
  viewAllAvailableBooks,
} = require("../controllers/commonController");

const { requireAuth } = require("../middleware/authmiddleware");
const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/getprofile", requireAuth, getuser);
userRouter.get("/viewSelfIssuedBooks", requireAuth, viewSelfIssuedBooks);
userRouter.post("/issueBook/:id", requireAuth, issueBook);
userRouter.get("/viewAllBooks", requireAuth, viewAllBooks);
userRouter.get("/viewAllAvailableBooks", requireAuth, viewAllAvailableBooks);
userRouter.get("/viewAllIssuedBooks", requireAuth, viewAllIssuedBooks);

module.exports = userRouter;
