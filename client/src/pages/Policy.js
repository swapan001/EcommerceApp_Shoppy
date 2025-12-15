import React from 'react'
import Layout from '../components/Layout/Layout'

function Policy() {
  return (
    <div>
      <Layout  title={"Policy-UniDeals"}>
        <div className="policy">
          <div className="img">
            <img src="/images/Privacy_Policy.avif" style={{ height:"25rem" }} alt="" />
          </div>
          <div className="policy-info">
            <h3>Privacy Policy</h3>
            <p className="description">
              At Shoppy, we value your privacy and are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect the data you provide when using our ecommerce platform.
            </p>

            <h4>Data Usage:</h4>

            <p className="description">
              Your personal data is used to process orders, deliver products, and provide customer support. We may also use your information to send updates, promotions, and relevant content, but you can opt out at any time.
            </p>


            <h4>Cookies:</h4>
            <p className="description">

              We use cookies to enhance your browsing experience and gather analytical data for site improvement.

            </p>
            <h4>Consent:</h4>
            <p className="description">
              By using our platform, you consent to the terms of this Privacy Policy.

              Please contact us if you have any questions or concerns regarding your privacy. Your trust is essential to us, and we are committed to maintaining the confidentiality and security of your data.
            </p>
            <h5>Shopping - Your Trusted Shopping Destination.</h5>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Policy