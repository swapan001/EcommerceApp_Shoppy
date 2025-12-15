import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-toastify';
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
import '../../styles/AuthStyles.css';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, { name, email, password, phone, address,answer })
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong');

        }
    }

    return (
        <Layout title={"Register Now - UniDeals"}>
            <div className=" form-container">
                <form >
                <h1 className='title'>REGISTRATION FORM</h1>
                    <div className="mb-3">
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} id="exampleInputName" placeholder='Enter Your Name' required />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="exampleInputEmail1" placeholder='Enter Your Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={phone} className="form-control" onChange={(e) => setPhone(e.target.value)} id="exampleInputNumber" placeholder='Enter Your Phone Number' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={address} className="form-control" onChange={(e) => setAddress(e.target.value)} id="exampleInputAddress" placeholder='Enter Your Address' aria-describedby="emailHelp" required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} className="form-control" onChange={(e) => setAnswer(e.target.value)} id="exampleInputAddress" placeholder='What is your Favorite Sports' aria-describedby="emailHelp" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} className="form-control" id="exampleInputPassword1" required />
                    </div>

                    <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
                </form>


            </div>
        </Layout>
    )
}

export default Register