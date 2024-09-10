// Đây là file chính của ứng dụng
require('dotenv').config();

// khai bao thu vien express
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary");

// Import thư viện mongoose
const mongoose = require("mongoose");
const dbURI = process.env.DB_URI;

// Import thư viện path
const path = require("path");

// Import Routers
const categoryRouter = require("./app/routes/category.router");
const productRouter = require("./app/routes/products.router");
const orderRouter = require("./app/routes/order.router");
const customerRouter = require("./app/routes/customer.router");
const voucherRouter = require("./app/routes/voucher.router");
const collectionRouter = require("./app/routes/collections.router");
// Import Routers Auth and User
const authRouter = require("./app/routes/auth.router");
const userRouter = require("./app/routes/user.router");

//khai bao app
const app = express();

//thu vien doc JSON
app.use(express.json());

// Cấu hình CORS
var corsOptions = {
  origin: "*", // Thay thế "*" bằng domain của client để hạn chế truy cập
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Phương thức HTTP được phép
  allowedHeaders: "Content-Type, Authorization, token", // Headers được phép
  credentials: true, // Cho phép cookie trên CORS
};

// Cấu hình CORS
app.use(cors(corsOptions));

// Cấu hình middleware để phục vụ các tệp ảnh tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MongoDB
mongoose
  .connect(dbURI)
  .then((_) => {
    console.log("Connected to MongoDB Succesfully");
  })
  .catch((err) => console.log("Error connect mongoDB!"));

//khai bao port
const port = 8000;

//Viết middleware console log ra terminal thời gian hiện tại mỗi lần chạy
//Viết middleware console log ra request method mỗi lần chạy
app.use((req, res, next) => {
  console.log(new Date());

  next();
}, (req, res, next) => {
  console.log(req.method);

  next();
})



app.get("/", (request, response) => {
  let today = new Date();
  console.log(`Today is ${today.getDate()} in ${today.getMonth()} in ${today.getFullYear()}.`);
  response.status(200).json({
      message: `Today is ${today.getDate()} in ${today.getMonth()} in ${today.getFullYear()}.`
  })
})

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Define a route to fetch all image URLs from Cloudinary
app.get('/api/images', async (req, res) => {
  try {
      let imageUrls = [];
      let nextCursor = null;

      // Use a loop to paginate through all images
      do {
          // Fetch a batch of images from Cloudinary
          const result = await cloudinary.api.resources({ type: 'upload', max_results: 100, next_cursor: nextCursor });

          // Extract image URLs from the batch and add them to the array
          imageUrls = [...imageUrls, ...result.resources.map(resource => resource.url)];

          // Update the cursor for the next batch
          nextCursor = result.next_cursor;
      } while (nextCursor);

      res.json({ imageUrls });
  } catch (error) {
      console.error('Error fetching images from Cloudinary:', error);
      res.status(500).json({ error: 'An error occurred while fetching images.' });
  }
});


// Route Collections
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/customers", customerRouter);
app.use("/vouchers", voucherRouter);
app.use("/collections", collectionRouter);
//Route Auth & User
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});

module.exports = app;