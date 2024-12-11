// react router dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// pages
import ProductForm from "./ProductForm";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductForm />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
