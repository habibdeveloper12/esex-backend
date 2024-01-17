const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    sender: { type: Object, required: true },
    recipient: { type: Object, required: true },
    packages: { type: Object },
    addons: { type: Object },
    payment: { type: String },
    shipment: { type: Object },
    orderItem: { type: String, default: "Saved" },
    orderStatus: { type: String, default: "pending" },
    adminEditable: { type: Boolean, default: false },
    // New fields from the provided object
    customD: [
      {
        description: { type: String },
        qty: { type: Number },
        value: { type: Number },
        totalValue: { type: Number },
        hsV: { type: Number },
        country: { type: String },
      },
    ],
    transactionId: { type: String },
    deliveryStatus: { type: String },
    transitStatus: { type: String },
    userNote: { type: String },
    csNote: { type: String },
    fpWeight: { type: String },
    fbWeight: { type: String },
    afee: { type: String },
    adjustment: { type: String },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const lastOrder = await this.constructor.findOne(
      {},
      {},
      { sort: { orderId: -1 } }
    );
    const lastOrderId = lastOrder ? lastOrder.orderId : 0;

    this.orderId = (lastOrderId + 1).toString().padStart(6, "0");
  }
  next();
});

// ... (existing code)

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
