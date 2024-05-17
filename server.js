require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

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

// Define the default GET route for "/"
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes setup
// routes(app);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
