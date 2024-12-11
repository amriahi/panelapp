// from react
import { useEffect, useState } from "react";

// react router dom
import { useParams, useNavigate } from "react-router-dom";

// axios
import axios from "axios";

// icons
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const ProductDetail = () => {

  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentCombination, setCurrentCombination] = useState(null);
  const [newCombination, setNewCombination] = useState({
    color: "",
    size: "",
    design: "",
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleEditClick = (combination) => {
    setEditMode(true);
    setCurrentCombination(combination);
    setNewCombination({
      color: combination.color,
      size: combination.size,
      design: combination.design,
    });
  };

  const handleCombinationChange = (e) => {
    const { name, value } = e.target;
    setNewCombination((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    if (!newCombination.color || !newCombination.size || !newCombination.design) {
      alert("لطفا همه فیلدها را پر کنید");
      return;
    }

    try {
      const updatedCombinations = product.combinations.map((comb) =>
        comb.productName === currentCombination.productName && comb.color === currentCombination.color && comb.size === currentCombination.size && comb.design === currentCombination.design
          ? { ...newCombination, productName: comb.productName }
          : comb
      );

      const response = await axios.put(
        `http://localhost:8000/products/${productId}`,
        { ...product, combinations: updatedCombinations }
      );
      setProduct((prevProduct) => ({
        ...prevProduct,
        combinations: updatedCombinations,
      }));
      setEditMode(false);
      setCurrentCombination(null); 
      window.location.reload()
    } catch (error) {
      console.error("Error editing combination:", error);
    }
  };

  const handleDeleteClick = async (combination) => {
    try {
      const updatedCombinations = product.combinations.filter(
        (item) => item !== combination
      );

      const response = await axios.put(
        `http://localhost:8000/products/${productId}`,
        { ...product, combinations: updatedCombinations }
      );

      setProduct((prevProduct) => ({
        ...prevProduct,
        combinations: updatedCombinations,
      }));

      window.location.reload();
    } catch (error) {
      console.error("Error deleting combination:", error);
    }
  };
  
  const handleBack = () => {
    navigate("/products");
  };

  return (
    <div className="px-4">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-10">
      {product ? (
        <>
          <h2 className="text-xl font-semibold border-b w-fit border-slate-500 text-center mb-6">{product.productName}</h2>

          {editMode && (
            <div className="mb-4 border p-2 rounded-md">
              <h3 className="text-md font-medium mb-4">ویرایش مدل</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="color"
                  value={newCombination.color}
                  onChange={handleCombinationChange}
                  placeholder="رنگ"
                  className="w-full p-2 text-sm text-slate-500 border-2 border-gray-100 rounded-md placeholder:text-xs outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="size"
                  value={newCombination.size}
                  onChange={handleCombinationChange}
                  placeholder="سایز"
                  className="w-full p-2 text-sm text-slate-500 border-2 border-gray-100 rounded-md placeholder:text-xs outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="design"
                  value={newCombination.design}
                  onChange={handleCombinationChange}
                  placeholder="طرح"
                  className="w-full p-2 text-sm text-slate-500 border-2 border-gray-100 rounded-md placeholder:text-xs outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSubmitEdit}
                  className="p-2 bg-blue-500 text-white text-sm rounded-md"
                >
                  تایید
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            {product.combinations.map((combination) => (
              <div key={combination.design} className="px-4 py-2 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center mt-2">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  
                  <div className="flex items-center gap-x-1">
                    <span className="text-slate-400 font-light">رنگ: </span>
                    <p className="bg-neutral-100 p-2 border border-slate-200 text-slate-800 rounded-2xl text-xs font-medium">{combination.color}</p>
                  </div>

                  <div className="flex items-center gap-x-1">
                    <span className="text-slate-400 font-light">سایز: </span>
                    <p className="bg-neutral-100 p-2 border border-slate-200 text-slate-800 rounded-2xl text-xs font-medium">{combination.size}</p>
                  </div>

                  <div className="flex items-center gap-x-1">
                    <span className="text-slate-400 font-light">طرح: </span>
                    <p className="bg-neutral-100 p-2 border border-slate-200 text-slate-800 rounded-2xl text-xs font-medium">{combination.design}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleEditClick(combination)}
                    className="text-slate-600 p-2 rounded-full text-md hover:bg-slate-200">
                    <MdEdit className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(combination)}
                    className="text-slate-600 p-2 rounded-full text-md hover:bg-slate-200">
                    <MdDelete className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-md"
            >
              بازگشت
            </button>
          </div>
        </>
      ) : (
        <p>در حال بارگذاری اطلاعات...</p>
      )}
    </div> 
    </div>
  );
};

export default ProductDetail;

