import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [combinations, setCombinations] = useState([]);

  const colors = ["آبی", "قرمز", "سبز", "زرد", "مشکی"];
  const sizes = ['m', 'l', 'xl', '2xl', '3xl'];
  const navigate = useNavigate();

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleColorChange = (selectedOptions) => setSelectedColors(selectedOptions.map(option => option.value));
  const handleSizeChange = (selectedOptions) => setSelectedSizes(selectedOptions.map(option => option.value));

  const handleDesignChange = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setDesigns([...designs, e.target.value]);
      e.target.value = "";
    }
  };

  const addCombinationsToAPI = async () => {
    const newCombinations = [];
    selectedColors.forEach((color) => {
      selectedSizes.forEach((size) => {
        designs.forEach((design) => {
          newCombinations.push({
            productName,
            color,
            size,
            design,
          });
        });
      });
    });

    try {
      const response = await axios.post("http://localhost:8000/products", { productName, combinations: newCombinations });
      setCombinations(newCombinations);
      setTimeout(() => {
        alert('محصول با موفقیت اضافه شد!!')
        window.location.reload()
      }, 2000);
    } catch (error) {
      console.error(error);
    }    
  };

  return (
    <div className="px-4 mt-10">
      <div className="max-w-4xl mx-auto p-3  bg-white shadow-lg rounded-lg">

        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">فرم افزودن محصول جدید</h2>
          <button
            onClick={() => navigate("/products")}
            className="px-3 py-2 bg-blue-400 text-sm font-light text-white rounded-md hover:bg-blue-600">
            مشاهده محصولات
          </button>
        </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">نام محصول:</label>
        <input
          type="text"
          value={productName}
          onChange={handleProductNameChange}
          className="w-full p-2 outline-none border text-sm border-gray-300 rounded-[4px] mt-2 focus:border-blue-500 focus:border-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">رنگ‌ها:</label>
        <Select
          isMulti
          options={colors.map(color => ({ value: color, label: color }))}
          onChange={handleColorChange}
          className="mt-2 text-xs"
          placeholder=''
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">سایز‌ها:</label>
        <Select
          isMulti
          options={sizes.map(size => ({ value: size, label: size }))}
          onChange={handleSizeChange}
          className="mt-2 text-xs"
          placeholder=''
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">طرح‌ها:</label>
        <input
          type="text"
          onKeyUp={handleDesignChange}
          className="w-full p-2 outline-none border text-sm border-gray-300 rounded-[4px] mt-2 focus:border-blue-500 focus:border-2"
        />
        <div className="mt-4">
          <h4 className="text-ئی font-medium">طرح‌های وارد شده:</h4>
          <ul className="flex flex-wrap gap-3 mt-2">
            {designs.map((design, index) => (
              <li key={index} className="text-sm text-gray-700 bg-slate-200 w-fit p-1 rounded-md">{design}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6 text-center">
        <button
          onClick={addCombinationsToAPI}
          className="px-6 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          disabled={!productName || selectedColors.length === 0 || selectedSizes.length === 0 || designs.length === 0}
        >
          افزودن محصول
        </button>
      </div>

      {combinations.length > 0 && (
        <div className="mb-6 w-full">
          <h3 className="text-lg font-semibold">ترکیب‌های محصول:</h3>
          <ul className="flex flex-wrap gap-4 w-full">
            {combinations.map((combination, index) => (
              <li key={index} className="flex items-center gap-4 border p-4 rounded-lg mt-2">
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductForm;
