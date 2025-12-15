import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-products`);
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong ')
        }
    }
    useEffect(() => {
        getAllProducts();
    }, []);
    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className='row'>
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>
                            All Products List
                        </h1>
                        <div class="row row-cols-1  my-3 mx-3 justify-center align row-cols-md-3 g-4">
                            {products.map((p) => (
                                <Link key={p._id} className='product-link  ' to={`/dashboard/admin/product/${p.slug}`}>
                                    <div className="card m-3 border-dark border-top-0 " style={{ height:'50vh', width: '18rem' }}>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} height={'250px'} className="card-img-top" alt={p.name} />
                                        <div className="card-body border">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products;
