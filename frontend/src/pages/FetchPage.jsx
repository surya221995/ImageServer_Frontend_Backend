import { useState } from "react";

function FetchProduct() {
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  const fetchProduct = async () => {
    if (!sku) return setMessage("Enter SKU");

    const res = await fetch(`http://192.168.1.216:5000/product/${sku}`);
    const data = await res.json();

    if (res.status !== 200) {
      setMessage(data.message);
      setProduct(null);
    } else {
      setProduct(data);
      setMessage("");
    }
  };

  return (
    <>
      <h4 className="mb-3">Fetch Product by SKU</h4>

      <input
        className="form-control mb-3"
        placeholder="SKU"
        value={sku}
        onChange={e => setSku(e.target.value)}
      />

      <button className="btn btn-secondary mb-3" onClick={fetchProduct}>
        Fetch
      </button>

      {message && <div className="alert alert-warning">{message}</div>}

      {product && (
        <div>
          <p><b>SKU:</b> {product.sku}</p>
          <p><b>Model:</b> {product.model}</p>
          <p><b>Color Code:</b> {product.color_code}</p>
          <p><b>Color Desc:</b> {product.color_desc}</p>

          {product.image_url && (
            <img
              src={`http://localhost:5000${product.image_url}`}
              width="200"
              className="img-thumbnail"
              alt=""
            />
          )}
        </div>
      )}
    </>
  );
}

export default FetchProduct;
