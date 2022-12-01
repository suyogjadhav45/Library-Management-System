const Books = require("../models/Books");

const handleError = (err) => {};

module.exports.viewAllBooks = async (req, res) => {
  try {
    const data = await Books.find();
    res.status(200).json({ data });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.viewAllAvailableBooks = async (req, res) => {
  try {
    const data = await Books.find({ status: true });
    res.status(200).json({ data });
  } catch (err) {
    const error = handleError(err);
    res.status(404).json({ error });
  }
};
