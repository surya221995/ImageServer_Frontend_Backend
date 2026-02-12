import { useState } from "react";

function BasicExample({ products, onDelete, onUpdate }) {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // for new image

  const openEdit = (product) => {
    setCurrent(product);
    setSelectedFile(null); // reset file when opening modal
    setShow(true);
  };

  const closeEdit = () => {
    setShow(false);
    setCurrent(null);
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  // ✅ Updated handleUpdate to include image
  const handleUpdate = async () => {
    if (!current) return;

    // Use FormData to support image upload
    const formData = new FormData();
    formData.append("model", current.model);
    formData.append("color_code", current.color_code);
    formData.append("color_desc", current.color_desc);
    formData.append("wheel_selection", current.wheel_selection || "");

    if (selectedFile) {
      formData.append("image", selectedFile); // Must match backend: upload.single("image")
    }

    await fetch(`http://localhost:5000/product/${current.sku}`, {
      method: "PUT",
      body: formData,
    });

    onUpdate(); // Refresh products list
    closeEdit();
  };

  return (
    <>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p.sku}>
            <div className="card h-100 shadow-sm">
              {/* IMAGE */}
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.model}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: "200px" }}
                >
                  <span className="text-muted">No Image</span>
                </div>
              )}

              {/* CARD BODY */}
              <div className="card-body">
                <h5 className="card-title">{p.sku}</h5>
                <p className="mb-1"><strong>Model:</strong> {p.model}</p>
                <p className="mb-1"><strong>Color:</strong> {p.color_desc}</p>
                <p className="mb-2">
                  <strong>Wheel:</strong> {p.wheel_selection || "N/A"}
                </p>
              </div>

              {/* CARD FOOTER */}
              <div className="card-footer bg-white border-0 d-flex justify-content-between">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(p.sku)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {show && current && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Product – {current.sku}</h5>
                <button className="btn-close" onClick={closeEdit}></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  name="model"
                  value={current.model}
                  onChange={handleChange}
                  placeholder="Model"
                />
                <input
                  className="form-control mb-2"
                  name="color_code"
                  value={current.color_code}
                  onChange={handleChange}
                  placeholder="Color Code"
                />
                <input
                  className="form-control mb-2"
                  name="color_desc"
                  value={current.color_desc}
                  onChange={handleChange}
                  placeholder="Color Description"
                />
                <select
                  className="form-control mb-2"
                  name="wheel_selection"
                  value={current.wheel_selection || ""}
                  onChange={handleChange}
                >
                  <option value="">No Selection</option>
                  <option value="front wheel">Front Wheel</option>
                  <option value="rear wheel">Rear Wheel</option>
                </select>

                {/* IMAGE INPUT */}
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                {current.image_url && !selectedFile && (
                  <img
                    src={current.image_url}
                    alt="Current"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BasicExample;
