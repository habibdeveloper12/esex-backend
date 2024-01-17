const User = require("../modal/userModal");
const Order = require("../modal/orderModal");
const Address = require("../modal/addressModal");
const Addressr = require("../modal/addressModalr");
const sendToken = require("../utilities/sendToken");
const bcrypt = require("bcrypt");
const EasyPostClient = require("@easypost/api");
const stripe = require("stripe")(
  "sk_test_51L1aStLPuz8KfNo1JZcgNLrhRiH18oayVB7xlqUs44O4H1U5VN3q2e3RoNfOJmLEK2HP5pHyYFvEWVyDsTyBUtbM003osIbPPx"
);
const client = new EasyPostClient(
  "EZTK8b3194197aab4db183830928c25599ceI0b00mcInxyog8xbqNeOAw"
);

exports.orderShip = async (req, res, next) => {
  const { sender, recipient, parcel } = req.body;
  console.log(req.body, parcel);
  try {
    let shipment;

    shipment = await client.Shipment.create({
      from_address: {
        street1: sender.street1,
        street2: sender.street2,
        city: sender.city,
        state: sender.state,
        zip: sender.zip,
        country: sender.country,
        company: sender.company,
        phone: sender.phone,
      },
      to_address: {
        name: recipient.name,
        street1: recipient.street1,
        city: recipient.city,
        state: recipient.state,
        zip: recipient.zip,
        country: recipient.country,
        phone: recipient.phone,
      },
      parcel: {
        length: 10,
        width: parseFloat(parcel[0].width),
        height: parseFloat(parcel[0].height),
        weight: parseFloat(parcel[0].weight),
      },
      customs_info: {
        eel_pfc: "NOEEI 30.37(a)",
        customs_certify: true,
        customs_signer: "Steve Brule",
        contents_type: "merchandise",
        contents_explanation: "",
        restriction_type: "none",
        restriction_comments: "",
        customs_items: [
          {
            description: "T-shirts",
            quantity: 1,
            weight: 5,
            value: 10,
            hs_tariff_number: "123456",
            origin_country: "US",
          },
        ],
      },
    });
    // const boughtShipment = await client.Shipment.buy(
    //   shipment.id,
    //   shipment.lowestRate()
    // );
    // or create by using IDs

    // shipment = await client.Shipment.create({
    //   to_address: { id: "adr_..." },
    //   from_address: { id: "adr_..." },
    //   parcel: { id: "prcl_..." },
    //   customs_info: { id: "cstinfo_..." },
    // });

    // console.log(shipment);
    // console.log(shipment.id, shipment.lowestRate());
    res.json(shipment);
  } catch (e) {
    console.log(e);
  }
};
exports.createOrder = async (req, res, next) => {
  const { to_address, from_address, email } = req.body;
  console.log(req.body);
  try {
    const newOrder = new Order({
      sender: from_address,
      recipient: to_address,
      // packages: data.parcel,
    });
    const savedOrder = await newOrder.save();

    // Find the user by email and update their orders array
    await User.findOneAndUpdate(
      { email },
      { $push: { orders: savedOrder._id } },
      { new: true } // This ensures that the updated user is returned
    );

    res.status(200).json({
      data: savedOrder,
      message: "Order Saved",
    });
  } catch (e) {
    console.log(e);
  }
};

exports.orderWalletStripe = async (req, res, next) => {
  const { token, amount, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: token,
      description: "Payment for adding funds",
    });

    const updatedWalletAmount = await user.updateWallet(amount / 100);

    // Update the user's wallet amount

    // Handle the charge object (e.g., update database, send confirmation email)
    console.log("Payment successful:", charge);

    // Return the updated wallet amount in the response
    res.status(200).json({
      walletAmount: updatedWalletAmount,
      message: "Payment successful",
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);

    // Handle errors and send an error response
    res.status(500).json({ message: "Payment failed" });
  }
};

exports.getWalletOrderStripe = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedWalletAmount = await user.wallet;

    console.log("Wallet show successful:", charge);

    res.status(200).json({ walletAmount: updatedWalletAmount });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Payment failed" });
  }
};

exports.getOrder = async (req, res, next) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).populate("orders");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = user.orders;

    res.status(200).json({
      data: orders,
      message: "All Order",
    });
  } catch (e) {
    console.log(e);
  }
};
exports.updateOrder = async (req, res, next) => {
  const { sender, recipient, addons, orderId, shipment } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        sender,
        recipient,
        addons,
        orderStatus: "Processing",
        shipment,
        orderItem: "Shipping",
      },
      { new: true, upsert: true }
    );
    console.log(shipment);
    // const boughtShipment = await client.Shipment.buy(
    //   shipment.shipment_id,
    //   shipment
    // );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      data: order,
      message: "Order updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.addNote = async (req, res, next) => {
  const { userNote } = req.body;
  const id = req.params.id;
  console.log(id, userNote);
  try {
    const order = await Order.findOneAndUpdate(
      { _id: id },
      {
        userNote,
      },
      { new: true, upsert: true }
    );
    console.log(order);
    // const boughtShipment = await client.Shipment.buy(
    //   shipment.shipment_id,
    //   shipment
    // );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      data: order,
      message: "Order updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.adminOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const body = req.body;

    console.log(body);

    if (orderId) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        { ...body },
        {
          upsert: true,
          new: true,
        }
      ).lean(); // Use lean() to convert the result to a plain JavaScript object

      console.log(updatedOrder);

      // Check if the order was found and updated
      if (updatedOrder) {
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid order ID" });
    }
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.allOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({}).lean(); // Add 'await' here

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
