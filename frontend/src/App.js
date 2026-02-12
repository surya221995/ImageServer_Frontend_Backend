import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/RegisterPage";
import FetchProduct from "./pages/FetchPage";
import ViewAll from "./pages/ViewAllPage";

function App() {
  return (
    <Router>
      <div className="container py-4">
        <h2 className="text-center mb-4">SKU Color Identification System</h2>

        {/* Navigation */}
        <div className="text-center mb-4">
          <Link className="btn btn-primary me-2" to="/">Register</Link>
          <Link className="btn btn-secondary me-2" to="/fetch">Fetch</Link>
          <Link className="btn btn-success" to="/products">View All</Link>
        </div>

        <hr />

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/fetch" element={<FetchProduct />} />
          <Route path="/products" element={<ViewAll />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
