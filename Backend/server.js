const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");


const authRoutes = require("./src/routes/authRoute");
const getUserRoutes = require("./src/routes/getUserRoutes");
const userRoutes = require("./src/routes/userRoutes")


const dbConnect = require("./src/config/dbConnect");
dbConnect();

const app = express();

//Middleware
app.use(express.json());

app.use(cors({
  origin: "*"
}));


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes)
app.use("/api/admin", getUserRoutes)


//Starting the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at port ${PORT}`);
});

