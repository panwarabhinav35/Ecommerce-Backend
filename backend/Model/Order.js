const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  products : {type:[Schema.Types.Mixed], required : true},
  totalAmount :{type : Number},
  totalItems :{type : Number},
  paymentMethod :{type:String},
  selectedAddress:{type : Schema.Types.Mixed},
  status:{type:String , default :"pending"},
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const virtual = orderSchema.virtual("id");
virtual.get(() => {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
