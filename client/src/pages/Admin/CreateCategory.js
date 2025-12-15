import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import CategoryForm from "../../components/form/CategoryForm";
import { Button, Modal } from 'antd';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, { name })
      getAllCategory();
      setName("");
      if (data?.success) {
        toast.success(`${name} is created`);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error('Something went Wrong');
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
      toast.error('Something went wrong in getting categories');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  const [open, setOpen] = useState(false);
  const showModal = (id) => {
    setSelected(id); // Set the selected category ID
    setOpen(true); // Open the modal
  };  
  const handleOk = async () => {
    await handleDelete(selected);
    setSelected(null);
    setOpen(false);
  };
  
  const handleCancel = () => {
    setOpen(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`, { name: updatedName })
      if (data.success) {
        toast.success(data.message);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');

    }
  }
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`);
      if (data.success) {
        toast.success(data.message);
        getAllCategory();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  }


  return (
    <Layout title={'Dashboard - All Users'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 container">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>
            <table className="table w-75">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <>
                    <tr>
                      <td key={c._id}>{c.name}</td>
                      <td>
                        <button className="btn btn-primary ms-2" onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c) }}>Edit</button>
                        <button className="btn btn-danger ms-2" onClick={() => showModal(c._id)}>Delete</button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <Modal title="Edit Category" onCancel={() => { setVisible(false) }} visible={visible} footer={null}>
              <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
            </Modal>
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
  );
}

export default CreateCategory