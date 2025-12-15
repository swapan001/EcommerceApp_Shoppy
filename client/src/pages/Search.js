import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/Search'
import { Link } from 'react-router-dom'

const Search = () => {
    const [values, setValues] = useSearch()
    return (
        <Layout title={'Search results'}>
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>{values?.results.length < 1 ? 'No Product Found' : `Found ${values?.results?.length}`}</h6>
                    <div className="d-flex flex-row justify-content-around flex-wrap">
                        {values?.results.map((p) => (
                            <Link key={p._id} className='product-link  ' to={`/product/${p.slug}`}>
                                <div className="card m-3 " style={{ height: '55vh', width: '18rem' }}>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} height={'250px'} className="card-img-top border-top-0 " alt={p.name} />
                                    <div className="card-body  border">
                                        <div className="d-flex flex-row justify-content-between">
                                            <h4 className="card-title">{p.name[0].toUpperCase() + p.name.slice(1)}</h4>
                                            <h5 className="card-title ">${p.price}</h5>
                                        </div>
                                        <p className="card-text">{p.description.substring(0, 60)}</p>
                                        <button class="btn btn-primary ms-2 ">More Details</button>
                                        <button class="btn btn-secondary ms-2">Add to cart</button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search