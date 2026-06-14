import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+@.+\..+/,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
        type: String,
        enum: ["customer", "admin", "editor"],
        default: "customer",
    },
    addresses: [
        {
        label: String,
        line1: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean,
        },
    ],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;