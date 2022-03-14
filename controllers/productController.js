const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

// multer file storage
const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/uploads');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '--' + file.originalname.replace(/\s+/g, '-'));
  },
});
const upload = multer({ storage: fileStorageEngine });

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
  upload.single('image'),
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
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a product object with escaped and trimmed data
    let product = new Product({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      link: req.body.link,
      image: req.file !== undefined ? req.file.filename : '',
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
  async.parallel(
    {
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
      product: function (callback) {
        Product.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // No results
      if (results.product == null) res.redirect('/');

      // On success
      res.render('./product/product_delete', {
        title: 'Delete Product',
        product: results.product,
        categories: results.categories,
      });
    }
  );
};

// handles delete product on POST
exports.product_delete_post = (req, res, next) => {
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.body.productid).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // On success
      Product.findByIdAndRemove(
        req.body.productid,
        function deleteProduct(err) {
          if (err) return next(err);
          res.redirect('/');
        }
      );
    }
  );
};

// displays form to update product on GET
exports.product_update_get = (req, res, next) => {
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id).populate('category').exec(callback);
      },
      categories: function (callback) {
        Category.find().sort({ name: 'ascending' }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      // Product no found
      if (results.product == null) {
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      // On success

      res.render('./product/product_form', {
        title: 'Edit product',
        categories: results.categories,
        product: results.product,
      });
    }
  );
};

// handles update product on POST
exports.product_update_post = [
  // Convert the category to an array
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  // validate and sanitize fields.
  body('name', 'Please fill in the product name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('manufacturer', 'Please add the name of the manufacturer')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category.*').escape(),
  // Process request after validation
  (req, res, next) => {
    // Extracts the validation errors
    const errors = validationResult(req);

    // Create a product with escape/trimmed data and old id.
    let product = new Product({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      link: req.body.link,

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

          // Mark selected categories as checked.
          for (let i = 0; i < results.categories.length; i++) {
            if (product.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = 'true';
              console.log(results.categories[1].checked);
            }
          }
          // on success
          res.render('./product/product_form', {
            title: 'Update product',
            categories: results.categories,
            product,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid -> update product
      Product.findByIdAndUpdate(
        req.params.id,
        product,
        {},
        function (err, prod) {
          if (err) return next(err);
          res.redirect(prod.url);
        }
      );
    }
  },
];
