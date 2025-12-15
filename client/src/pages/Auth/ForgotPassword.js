import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forget-password`, { email, newPassword, answer })
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                
                navigate(location.state || '/login');
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
        <Layout title={'Forgot-Password - UniDeals'}>
            <form >
                <h1 className='title'>Set New Password</h1>
                <div className="mb-3">
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="exampleInputEmail1" placeholder='Enter Your Email' required />
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" value={answer} onChange={(e) => setAnswer(e.target.value)} id="exampleInputEmail1" placeholder='What is your Favorite Sports' required />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder='Enter Your Password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className="form-control" id="exampleInputPassword1" required />
                </div>

                <button type="submit" onClick={handleClick} className="btn btn-primary">Reset</button>
            </form>
        </Layout>
    )
}

export default ForgotPassword