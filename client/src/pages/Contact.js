import React from 'react'
import Layout from '../components/Layout/Layout'
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function Contact() {
  return (
    <div>
        <Layout  title={"Contact us - UniDeals"}>
            <div className="row contactus my-5 ">
              <div className="col-md-6">
                <img src="images/Contact_Us.jpg" alt="Contact US" style={{width:"100%"}} />
              </div>
              <div className="col-md-4 my-3">
                <h1 className='bg-dark text-white text-center'>Contact Us</h1>
                <p className="text-justify mt-2">any query and info about product feel free to call anytime we are 24X7 Available for our services </p>
                <p className="mt-3">
                  <EmailIcon/> : www.swan03228@gmail.com
                </p>
                <p className="mt-3">
                  <PhoneIcon/> : +91 738421xxxx
                </p>
                <p className='mt-3'>
                  <SupportAgentIcon/> : 1800-0000-00xx (toll free)
                </p>
              </div>
            </div>
        </Layout>
    </div>
  )
}

export default Contact