const express = require("express");
const {
  registerUser,
  getSingleUser,
  setUserDefaultAddress,
  findUser,
  savedAddress,
  savedAddressr,
  checkNickNamer,
  checkNickName,
  findAddress,
  findAddressr,
  handleDelete,
  defaultAddress,
  getUserByEmail,
  findRAddress,
  handleRDelete,
  updateWallet,
} = require("../controler/userControler");
const router = express.Router();

// import all controler
router.post("/register", registerUser);
router.post("/save-address", savedAddress);
router.post("/save-addressr", savedAddressr);
router.post("/check-nickname", checkNickName);
router.post("/check-nicknamer", checkNickNamer);

router.put("/setDefaultAddress/:id/", setUserDefaultAddress);
router.get("/addressAll", findAddress);
router.get("/addressrAll", findRAddress);
router.get("/peruser", getUserByEmail);
router.get("/default/address", defaultAddress);
router.get("/recivedAddressAll", findAddressr);
router.delete("/addressDelete/:id/", handleDelete);
router.delete("/addressrDelete/:id/", handleRDelete);
router.get("/", findUser);
router.patch("/wallet", updateWallet);
router.get("/singleByEmail/:email", getSingleUser);
module.exports = router;
