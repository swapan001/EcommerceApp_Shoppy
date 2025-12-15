import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth';
import moment from 'moment'
const Orders = () => {
    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([]);
    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
            setOrders(data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [])
    return (
        <Layout title={'Dashboard - Your Orders'}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>All Orders</h1>
                        <div className="border shadow">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Buyer</th>
                                        <th scope='col'>Date</th>
                                        <th scope='col'>Payment</th>
                                        <th scope='col'>Quantity</th>
                                    </tr>
                                </thead>
                                {
                                    orders.map((o, i) => {
                                        return (
                                            <tbody>
                                                <tr>
                                                    <td>{i + 1}</td>
                                                    <td>{o?.status}</td>
                                                    <td>{o?.buyer.name}</td>
                                                    <td>{moment(o?.createAt).fromNow()}</td>
                                                    <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                    <td>{o?.products?.length}</td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Orders
