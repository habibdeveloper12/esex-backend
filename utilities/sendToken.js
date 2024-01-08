const jwt = require("jsonwebtoken");
const JWT_SECRET = "DPEEHEOEEPEERUR78USXPEPEEHC";
const sendToken = (user, statusCode, res) => {
  console.log(user);

  // options for cookie
  // const options = {
  //       expires: new Date(
  //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  // ddddddddd      ),
  //       httpOnly: true,
  //     };

  const token = user.getJWTtoken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = sendToken;
