const mongoose = require("mongoose");
const moment = require("moment");

const issuedBySchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter book Name"],
  },

  book_name: {
    type: String,
    required: [true, "Please enter book Name"],
  },
  author: {
    type: String,
    required: [true, "Please enter book Name"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter User Id"],
  },

  user_first_name: {
    type: String,
    required: [true, "Please enter User Name"],
  },

  user_last_name: {
    type: String,
    required: [true, "Please enter User Name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
  },

  issue_date: {
    type: Date,
    required: [true, "Please enter book purchase Date"],
    default: moment().format(),
  },

  return_date: {
    type: Date,
    required: [true, "Please enter the book return date"],
    default: moment().add(10, "days").calendar(),
  },
});

const issuedBy = mongoose.model("issuedBy", issuedBySchema);
module.exports = issuedBy;
