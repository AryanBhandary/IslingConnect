const express = require("express");
const dotenv = require("dotenv").config();

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoutes")


const dbConnect = require("./src/config/dbConnect");
dbConnect();

const app = express();

//Middleware
app.use(express.json());


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes)


//Starting the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at port ${PORT}`);
});

