const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        if (!name) {
            return res.send({ message: "Name is Required" })
        }
        if (!email) {
            return res.send({ message: "Email is Required" })
        }
        if (!phone) {
            return res.send({ message: "Phone is Required" })
        }
        if (!password) {
            return res.send({ message: "Password is Required" })
        }
        if (!address) {
            return res.send({ message: "Address is Required" })
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please Login"
            })
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await new userModel({
            name,
            email,
            phone,
            address,
            answer,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user: newUser,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration"
        })
    }
}


//post login
const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      //token
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.cookie('login',token,{httpOnly : true});
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token:token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };

const forgetPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email || !answer || !newPassword) {
            res.status(400).send({ message: "Email, Answer, and New Password are required" });
            return;
        }
        const user = await userModel.findOne({ email, answer });

        if (!user) {
            res.status(400).send({
                success: false,
                message: "Invalid Email or Answer"
            });
            return;
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user?._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went Wrong',
            error
        });
    }
}

const getOrdersController = async (req,res) => {
  try {
    const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
    res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went Wrong',
      error
  });
  }
}
const getAllOrdersController = async (req,res) => {
  try {
    const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
    res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went Wrong',
      error
  });
  }
}

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

const testController = (req, res) => {
    res.send('Protected Route')
}

const orderStatusController = async (req,res) => {
  try {
    const {orderId} = req.params;
    const {status} = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
    res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error while Updating order',
      error
    })
  }
}

module.exports = { registerController, loginController, testController, forgetPasswordController,getOrdersController,updateProfileController,getAllOrdersController,orderStatusController };