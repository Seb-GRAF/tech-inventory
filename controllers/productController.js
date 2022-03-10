const Product = require('../models/product');
const Manufacturer = require('../models/manufacturer');
const Category = require('../models/category');
const async = require('async');
const { json } = require('express/lib/response');

// displays all products
exports.product_list = (req, res, next) => {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
      product: function (callback) {
        Product.find().exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // on success
      res.render('index', {
        title: 'Homepage',
        categories: results.categories,
        products: results.product,
      });
    }
  );
};

// displays details for one product
exports.product_detail = (req, res, next) => {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
      product: function (callback) {
        Product.findById(req.params.id).populate('category').exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // no results
      if (results.product == null) {
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      console.log(results.product);
      // on success
      res.render('./product/product_detail', {
        categories: results.categories,
        title: results.product.name,
        product: results.product,
      });
    }
  );
};

// displays form to create product on GET
exports.product_create_get = (req, res, next) => {
  res.send('Not implemented yet');
};

// handles create product on POST
exports.product_create_post = (req, res, next) => {
  res.send('Not implemented yet');
};

// displays form to delete product on GET
exports.product_delete_get = (req, res, next) => {
  res.send('Not implemented yet');
};

// handles delete product on POST
exports.product_delete_post = (req, res, next) => {
  res.send('Not implemented yet');
};

// displays form to update product on GET
exports.product_update_get = (req, res, next) => {
  res.send('Not implemented yet');
};

// handles update product on POST
exports.product_update_post = (req, res, next) => {
  res.send('Not implemented yet');
};
