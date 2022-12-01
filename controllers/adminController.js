const Book = require("../models/Books");
const User = require("../models/user");
const Issued = require("../models/issuedBy");

const handleError = (err) => {};

module.exports.insert_book = async (req, res) => {
  const { book_name, author, status, purchase_date } = req.body;
  try {
    const data = await Book.create({
      book_name,
      author,
      status,
      purchase_date,
    });
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.remove_book = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Book.deleteOne({ _id: id });
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.update_book = async (req, res) => {
  const id = req.params.id;
  const { book_name, author } = req.body;
  try {
    const data = await Book.updateOne(
      { _id: id },
      {
        $set: {
          book_name,
          author,
        },
      }
    );
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    console.log(err);
    res.status(404).json({ errors });
  }
};

module.exports.returnBook = async (req, res) => {
  const id = req.params.id;

  try {
    const check_data = await Book.findOne({ _id: id });
    if (check_data.status === true) {
      res
        .status(404)
        .json({ msg: "it is not issued, so can't return the book." });
    } else {
      const book_data = await Book.updateOne(
        { _id: id },
        {
          $set: {
            status: true,
          },
        }
      );
      const data = await Issued.deleteOne({ book_id: id });
      res.status(200).json({ data });
    }
  } catch (err) {
    console.log(err);
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.viewAllUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.viewAllIssuedBookswithUser = async (req, res) => {
  try {
    const data = await Issued.find();
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.delete_user = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.deleteOne({ _id: id });
    res.status(200).json({ data });
  } catch (err) {
    const error = handleError(err);
    res.status(404).json({ error });
  }
};

module.exports.update_user = async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, email } = req.body;

  try {
    const data = await User.updateOne(
      { _id: id },
      {
        $set: {
          first_name,
          last_name,
          email,
        },
      }
    );

    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.findOne({ _id: id });
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.getBooksByUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Issued.find({ user_id: id });
    res.status(200).json({ data });
  } catch (err) {
    const error = handleError(err);
    res.status(404).json({ error });
  }
};
module.exports.getBook = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Book.findOne({ _id: id });
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};
// module.export.
