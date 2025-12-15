import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/prices';
import { useCart } from '../context/cart';

function Homepage() {
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked,setChecked] = useState([]);
  const [radio,setRadio] = useState([]);
  const [total,setTotal] = useState(0);
  const [page,setPage] = useState(1);
  const [loading,setLoading] = useState(false)

  const getTotal = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() =>{
    if(page === 1) return;
    loadMore();
  },[page])

  const loadMore = async () => {
    try {
      console.log('Loadmore function called');
      setLoading(true)
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`)
      setLoading(false)
      setProducts([...products,...data?.products])
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error('Something Went Wrong ')
    }
  }
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value,id) =>{
    let all = [...checked]
    if(value){
      all.push(id);
    }
    else{
      all = all.filter(c => c!== id);
    }
    setChecked(all);

  }

  useEffect(() => {
    if(!checked.length || !radio.length){
      getAllProducts();
    }
  }, [checked.length,radio.length]);
  useEffect(() => {
    if(checked.length || radio.length){
      filterProduct();
    }
  }, [checked,radio]);
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  
  
  const filterProduct = async () => {
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filter`,{checked,radio});
      setProducts(data.products);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Layout title={"Best Offers - UniDeals"}>
        <div className="row my-3">
          <div className="col-md-3 ">
            <h6 className="text-center ">Filter by Category</h6>
            <div className="d-flex flex-column ms-2">
            {categories?.map(c =>(
              <Checkbox m-3 key={c._id} onChange={(e) =>{handleFilter(e.target.checked,c._id)}}>
                {c.name}
              </Checkbox>
            ))}
            </div>
            <h6 className="text-center my-3 ">Filter by Price</h6>
            <div className="d-flex flex-column ms-2">
            <Radio.Group onChange={e => setRadio(e.target.value)}>
              {Prices?.map(p =>(
                <div  key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
            </div>
            <div className="d-flex align-items-center flex-column mt-3 ms-2">
              <button className="btn btn-danger " style={{width:"65%"}} onClick={() => window.location.reload()}>RESET FILTERS</button>
            </div>
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All ITEMS</h1>
            <div className="d-flex flex-row  flex-wrap">
              {products.map((p) => (
                <div className="card m-3 " style={{ height: '25rem', width: '18rem' }}>
                    <div className="card-body p-0 border">
                    <Link key={p._id} className='product-link  ' to={`/product/${p.slug}`}>
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} height={'250px'} className="card-img-top border-top-0 " alt={p.name} />
                      <div className="d-flex p-2  flex-row justify-content-around">
                      <h4 className="card-title ">{p.name[0].toUpperCase() + p.name.slice(1)}</h4>
                      <h5 className="card-title ">${p.price}</h5>
                      </div>
                      <p className="card-text text-center ">{p.description.substring(0,60)}</p>
                      </Link>
                      
                      <button class="btn btn-secondary m-3  " style={{width:"90%"}}  onClick={ () =>{
                        setCart([...cart,p]);
                        localStorage.setItem("cart",JSON.stringify([...cart, p]))
                        toast.success('Added to Cart')
                      }} >Add to cart</button>
                    </div>
                  </div>
              ))}
            </div>
            <div className='ms-5 p-3'>
              {products && products.length < total && (
                <button className="btn btn-warning" onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}>
                  {loading ? "Loading...." : "Loadmore"}
                </button>
              )} 
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Homepage