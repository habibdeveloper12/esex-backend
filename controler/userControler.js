const User = require("../modal/userModal");
const Address = require("../modal/addressModal");
const Addressr = require("../modal/addressModalr");
const sendToken = require("../utilities/sendToken");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res, next) => {
  const { name, email, password, userId } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(202)
        .send({ success: false, message: "User already exists" });
    }

    // Password hashing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    console.log("Generated Salt:", salt);

    const hashedPassword = await bcrypt.hash(`${password}`, salt);

    console.log("Hashed Password:", hashedPassword);

    // Create a new user in MongoDB
    const addedUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userId: userId,
    });

    sendToken(addedUser, 200, res);
  } catch (e) {
    console.log(e);
  }
};
exports.findUser = async (req, res, next) => {
  try {
    const email = req.query.email;

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(202)
        .send({ success: true, message: "User exsits", data: user });
    }

    // sendToken(user, 200, res);
  } catch (e) {
    console.log(e);
  }
};
exports.updateWallet = async (req, res, next) => {
  try {
    const { email, wallet } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        wallet: wallet,
      },
      { new: true } // upsert: true creates a new user if not found
    );
    if (user) {
      return res
        .status(202)
        .send({ success: true, message: "Wallet debited", data: user });
    }

    // sendToken(user, 200, res);
  } catch (e) {
    console.log(e);
  }
};
exports.getSingleUser = async (req, res, next) => {
  console.log("Received data from the client req. body:", req.body);
  try {
    const userEmail = req.params.email;

    // Fetch the user from the database using the provided email
    const user = await User.findOne({ email: userEmail });
    console.log("dfdfdf");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.savedAddress = async (req, res, next) => {
  const { sender, nickname, userEmail } = req.body;
  console.log("Received data from the client:", sender, nickname);
  console.log("Received data from the client req. body:", req.body);

  try {
    const userId = req.params.userId;
    const { nickname, sender, userEmail } = req.body;

    // Create the new address
    const newAddress = await Address.create({
      nickname,
      sender,
      userEmail,
    });

    // Add the new address to the user's addresses array
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        $push: { addresses: newAddress._id },
        $setOnInsert: { defaultAddress: newAddress._id }, // Set as default only if the user is newly created
      },
      { new: true, upsert: true } // upsert: true creates a new user if not found
    );

    // Set the new address as the default address if needed
    if (!user.defaultAddress) {
      user.defaultAddress = newAddress._id;
      await user.save();
    }

    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.savedAddressr = async (req, res, next) => {
  const { sender, nickname, userEmail } = req.body;
  console.log("Received data from the client:", sender, nickname);
  console.log("Received data from the client req. body:", req.body);

  try {
    const userId = req.params.userId;
    const { nickname, recipient, userEmail } = req.body;

    // Create the new address
    const newAddress = await Addressr.create({
      nickname,
      recipient,
      userEmail,
    });

    // Add the new address to the user's addresses array
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        $push: { addressesr: newAddress._id },
        // $setOnInsert: { defaultAddress: newAddress._id }, // Set as default only if the user is newly created
      },
      { new: true, upsert: true } // upsert: true creates a new user if not found
    );

    // Set the new address as the default address if needed
    // if (!user.defaultAddress) {
    //   user.defaultAddress = newAddress._id;
    //   await user.save();
    // }

    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.checkNickName = async (req, res, next) => {
  try {
    const { nickname } = req.body;

    // Check if the nickname already exists in the database
    const existingAddress = await Address.findOne({ nickname });

    if (existingAddress) {
      // Nickname already exists
      return res.status(200).json({ exists: true });
    } else {
      // Nickname does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking nickname:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.checkNickNamer = async (req, res, next) => {
  try {
    const { nickname } = req.body;

    // Check if the nickname already exists in the database
    const existingAddress = await Address.findOne({ nickname });

    if (existingAddress) {
      // Nickname already exists
      return res.status(200).json({ exists: true });
    } else {
      // Nickname does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking nickname:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findAddressr = async (req, res, next) => {
  try {
    // Fetch all addresses from the database
    const addresses = await Addressr.find();
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.handleDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Find the address by nickname and delete it
    const deletedAddress = await Address.findOneAndDelete({ _id: id });

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.handleRDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Find the address by nickname and delete it
    const deletedAddress = await Address.findOneAndDelete({ _id: id });

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.defaultAddress = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }).populate("defaultAddress");

    if (!user) {
      // User not found
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the default address from the user object
    const defaultAddress = user.defaultAddress;

    // Send the default address to the client
    res.json({ defaultAddress });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.setUserDefaultAddress = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    // Find the user by ID
    const address = await Address.findById({ _id: id });
    console.log(address);
    const user = await User.findOne({ email: address.userEmail });

    // Set the default address ID in the user's profile
    user.defaultAddress = id;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Default address set successfully" });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// exports.findAddress = async (req, res, next) => {
//   try {
//     // Fetch all addresses from the database
//     const addresses = await Address.find();
//     res.json(addresses);
//   } catch (error) {
//     console.error('Error fetching addresses:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.findAddress = async (req, res, next) => {
  try {
    const { email: userEmail, nickname } = req.query;
    const addresses = await Address.find({ userEmail });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.findRAddress = async (req, res, next) => {
  try {
    const { email: userEmail, nickname } = req.query;
    const addresses = await Addressr.find({ userEmail });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    res.json(user);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.allUser = async (req, res, next) => {
  try {
    const user = await User.find({});

    res.json(user);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.addBank = async (req, res, next) => {
  try {
    const { email } = req.query;
    const body = req.body;
    const bank = User.findOneAndUpdate(
      { email: email },
      { $set: { ...body } },
      { new: true } // Return the updated document
    ).then((updatedUser) => {
      if (updatedUser) {
        console.log("User updated:", updatedUser);
      } else {
        console.log("User not found");
      }
    });

    res.json(bank);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
