import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/auth';
import moment from 'moment'

import { Select } from 'antd';
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Deliverd", "Cancel"]);
  const [changeStatus, setChangeStatus] = useState("");
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);
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


  const handleChange =async (orderId,value) => {
    try {
      const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,{
        status:value
      });
      getOrders();
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Layout title="Admin - Orders">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          <div className="border shadow">
            <table className="table">
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col' className=''>Status</th>
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
                        <td>
                          <Select bordered={false} onChange={(value) => { handleChange(o._id,value) }} defaultValue={o?.status}>
                            {status.map((s, i) => (
                              <Option key={i}  value={s}>{s}</Option>
                            ))}
                          </Select>
                        </td>

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
    </Layout>
  )
}
export default AdminOrders;
