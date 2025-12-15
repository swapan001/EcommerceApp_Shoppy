import React from 'react'
import Layout from '../components/Layout/Layout'

function About() {
  return (
    <div>
      <Layout title={"About us - UniDeals"}>
        <div className="about my-5">
          <div className="img">
            <img src="images/About_Us.jpg" style={{width:"25em"}} alt="About-us-image" />
          </div>
          <div className="about-info">
            <h2>About Us - <span className='site-title'>Shoppy</span></h2>
            <p className="description">
              Welcome to <span className='site-title'>Shoppy</span>, your one-stop destination for all your shopping needs! At <span className='site-title'>DineDrop</span>, we are dedicated to providing you with a delightful and hassle-free shopping experience. With a wide range of products spanning various categories, we aim to cater to diverse preferences and interests.
            </p>
            <h4>Our Mission:</h4>
            <p className="description">
              Our mission is to redefine online shopping by offering an extensive selection of top-quality products at competitive prices. We strive to make your shopping journey convenient, enjoyable, and secure. Customer satisfaction is at the core of everything we do, and we continuously work to exceed your expectations.
            </p>

            <h4>Our Team:</h4>

            <p className="description">
              Behind <span className='site-title'>Shoppy</span> is a team of passionate individuals who share a common vision: to revolutionize the way you shop online. We work tirelessly to ensure that our platform is always up-to-date with the latest trends and innovations to meet your ever-changing needs.
            </p>

            <h4>Join Us Today:</h4>

            <p className='description'>
              We invite you to join us on this exciting journey of discovering the perfect products that enrich your lifestyle. At <span className='site-title'>DineDrop</span>, your shopping experience is our priority, and we are here to provide you with unparalleled convenience and satisfaction.

              Thank you for choosing <span className='site-title'>Shoppy</span>. Happy shopping!
            </p>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default About