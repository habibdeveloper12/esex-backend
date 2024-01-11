const User = require("../modal/userModal");
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
  try {
    let shipment;
    console.log(shipment);
    shipment = await client.Shipment.create({
      to_address: {
        name: "Dr. Steve Brule",
        street1: "179 N Harbor Dr",
        city: "Redondo Beach",
        state: "CA",
        zip: "90277",
        country: "US",
        email: "dr_steve_brule@gmail.com",
        phone: "4155559999",
      },
      from_address: {
        street1: "417 montgomery street",
        street2: "FL 5",
        city: "San Francisco",
        state: "CA",
        zip: "94104",
        country: "US",
        company: "EasyPost",
        phone: "415-123-4567",
      },
      parcel: {
        length: 20.2,
        width: 10.9,
        height: 5,
        weight: 65.9,
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

    // or create by using IDs

    // shipment = await client.Shipment.create({
    //   to_address: { id: "adr_..." },
    //   from_address: { id: "adr_..." },
    //   parcel: { id: "prcl_..." },
    //   customs_info: { id: "cstinfo_..." },
    // });
    const boughtShipment = await client.Shipment.buy(
      shipment.id,
      shipment.lowestRate()
    );
    console.log(shipment);
    console.log(boughtShipment);
    res.json(boughtShipment);
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
