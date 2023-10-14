const mongoose= require("mongoose");
const  userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: [true, "please enter a product name"],
    },
    password:{
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports =mongoose.model("User",userSchema)