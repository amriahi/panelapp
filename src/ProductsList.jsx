// from react
import { useEffect, useState } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// axios
import axios from "axios";

// icons
import { FaInfo } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const ProductList = () => {

  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newProductName, setNewProductName] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  // const handleEditClick = (productId, currentName) => {
  //   setEditMode(productId); 
  //   setNewProductName(currentName);
  // };


  const handleProductNameChange = (e) => {
    setNewProductName(e.target.value);
  };

  const handleSaveProductName = async (productId) => {
    if (!newProductName) {
      alert("نام محصول نمی‌تواند خالی باشد.");
      return;
    }

    try {
      const updatedProduct = {
        productName: newProductName,
      };

      const response = await axios.put(
        `http://localhost:8000/products/${productId}`,
        updatedProduct
      );
      
      const updatedProducts = products.map((product) =>
        product.id === productId ? { ...product, productName: newProductName } : product
      );
      setProducts(updatedProducts);
      setEditMode(null);
    } catch (error) {
      console.error("Error updating product name:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/products/${productId}`);
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="px-4">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">لیست محصولات</h3>
          <button
            type="button"
            className="px-3 py-2 bg-blue-400 text-sm font-light text-white rounded-md hover:bg-blue-600"
            onClick={() => navigate('/')}
          >
            افزودن محصول
          </button>
        </div>

      {products.length === 0 ? (
        <p className="text-gray-500">هیچ محصولی در فروشگاه وجود ندارد</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="mb-4 px-4 border rounded-md shadow-sm">
            {editMode === product.id ? (
              
              <div className="mb-4">
                <input
                  type="text"
                  value={newProductName}
                  onChange={handleProductNameChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                />
                <button
                  onClick={() => handleSaveProductName(product.id)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md mt-4"
                >
                  ذخیره تغییرات
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-x-4">
                <h3 className="text-md font-medium">{product.productName}</h3>

                <div className="flex items-center gap-x-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="text-slate-600 p-2 rounded-full text-md hover:bg-slate-200"
                  >
                    <FaInfo className="w-6 h-6" />
                  </Link>

                  {/* <button
                    onClick={() => handleEditClick(product.id, product.productName)}
                    className="text-slate-600 p-2 rounded-full text-md hover:bg-slate-200">
                    <MdEdit className="w-6 h-6" />
                  </button> */}

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-slate-600 p-2 rounded-full text-md hover:bg-slate-200">
                    <MdDelete className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default ProductList;
