require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Configure CORS options to allow access only from localhost:5173
// const corsOptions = {
//   origin: "http://localhost:5173",
// };

// app.use(cors(corsOptions)); // Enable CORS with the specified options

// Morgan middleware for logging requests
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

// Use the product and order routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Define the default GET route for "/"
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  res.status(404).json({
    error: { message: "Not Found", status: 404 },
  });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
