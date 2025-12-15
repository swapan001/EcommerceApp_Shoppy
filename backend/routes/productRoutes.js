const express = require('express');
const router = express.Router();
const formidable = require('express-formidable'); 

const {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController
} = require('../controllers/productController');
const { requireSignIn } = require('../middlewares/authMiddleware');

router.post('/create-product',formidable(), createProductController);
router.get('/get-products', getProductController);
router.get('/get-product/:slug', getSingleProductController);
router.get('/product-photo/:id', productPhotoController);
router.delete('/delete-product/:id', deleteProductController);
router.put('/update-product/:id',formidable(), updateProductController);
router.post('/product-filter',productFilterController)

router.get('/product-count',productCountController)
router.get('/product-list/:page',productListController)

router.get('/search/:keyword',searchProductController)

router.get('/related-product/:pid/:cid',relatedProductController);

router.get('/product-category/:slug',productCategoryController);
router.get('/braintree/token',braintreeTokenController);
router.post('/braintree/payment', requireSignIn, braintreePaymentController)


module.exports = router;
