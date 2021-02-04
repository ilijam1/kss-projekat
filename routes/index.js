var express = require('express');
var router = express.Router();

/*Ruta koja korisniku dostavlja početnu stranicu */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.render('index', { title: 'ImageSpin' });
  
});

module.exports = router;
