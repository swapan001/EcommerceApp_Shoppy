import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const Categories = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) {
      getProductByCat();
    }
  }, [params?.slug]);

  const getProductByCat = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      const data = response.data; 
      console.log(data);
      setProducts(data?.products);
      setCategory(data?.category);
      setLoading(false); // Set loading state to false once data is loaded
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false in case of an error
    }
  };

  return (
    <Layout title={'DineDrop - Categories'}>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h6 className="text-center">{products?.length} result found </h6>
            <div className="row">
              <div className="col-md-9 offset-1">
                <div className="d-flex flex-row flex-wrap">
                  {products?.map((p) => (
                    <Link key={p._id} className="product-link" to={`/product/${p.slug}`}>
                      <div className="card m-3" style={{ height: '25rem', width: '18rem' }}>
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                          height={'250px'}
                          className="card-img-top border-top-0"
                          alt={p.name}
                        />
                        <div className="card-body border">
                          <div className="d-flex flex-row justify-content-between">
                            <h4 className="card-title">{p.name[0].toUpperCase() + p.name.slice(1)}</h4>
                            <h5 className="card-title">${p.price}</h5>
                          </div>
                          <p className="card-text">{p.description.substring(0, 60)}</p>

                          <button className="btn btn-secondary" style={{ width: '100%' }}>
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
