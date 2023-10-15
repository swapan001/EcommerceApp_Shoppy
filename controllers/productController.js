const { default: slugify } = require('slugify');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const orderModel = require('../models/orderModel');

const fs = require('fs').promises;
const braintree = require('braintree');
const dotenv = require('dotenv');
dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "description is Required" });
            case !price:
                return res.status(500).send({ error: "price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 100000000:
                return res.status(500).send({ error: "Photo is required and should be less than 1mb" });

        }
        const products = new productModel({ ...req.fields, slug: slugify(name) });

        try {
            // Handle database interaction here
            await products.save();
        } catch (dbError) {
            console.log('Database Error:', dbError);
            res.status(500).send({
                success: false,
                error: dbError,
                message: 'Error in Creating Product'
            });
            return;
        }
        if (photo) {
            try {
                const photoData = await fs.readFile(photo.path); // Read the photo asynchronously
                products.photo.data = photoData;
                products.photo.contentType = photo.type;

                // Save the product again with the updated photo information
                await products.save();

                res.status(201).send({
                    success: true,
                    message: 'Product created Successfully',
                    products,
                });
            } catch (photoError) {
                console.log('Photo Read Error:', photoError);
                res.status(500).send({
                    success: false,
                    error: photoError,
                    message: 'Error in Reading Photo'
                });
            }
        } else {
            // No photo uploaded
            res.status(201).send({
                success: true,
                message: 'Product created Successfully',
                products,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: 'Error in Creating Product'
        });
    }
}

const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "All Products",
            products,

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Getting products",
            error: error.message
        })
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category');
        res.status(200).send({
            success: true,
            message: "Product is fetched",
            product: product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Getting products",
            error: error.message
        })
    }
}

const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Getting products",
            error: error.message
        })
    }
}

const deleteProductController = async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id).select("-photo");
        if (!deletedProduct) {
            // Product with the specified ID was not found
            return res.status(404).send({
                success: false,
                message: "Product not found."
            });
        }
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting the product",
            error: error.message
        });
    }
}

const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "description is Required" });
            case !price:
                return res.status(500).send({ error: "price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 100000000:
                return res.status(500).send({ error: "Photo is required and should be less than 1mb" });
        }
        const products = await productModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product Updated Successfully',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Updating Product'
        })
    }
}

const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body; // Destructure req.body directly
        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products: products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error While Filtering Products',
            error,
        });
    }
};
const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total: total
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Error in Product count',
            success: false,
            error,
        });
    }
};

const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({})
            .select("-photo") // Corrected the select parameter
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products: products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in per page ctrl',
            error,
        });
    }
};

const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in Search Product API",
            error,
        })
    }
}


const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const product = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(4).populate("category")
        res.status(200).send({
            success: true,
            product: product
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message
        })
    }
}

const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate('category');

        res.status(200).send({
            success: true,
            category: category,
            products: products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something Went Wrong",
            error,
        })
    }
}


const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
const braintreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController };