
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const DeveloperProfile = require("../models/DeveloperProfile");
const BusinessProfile = require("../models/BusinessProfile");


const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ email, password: hashedPassword, name, role });
    console.log("new User :",newUser);

    if(role == "student"){
      const newUserDeveloper = await DeveloperProfile.create({
        userId : newUser._id
      })
      console.log("new Developer created :",newUserDeveloper)
    }else if(role == "businessOwner"){
      const newUserBusinessOwner = await BusinessProfile.create({
        userId : newUser._id
      })
      // console.log("new Business Owner created :",newUserBusinessOwner)
    }
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const login = async (req,res)=>{
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User not found"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }

    const token = generateToken(user);
    console.log("Token generated:", token);
    res.status(200).json({message: "Login successful", user, token});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = { register, login };