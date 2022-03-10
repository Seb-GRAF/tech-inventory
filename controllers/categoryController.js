const Product = require('../models/product');
const Manufacturer = require('../models/manufacturer');
const Category = require('../models/category');
const async = require('async');

// displays details for one category
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },

      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_products: function (callback) {
        Product.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // no results
      if (results.category == null) {
        let err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }

      // success
      res.render('./category/category_detail', {
        title: results.category.name,
        categories: results.categories,
        category: results.category,
        category_products: results.category_products,
      });
    }
  );
};

// displays form to create category on GET
exports.category_create_get = (req, res, next) => {
  res.send('Not implemented yet');
};

// handles create category on POST
exports.category_create_post = (req, res, next) => {
  res.send('Not implemented yet');
};

// displays form to delete category on GET
exports.category_delete_get = (req, res, next) => {
  res.send('Not implemented yet');
};

// handles delete category on POST
exports.category_delete_post = (req, res, next) => {
  res.send('Not implemented yet');
};

// displays form to update category on GET
exports.category_update_get = (req, res, next) => {
  res.send('Not implemented yet');
};

// handles update category on POST
exports.category_update_post = (req, res, next) => {
  res.send('Not implemented yet');
};
