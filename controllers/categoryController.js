const Product = require('../models/product');
const Manufacturer = require('../models/manufacturer');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

// handles create category on POST
exports.category_list = [
  body('category', 'Category name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let category = new Category({ name: req.body.category });
    console.log(req);

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: function (callback) {
            Category.find().sort({ name: 'ascending' }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);

          // on success
          res.render('./category/category_list', {
            title: 'All categories',
            categories: results.categories,
            products: results.product,
          });
        }
      );
      return;
    } else {
      Category.findOne({ name: req.body.category }).exec(function (
        err,
        found_category
      ) {
        if (err) return next(err);

        if (found_category) res.redirect(found_category.url);
        else {
          // Category.save((err) => {
          //   if (err) return next(err);
          //   res.redirect(category.url);
          // });
        }
      });
    }
  },
];

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

// displays all products for one category
exports.category_products = (req, res, next) => {
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
      res.render('./category/category_products', {
        title: results.category.name,
        categories: results.categories,
        category: results.category,
        category_products: results.category_products,
      });
    }
  );
};

// displays all categories
exports.category_list = (req, res, next) => {
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
      res.render('./category/category_list', {
        title: 'All categories',
        categories: results.categories,
        products: results.product,
      });
    }
  );
};
