import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth,setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, { email, password })
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token
                })
                localStorage.setItem('auth',JSON.stringify(res.data))
                navigate(location.state || '/');
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
        <Layout title={"Login - UniDeals"}>
            <div className=" form-container">
                <form >
                <h1 className='title'>Login</h1>
                    <div className="mb-3">
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="exampleInputEmail1" placeholder='Enter Your Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} className="form-control" id="exampleInputPassword1" required />
                    </div>

                    <button type="submit" onClick={handleClick} className="btn btn-primary">Submit</button>
                    <div className="mb-3">
                    <button type="button" onClick={()=>{navigate('/forgot-password')}} className="btn btn-primary">Forgot Password</button>
                    </div>
                </form>


            </div>
        </Layout>
    )
}

export default Login