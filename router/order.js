const express = require("express");
const {
  orderShip,
  orderWalletStripe,
  getWalletOrderStripe,
} = require("../controler/orderController");
const router = express.Router();

// import all controler
router.post("/create", orderShip);
router.post("/wallet-payment-stripe", orderWalletStripe);
router.get("/wallet-payment-stripe", getWalletOrderStripe);

// router.put("/setDefaultAddress/:id/", setUserDefaultAddress);

module.exports = router;
