var express = require('express');
var router = express.Router();

// controller modules
const product_controller = require('../controllers/productController');
const manufacturer_controller = require('../controllers/manufacturerController');
const category_controller = require('../controllers/categoryController');

// GET home page
router.get('/', (req, res) => {
  res.redirect('/products');
});

/// PRODUCT ROUTES ///

// GET all products list
router.get('/products', product_controller.product_list);

// GET request for one product
router.get('/product/:id', product_controller.product_detail);

// GET request for creating product
router.get('/product/create', product_controller.product_create_get);

// POST request for creating product
router.get('/product/create', product_controller.product_create_post);

// GET request for deleting product
router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request for deleting product
router.get('/product/:id/delete', product_controller.product_delete_post);

// GET request for updating product
router.get('/product/:id/update', product_controller.product_update_get);

// POST request for updating product
router.get('/product/:id/update', product_controller.product_update_post);

/// CATEGORY ROUTES ///

// GET request for one category
router.get('/category/:id', category_controller.category_detail);

// GET request for creating category
router.get('/category/create', category_controller.category_create_get);

// POST request for creating category
router.get('/category/create', category_controller.category_create_post);

// GET request for deleting category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request for deleting category
router.get('/category/:id/delete', category_controller.category_delete_post);

// GET request for updating category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request for updating category
router.get('/category/:id/update', category_controller.category_update_post);

module.exports = router;
