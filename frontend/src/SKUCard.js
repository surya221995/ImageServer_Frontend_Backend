import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

function BasicExample({ products, onDelete }) {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  if (!products || products.length === 0) {
    return <p className="text-center mt-3">No products available</p>;
  }

  return (
    <>
      <Row className="mt-4">
        {products.map((p) => (
          <Col md={4} className="mb-4" key={p.sku}>
            <Card style={{ width: "100%" }}>
              {p.file_type ? (
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/image/${p.sku}`}
                  alt={p.model}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <Card.Img
                  variant="top"
                  src="https://via.placeholder.com/300x200?text=No+Image"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <Card.Body>
                <Card.Title>{p.model}</Card.Title>
                <Card.Text>
                  <b>SKU:</b> {p.sku} <br />
                  <b>Color Code:</b> {p.color_code} <br />
                  <b>Color:</b> {p.color_desc}
                </Card.Text>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleShow(p)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(p.sku)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Product Details */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedProduct && (
            <>
              {selectedProduct.file_type && (
                <img
                  src={`http://localhost:5000/image/${selectedProduct.sku}`}
                  alt={selectedProduct.model}
                  className="img-fluid mb-3"
                />
              )}

              <p><b>SKU:</b> {selectedProduct.sku}</p>
              <p><b>Model:</b> {selectedProduct.model}</p>
              <p><b>Color Code:</b> {selectedProduct.color_code}</p>
              <p><b>Color Description:</b> {selectedProduct.color_desc}</p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BasicExample;
