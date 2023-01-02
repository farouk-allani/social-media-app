import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

/* register user */

export const register = async (req, res) => {
  try {
    const {
      userName,
      lastName,
      email,
      password,
      location,
      occupation,
      friends,
      picturePath,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      userName,
      lastName,
      email,
      password: passwordHash,
      location,
      occupation,
      friends,
      picturePath,
      viewedProfile: 0,
      impressions: 0,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


/* login user */

export const login = async (req, res) => {
    
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (!user) return res.status(400).json({error: "User doesn't exist"});
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: "Invalid credentials"});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({user, token});

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
