const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "ss_admin", "it_admin", "pat_admin", "lf_admin", "user"], 
        default: "user"
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);