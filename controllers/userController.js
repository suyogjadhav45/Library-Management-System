const User = require("../models/user");
const Book = require("../models/Books");
const Issue = require("../models/issuedBy");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const handleError = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    let errorsarray = Object.values(err.errors);
    errorsarray.forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// creating tokens
const createTokens = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.signup = async (req, res) => {
  const { first_name, last_name, email, password, confirmPassword } = req.body;
  if (password == confirmPassword) {
    try {
      const user = await User.create({
        first_name,
        last_name,
        email,
        password,
      });
      const token = createTokens(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user });
    } catch (err) {
      const errors = handleError(err);
      res.status(404).json({ errors });
    }
  } else {
    res
      .status(400)
      .json({ errors: { confirmPassword: "Password Doesn't matches" } });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createTokens(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.getuser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports.issueBook = async (req, res) => {
  const id = req.params.id;
  try {
    const book_data = await Book.findOne({ _id: id });
    if (book_data.status === true) {
      const data = await Book.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      const { book_name, author } = book_data;
      const { _id, first_name, last_name, email } = req.user;

      const issue_data = await Issue.create({
        book_id: book_data._id,
        book_name,
        author,
        user_id: _id,
        user_first_name: first_name,
        user_last_name: last_name,
        email,
      });
      res.status(200).json({ issue_data });
    } else {
      res.status(404).json({ msg: "book not available cannot issue" });
    }
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.viewSelfIssuedBooks = async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await Issue.find({ user_id: _id });
    res.status(200).json({ data });
  } catch (err) {
    const error = handleError(err);
    res.status(404);
  }
};

module.exports.viewAllIssuedBooks = async (req, res) => {
  {
    try {
      const data = await Book.find({ status: false });
      res.status(200).json({ data });
    } catch (err) {
      const error = handleError(err);
      res.status(404).json({ error });
    }
  }
};
