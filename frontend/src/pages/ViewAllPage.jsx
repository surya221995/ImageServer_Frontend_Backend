import { useEffect, useState } from "react";
import BasicExample from "../SKUCard";

function ViewAll() {
  const [products, setProducts] = useState([]);

  const fetchAllProducts = async () => {
    const res = await fetch("http://localhost:5000/products");
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (sku) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/product/${sku}`, { method: "DELETE" });
    fetchAllProducts();
  };

  // const updateProduct = async (product) => {
  //   await fetch(`http://localhost:5000/product/${product.sku}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(product),
  //   });
  //   fetchAllProducts();
  // };

 const updateProduct = () => {
  // No product parameter needed anymore
  fetchAllProducts(); // Just refresh list after an update
};



  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <>
      <h4 className="mb-3">All Products</h4>
      <BasicExample
        products={products}
        onDelete={deleteProduct}
         onUpdate={updateProduct} // just refresh
      />
    </>
  );
}

export default ViewAll;
