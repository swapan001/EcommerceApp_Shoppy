const categoryModel = require("../models/categoryModel");
const slugify = require('slugify')

const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                message: 'Name is Required'
            })
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exists'
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'New Category Created'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const id = req.params.id;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );

        res.status(201).send({
            success: true,
            message: 'Category Updated Successfully',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

const deleteCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findByIdAndDelete(id);

        res.status(201).send({
            success: true,
            message: 'Category Deleted Successfully',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

const categoryController = async (req,res) =>{
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Category List",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting all categories'
        })
    }
}
const singlecategoryController = async (req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Category found SuccessFully",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting all categories'
        })
    }
}

module.exports = { createCategoryController, updateCategoryController,categoryController,singlecategoryController,deleteCategoryController }