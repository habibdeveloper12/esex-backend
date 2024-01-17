const express = require("express");
const {
  orderShip,
  orderWalletStripe,
  getWalletOrderStripe,
  createOrder,
  getOrder,
  updateOrder,
  adminOrder,
  allOrder,
} = require("../controler/orderController");
const router = express.Router();

// import all controler
router.post("/create-rate", orderShip);
router.get("/all", allOrder);

router.post("/create-order", createOrder);
router.post("/wallet-payment-stripe", orderWalletStripe);
router.get("/get-order", getOrder);
router.patch("/update-order/:id/", updateOrder);
router.patch("/admin-order/:id/", adminOrder);
router.get("/wallet-payment-stripe", getWalletOrderStripe);

// router.put("/setDefaultAddress/:id/", setUserDefaultAddress);

module.exports = router;
