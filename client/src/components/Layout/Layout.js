import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from 'react-helmet'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout(props,{children,title,description,keywords,author}) {
  return (
    <div className='layout'>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "80vh" }}><ToastContainer/>{props.children}</main>
      <Footer />
    </div>
  )
}
Layout.defaultProps = {
  title:'Unideals - Shop now',
  description:'MERN Stack Project',
  keywords:'MERN, react,node,mongodb,express',
  author:'Gurdeep Singh'
}

export default Layout