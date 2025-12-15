import React from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`);
        if (res.data.ok) {
          setOk(true);
        } else {
          console.log('User not authenticated');
          setOk(false);
        }
      } catch (error) {
        console.log(error)
        setOk(false)
      }
    }
    if (auth?.token) {
      authCheck();
    }
  }, []);

  return ok ? <Outlet /> : <Spinner path='' />
}