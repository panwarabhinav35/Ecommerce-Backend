const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    value : {type : String , required: true , unique: true},
    label : {type : String , required: true , unique : true},
    checked : {type : Boolean}
  
});

const virtual = categorySchema.virtual("id");
virtual.get(() => {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Category = mongoose.model("Category", categorySchema);
