const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../Models/User");
const userValidation = require('../Models/Validation/userValidation');

exports.register = async (req, res) => {
    try {
        let email = req.body.email;
        const getUser = await User.findOne({email});
        if (getUser) return res.status(400).json({error: 'کاربری با این اکانت  وجود دارد'});
        const {error} = userValidation.userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = {name: req.body.name, email: email, password: hashedPassword};
        res.json({message: ' ثبت نام کاربر با موفقیت صورت گرفت'});
        await User.create(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Product creation failed"});
    }

}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step 1: Find the user by their email
        const user = await User.findOne({ email });

        // Step 2: Check if the user exists
        if (!user) {
            return res.status(400).json({ message: "کاربری با این ایمیل یافت نشد" });
        }

        // Step 4: If the password is correct, generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    user: {
                        userId: user._id.toString(),
                        email: user.email,
                        name: user.name
                    },
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            // Step 5: Respond with the token and user ID
            res.status(200).json({ token, userId: user._id.toString() });
        } else {
            // Step 6: If the password is incorrect, respond with an error message
            res.status(400).json({ message: "رمز عبور یا نام کاربری اشتباه است" });
        }
    } catch (error) {
        // Step 7: Handle any unexpected errors
        console.log(error);
        res.status(500).json({ error: "خطای سرور" });
    }
}
exports.logout =async (req,res)=>{

}


