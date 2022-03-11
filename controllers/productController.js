const Product = require('../models/product');
const Manufacturer = require('../models/manufacturer');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

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
  async.parallel(
    {
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      // on success
      res.render('./product/product_form', {
        title: 'Add a product',
        categories: results.categories,
      });
    }
  );
};

// handles create product on POST
exports.product_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // validate and sanitize fields
  body('name', 'Please fill in the product name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('manufacturer', 'Please add the name of the manufacturer')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category.*').escape(),

  // process request after validation and sanitization
  (req, res, next) => {
    console.log(req.body.category);
    // Extract the validation errors from a request
    const errors = validationResult(req);
    console.log(errors);
    // Create a product object with escaped and trimmed data
    let product = new Product({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      link: req.body.link,
    });

    // If there are errors -> render form again with sanitized values
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: function (callback) {
            Category.find().sort({ name: 'ascending' }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);

          // Mark selected categories as checked.
          for (let i = 0; i < results.categories.length; i++) {
            if (product.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = 'true';
              console.log(results.categories[1].checked);
            }
          }
          // on success
          res.render('./product/product_form', {
            title: 'Add a product',
            categories: results.categories,
            product,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid -> save product
      product.save(function (err) {
        if (err) return next(err);

        res.redirect(product.url);
      });
    }
  },
];

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
