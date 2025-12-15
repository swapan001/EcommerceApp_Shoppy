import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { Select } from 'antd';
import { Button, Modal } from 'antd';
const { Option } = Select
const UpdateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const params = useParams();
    const [category, setCategory] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const [id, setId] = useState("");
    const getSingleProduct = async () => {
        try {
            console.log('Get Single product is called');
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            console.log(data)
            setName(data.product.name);
            setId(data.product._id)
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setCategory(data.product.category._id);
            setShipping(data.product.shipping);
            setPhoto(data.product.photo);
        } catch (error) {
            console.log(error);
            toast.error('Something Went wrong');
        }
    };
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data.category);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in getting categories');
        }
    };
    useEffect(() => {
        try {
            getAllCategory();
            getSingleProduct();
        } catch (error) {
            console.log(error);
            toast.error('Something Went wrong');
        }
    }, []);
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true); // Open the modal
    };
    const handleOk = async () => {
        await handleDelete();
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
            navigate("/dashboard/admin/products");
            if (data.success) {
                toast.success("Product Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            console.log('handle Update is called');
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category);
            const { data } = axios.put(
                `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
                productData
            );
            console.log('Data Updated Successfully');
            if (data?.success) {
                toast.error(data?.message);
            } else {
                toast.success("Product Updated Successfully");
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    };



    return (
        <Layout title={'Dashboard-product'}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Item</h1>
                        <div className="m-5 ">
                            <Select
                                bordered={false}
                                placeholder="Select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => {
                                    setCategory(value);
                                }}
                                value={category}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className='btn btn-outline-dark col-md-12 form-control'>
                                    {photo ? photo.name : "Upload Photo"}
                                    <input type="file" name="photo" accept='image/*'
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                    />
                                </label>

                            </div>
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img

                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"300px"}
                                            className="img img-responsive rounded-circle"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img
                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`}
                                            alt="product_photo"
                                            height={"250px"}
                                            className="img img-responsive rounded-pill"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input type="text"
                                    value={name}
                                    placeholder='Enter Name'
                                    className='form-control'
                                    onChange={(e) => { setName(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control"
                                    value={description}
                                    id="exampleFormControlTextarea1"
                                    rows={3} defaultValue={""}
                                    placeholder='Enter Description'
                                    onChange={(e) => { setDescription(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <input type="number" name="price"
                                    value={price}
                                    className='form-control'
                                    placeholder='Enter price'
                                    onChange={(e) => { setPrice(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <input type="number"
                                    placeholder='Enter Quantity'
                                    value={quantity}
                                    className='form-control'
                                    onChange={(e) => { setQuantity(e.target.value) }} />
                            </div>
                            <Select
                                bordered={false}
                                placeholder="Select Shipping "
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => {
                                    setShipping(value);
                                }}
                                value={shipping ? "Yes" : "No"}
                            >
                                <Option value="0">No</Option>
                                <Option value="1">Yes</Option>
                            </Select>
                            <div className="d-flex justify-content-between  flex-row">

                                <button type="submit" className='btn btn-primary mx-5 form-control' onClick={handleUpdate}>UPDATE PRODUCT</button>
                                <button type="submit" className='btn btn-danger mx-5 form-control' onClick={() => showModal()}>Delete PRODUCT</button>
                            </div>
                        </div>
                        <Modal
                            title="Delete Category"
                            open={open}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <p>Are you Sure want to delete this category</p>
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct;