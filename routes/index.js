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

// GET request for creating product
router.get('/product/create', product_controller.product_create_get);

// POST request for creating product
router.post('/product/create', product_controller.product_create_post);

// GET request for deleting product
router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request for deleting product
router.post('/product/:id/delete', product_controller.product_delete_post);

// GET request for updating product
router.get('/product/:id/update', product_controller.product_update_get);

// POST request for updating product
router.get('/product/:id/update', product_controller.product_update_post);

// GET all products list
router.get('/products', product_controller.product_list);

// GET request for one product
router.get('/product/:id', product_controller.product_detail);

/// CATEGORY ROUTES ///

// POST request for creating category
router.post('/categories', category_controller.category_list);

// GET request for deleting category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request for deleting category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request for updating category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request for updating category
router.post('/category/:id/update', category_controller.category_update_post);

// GET all categories list
router.get('/categories', category_controller.category_list);

// GET request for one category
router.get('/category/:id', category_controller.category_products);

module.exports = router;
