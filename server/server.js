const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { sequelize, Product } = require("./model");

const app = express();
app.use(cors({
  origin: "*", // or specific IP
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
// That should allow Postman or any frontend to access your server
// | Task              | Who does it        |
// | ----------------- | ------------------ |
// | Parse JSON        | express.json       |
// | Parse URL-encoded | express.urlencoded |
// | Parse files       | **Multer**         |
// | Store permanently | **Your code**      |


app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
// Image is kept in RAM only during the request
// Multer correctly puts the image into req.file
// 0️⃣ Without Multer (baseline)
// If you send a normal JSON request:
// {
//   "sku": "A101",
//   "model": "Bike"
// }
// Express can read it using:
// app.use(express.json());

// But ❌ this CANNOT read files.
// Files are sent as multipart/form-data, not JSON.
// That’s where Multer comes in.
// 1️⃣ Frontend sends a file

// Sync DB
sequelize.sync().then(() => console.log("Database synced"));

// =======================
// REGISTER / UPDATE PRODUCT
// ======================= here upload is multer middelware which inntercept which match frontend 
app.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { sku, model, color_code, color_desc, wheel_selection } = req.body;
    console.log('what req contain.... ',req);
  // this will get due to multer
  //     file: {
  //   fieldname: 'image',
  //   originalname: 'Orange Decal.jpeg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 06 06 06 06 07 06 07 08 08 07 0a 0b 0a 0b 0a 0f 0e 0c 0c 0e 0f 16 10 11 10 ... 138083 more bytes>,
  //   size: 138133
  // },

    if (!sku || !model) 
      return res.status(400).json({ message: "SKU and Model required" });

    // Check if SKU already exists
    const existing = await Product.findOne({ where: { sku } });
    if (existing) 
      return res.status(400).json({ message: "SKU already exists" });

    let image_data = null;
    let file_type = null;

    if (req.file) {
      image_data = req.file.buffer;
      file_type = req.file.mimetype;
    }
//     ✔️ You are storing:
// image_data → binary image data (BLOB)
// file_type → MIME type (image/png, image/jpeg)

    // Create new product
    await Product.create({ sku, model, color_code, color_desc, wheel_selection, file_type, image_data });

    res.json({ message: "Product registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});


// =======================
// GET PRODUCT BY SKU
// =======================
app.get("/product/:sku", async (req, res) => {
  const { sku } = req.params;
  const product = await Product.findOne({ where: { sku } });
  if (!product) return res.status(404).json({ message: "Product not found" });
console.log(res)
  res.json({
    sku: product.sku,
    model: product.model,
    color_code: product.color_code,
    color_desc: product.color_desc,
    wheel_selection: product.wheel_selection,
    image_url: product.file_type ? `/image/${sku}` : null
    // Works if the frontend is served from the same host as the backend.
  });
});

// =======================
// GET IMAGE BY SKU
// =======================
app.get("/image/:sku", async (req, res) => {
  const product = await Product.findOne({ where: { sku: req.params.sku } });
  if (!product || !product.image_data) return res.status(404).json({ message: "Image not found" });

  res.set("Content-Type", product.file_type);
  res.send(product.image_data);
});

// =======================
// GET ALL PRODUCTS
// =======================
app.get("/products", async (req, res) => {
  const products = await Product.findAll({
    attributes: ["sku", "model", "color_code", "color_desc", "file_type", "wheel_selection"]
  });

  // Map over products and add image_url
  const result = products.map(product => {
    return {
      sku: product.sku,
      model: product.model,
      color_code: product.color_code,
      color_desc: product.color_desc,
      wheel_selection: product.wheel_selection,
      file_type: product.file_type,
      // image_url: product.file_type ? `http://localhost:5000/image/${product.sku}` : null 
       image_url:product.file_type ? `http://localhost:5000/image/${product.sku}?t=${Date.now()}` // cache-buster
       : null 

      // cache -buster :-----is a trick to force the browser to reload
      //  If the URL of an image doesn’t change, the browser assumes it’s the same image and shows the old one — even if the backend file changed.
      // Browser knows exactly where to fetch the image from, including host and port.
    };
  });

  res.json(result);
});

// =======================
// EDIT PRODUCT
// =======================
// app.put("/product/:sku", upload.single("image"), async (req, res) => {
//   const { sku } = req.params;

//   const { model, color_code, color_desc } = req.body;

//   const product = await Product.findOne({ where: { sku } });
//   if (!product) return res.status(404).json({ message: "Product not found" });

//   let updateData = { model, color_code, color_desc };
//   if (req.file) {
//     updateData.image_data = req.file.buffer;
//     updateData.file_type = req.file.mimetype;
//   }

//   await product.update(updateData);
//   res.json({ message: "Product updated successfully" });
// });
app.put("/product/:sku", upload.single("image"), async (req, res) => {
  try {
    const { sku } = req.params;
    const { model, color_code, color_desc, wheel_selection } = req.body;

    const product = await Product.findOne({ where: { sku } });
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const updateData = {
      model,
      color_code,
      color_desc,
      wheel_selection
    };

    // If new image is uploaded
    if (req.file) {
      updateData.image_data = req.file.buffer;
      updateData.file_type = req.file.mimetype;
    }

    await product.update(updateData);

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});


// =======================
// DELETE PRODUCT
// =======================
app.delete("/product/:sku", async (req, res) => {
  const { sku } = req.params;
  const product = await Product.findOne({ where: { sku } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.destroy();
  res.json({ message: "Product deleted successfully" });
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
