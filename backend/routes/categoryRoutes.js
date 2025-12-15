const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, categoryController, singlecategoryController, deleteCategoryController } = require('../controllers/categoryController');
const router = express.Router();

router.post('/create-category',createCategoryController)
router.put('/update-category/:id',updateCategoryController)
router.delete('/delete-category/:id',deleteCategoryController)
router.get('/get-category',categoryController)
router.get('/single-category/:slug',singlecategoryController)

module.exports = router;