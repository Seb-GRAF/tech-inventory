const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

// handles create category on POST
exports.category_add_post = [
  body('category', 'Category name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    console.log('hello?');
    const errors = validationResult(req);

    let category = new Category({ name: req.body.category });

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
          category.save(function (err) {
            if (err) return next(err);
            console.log('after err (after category.save)');
            res.redirect('/categories');
          });
        }
      });
    }
  },
];

// displays form to delete category on GET
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      console.log(results.category);
      if (err) return next(err);

      // No results
      if (results.category == null) res.redirect('/categories');

      // On success
      res.render('./category/category_delete', {
        title: 'Delete Product',
        category: results.category,
        categories: results.categories,
      });
    }
  );
};

// handles delete category on POST
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
      category_products: function (callback) {
        Product.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // Category has products (isn't empty)
      if (results.category_products.length > 0)
        res.render('./category/category_delete', {
          title: 'Delete Category',
          categories: results.categories,
          category: results.category,
          category_products: results.category_products,
        });
      // On success
      else
        Category.findByIdAndRemove(
          req.body.categoryid,
          function deleteCategory(err) {
            if (err) return next(err);
            res.redirect('/categories');
          }
        );
    }
  );
};

// displays form to update category on GET
exports.category_update_get = (req, res, next) => {
  async.parallel(
    {
      category_products: function (callback) {
        Product.find({ category: req.params.id }).exec(callback);
      },
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // Product no found
      if (results.category == null) {
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      // On success

      res.render('./category/category_update', {
        title: 'Edit Category',
        categories: results.categories,
        category: results.category,
        category_products: results.category_products,
      });
    }
  );
};

// handles update category on POST
exports.category_update_post = [
  // validate and sanitize fields.
  body('category', 'Please fill in the category name')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation
  (req, res, next) => {
    // Extracts the validation errors
    const errors = validationResult(req);

    // Create a category with escape/trimmed data and old id.
    let category = new Category({
      name: req.body.category,

      // id param so it doesn't create a new ID
      _id: req.params.id,
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

          // on success
          res.render('./category/category_update', {
            title: 'Update category',
            categories: results.categories,
            category,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid -> update category
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, cat) {
          if (err) return next(err);
          res.redirect(cat.url);
        }
      );
    }
  },
];

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
