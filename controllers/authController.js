const User = require("../models/user");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const handleError = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "Invalid Email.") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "Incorrect Password") {
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

module.exports.admin_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.login(email, password);
    const token = createTokens(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ admin });
  } catch (err) {
    console.log(err);
    const errors = handleError(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

module.exports.admin_signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.create({
      email,
      password,
    });
    const token = createTokens(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ admin });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.auth = async (req, res) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
          res.status(200).json({ msg: "Proceed to login" });
        } else {
          const admin = await Admin.findById(decodedToken.id);
          const user = await User.findById(decodedToken.id);
          if (admin) {
            res.status(200).json({ msg: "Admin Login Found" });
          }
          if (user) {
            res.status(200).json({ msg: "User Login Found" });
          }
        }
      });
    } else {
      res.status(404).json({ msg: "Proceed to login" });
    }
  } else {
    res.status(404).json({ msg: "Proceed to login" });
  }
};

module.exports.get_admin = async (req, res) => {
  let admin = req.Admin;
  try {
    res.status(200).json({ admin });
  } catch (errors) {
    res.status(404).json({ errors });
  }
};
