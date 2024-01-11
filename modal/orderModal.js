import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    sender: { type: Object, required: true },
    recipient: { type: Object, required: true },
    packages: { type: Object, required: true },
    addons: { type: Object, required: true },
    payment: { type: String },
    orderStatus: { type: String, default: "pending" },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

// Adding a pre-save middleware to generate orderId
orderSchema.pre("save", async function (next) {
  // Generate a unique 6-digit orderId before saving the document
  if (!this.orderId) {
    const lastOrder = await this.constructor.findOne(
      {},
      {},
      { sort: { orderId: -1 } }
    );
    const lastOrderId = lastOrder ? lastOrder.orderId : 0;

    // Increment the lastOrderId and pad with zeros to make it 6 digits
    this.orderId = (lastOrderId + 1).toString().padStart(6, "0");
  }
  next();
});

const orderModel = new mongoose.model("Order", orderSchema);

module.exports = orderModel;
