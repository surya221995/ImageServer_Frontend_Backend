import { useState, useEffect } from "react";
import BasicExample from "./SKUCard";

function App() {
  const [sku, setSku] = useState("");
  const [model, setModel] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [colorDesc, setColorDesc] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [tab, setTab] = useState("register");

  const registerProduct = async () => {
    const formData = new FormData();
    formData.append("sku", sku);
    formData.append("model", model);
    formData.append("color_code", colorCode);
    formData.append("color_desc", colorDesc);
    if (file) formData.append("image", file);

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const fetchProduct = async () => {
    if (!sku) return setMessage("Enter SKU");

    const res = await fetch(`http://localhost:5000/product/${sku}`);
    const data = await res.json();

    if (res.status !== 200) {
      setMessage(data.message);
      setProduct(null);
    } else {
      setProduct(data);
      setMessage("");
    }
  };

  const fetchAllProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    const data = await res.json();
    setAllProducts(data);
  };

  useEffect(() => {
    if (tab === "list") fetchAllProducts();
  }, [tab]);

  const deleteProduct = async (sku) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/product/${sku}`, { method: "DELETE" });
    fetchAllProducts();
  };

  const editProduct = async (p) => {
    const newModel = prompt("Enter new model", p.model);
    const newColorCode = prompt("Enter new color code", p.color_code);
    const newColorDesc = prompt("Enter new color description", p.color_desc);

    const formData = new FormData();
    formData.append("model", newModel);
    formData.append("color_code", newColorCode);
    formData.append("color_desc", newColorDesc);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e) => {
      if (e.target.files[0]) formData.append("image", e.target.files[0]);

      await fetch(`http://localhost:5000/product/${p.sku}`, {
        method: "PUT",
        body: formData
      });
      fetchAllProducts();
    };
    fileInput.click();
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">SKU Color Identification System</h2>

      {/* Navigation */}
      <div className="text-center mb-4">
        <button className="btn btn-primary me-2" onClick={() => setTab("register")}>Register</button>
        <button className="btn btn-secondary me-2" onClick={() => setTab("fetch")}>Fetch</button>
        <button className="btn btn-success" onClick={() => setTab("list")}>View All</button>
      </div>

      <hr />

      {/* REGISTER */}
      {tab === "register" && (
        <>
          <h4 className="mb-3">Register Product</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input className="form-control" placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <input className="form-control" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <input className="form-control" placeholder="Color Code" value={colorCode} onChange={e => setColorCode(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <input className="form-control" placeholder="Color Description" value={colorDesc} onChange={e => setColorDesc(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <input className="form-control" type="file" onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={registerProduct}>Register</button>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </>
      )}

      {/* FETCH */}
      {tab === "fetch" && (
        <>
        {/* added */}
          <h4 className="mb-3">Fetch Product by SKU</h4>
          <div className="row">
            <div className="col-md-4 mb-3">
              <input className="form-control" placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} />
            </div>
          </div>

          <button className="btn btn-secondary mb-3" onClick={fetchProduct}>Fetch</button>

          {message && <div className="alert alert-warning">{message}</div>}

          {product && (
            <div className="mt-3">
              <p><b>SKU:</b> {product.sku}</p>
              <p><b>Model:</b> {product.model}</p>
              <p><b>Color Code:</b> {product.color_code}</p>
              <p><b>Color Desc:</b> {product.color_desc}</p>
              {product.image_url && (
                <img src={`http://localhost:5000${product.image_url}`} width="200" className="img-thumbnail" />
              )}
            </div>
          )}
        </>
      )}

     

      <BasicExample products={allProducts}  onDelete={deleteProduct}/>
      
    </div>
  );
}

export default App;
