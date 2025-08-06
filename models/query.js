const mongoose = require("mongoose");
const querySchema = new mongoose.Schema({
  query: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Query", querySchema);

