import { useState } from "react";

function Register() {
  const [sku, setSku] = useState("");
  const [model, setModel] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [colorDesc, setColorDesc] = useState("");
  const [wheelSelection, setWheelSelection] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // Track error state

  const registerProduct = async () => {
    const formData = new FormData();
    formData.append("sku", sku);
    formData.append("model", model);
    formData.append("color_code", colorCode);
    formData.append("color_desc", colorDesc);
    formData.append("wheel_selection", wheelSelection);
    if (file) formData.append("image", file);   // must match upload.single("image") in Backend  while post request ,app.post("/register", upload.single("image"), async (req, res) => {

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
        
      });
  console.log(res)
      const data = await res.json();

      if (res.status === 400) {
        // Backend returned a bad request (e.g., SKU exists)
        setIsError(true);
      } else {
        setIsError(false);
      }

      setMessage(data.message);
      console.log(data);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Something went wrong!");
    }
  };

  return (
    <>
      <h4 className="mb-3">Register Product</h4>

      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            placeholder="Color Code"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            placeholder="Color Description"
            value={colorDesc}
            onChange={(e) => setColorDesc(e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <select
            className="form-control"
            onChange={(e) => setWheelSelection(e.target.value)}
          >
            <option value="">No selection</option>
            <option value="front wheel">Front Wheel</option>
            <option value="rear wheel">Rear Wheel</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={registerProduct}>
        Register
      </button>

      {message && (
        <div
          className={`alert mt-3 ${isError ? "alert-danger" : "alert-info"}`}
        >
          {message}
        </div>
      )}
    </>
  );
}

export default Register;
