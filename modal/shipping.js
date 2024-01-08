import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const shippingSchema = new Schema(
    {
        sender: { type: Object, required: true },
        recipient: { type: Object, required: true },
        packages: { type: Object, required: true },
        addons: { type: Object, required: true },
        paymentLink: { type: String },
        paymentStatus: { type: String }
    },
    { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('Shipping', shippingSchema, 'shippings');
