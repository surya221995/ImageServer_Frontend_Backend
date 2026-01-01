const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { sequelize, Product } = require("./model");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Sync DB
sequelize.sync().then(() => console.log("Database synced"));

// =======================
// REGISTER / UPDATE PRODUCT
// =======================
app.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { sku, model, color_code, color_desc } = req.body;
    if (!sku || !model) return res.status(400).json({ message: "SKU and Model required" });

    let image_data = null;
    let file_type = null;

    if (req.file) {
      image_data = req.file.buffer;
      file_type = req.file.mimetype;
    }

    await Product.upsert({ sku, model, color_code, color_desc, file_type, image_data });

    res.json({ message: "Product saved successfully" });
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

  res.json({
    sku: product.sku,
    model: product.model,
    color_code: product.color_code,
    color_desc: product.color_desc,
    image_url: product.file_type ? `/image/${sku}` : null
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
    attributes: ["sku", "model", "color_code", "color_desc", "file_type"]
  });
  res.json(products);
});

// =======================
// EDIT PRODUCT
// =======================
app.put("/product/:sku", upload.single("image"), async (req, res) => {
  const { sku } = req.params;
  const { model, color_code, color_desc } = req.body;

  const product = await Product.findOne({ where: { sku } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  let updateData = { model, color_code, color_desc };
  if (req.file) {
    updateData.image_data = req.file.buffer;
    updateData.file_type = req.file.mimetype;
  }

  await product.update(updateData);
  res.json({ message: "Product updated successfully" });
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
