const mongoose = require("mongoose");
const moment = require("moment");

const bookSchema = new mongoose.Schema({
  book_name: {
    type: String,
    required: [true, "Please enter book Name"],
  },
  author: {
    type: String,
    required: [true, "Please enter book Name"],
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "Please enter book Status"],
  },
  purchase_date: {
    type: Date,
    required: [true, "Please enter book purchase Date"],
    default: moment().format(),
  },
});

const Books = mongoose.model("books", bookSchema);
module.exports = Books;
