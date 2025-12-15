import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-product/${slug}`
        );
        setProduct(response.data.product);
        getSimilarProduct(response?.data.product._id, response?.data.product.category._id);

        // console.log(product)
        // console.log(product._id)
      } catch (error) {
        console.error(error);
      }
    };
    if (slug) {
      getProduct();
    }
  }, [slug]);

  const getSimilarProduct = async (pid, cid) => {
    try {
      if (!pid || !cid) {
        console.error("Product ID or Category ID is missing.");
        return;
      }
  
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
  
      if (response.data && Array.isArray(response.data.product)) {
        // Extract the similar products from the 'product' array
        const similarProducts = response.data.product;
  
        // Update the 'relatedProducts' state with the extracted similar products
        setRelatedProducts(similarProducts);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };
  

  return (
    <Layout>
      {product && ( // Check if product is not null before rendering
        <div className="row container">
          <div className="col-md-6 align-center">
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              style={{ height: "450px", width: "600px" }}
              className="m-3 "
              alt={product.name}
            />
          </div>
          <div className="col-md-6 ">
            <h1 className='text-center'>Product Details</h1>
            <h6>Name :<pre> {product.name}</pre></h6>
            <h6>Description : <pre>{product.description}</pre></h6>
            <h6>Price : <pre>{product.price}</pre></h6>
            <h6>Category :<pre> {product.category.name}</pre></h6> {/* Access category name */}
            <h6>No. of Items Available :<pre> {product.quantity}</pre></h6>
            <button class="btn btn-secondary ms-1">ADD TO CART</button>
          </div>
        </div>
      )}
      <hr />
      <div className="row container">
        <h6>Similar Products</h6>
        {Array.isArray(relatedProducts) && relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex  flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-5" style={{ width: "18rem" }}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p?._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text"> $ {p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                <button class="btn btn-secondary ms-1">ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
