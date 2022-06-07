const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  userName:{
    type: String,
    unique: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  active: {
    type: Boolean,
  },
ceatedDate: {
    type: Date,
    default: Date.now,
  },
});

schema.set("toJson", { vituals: true });
module.exports = mongoose.model("User", schema);
