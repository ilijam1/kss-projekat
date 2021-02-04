var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db=require('../database/models');
var message;


/* 
Ruta koja korisniku dostavlja formu za prijavu
*/
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/*
Kada korisnik posalje formu za prijavljivanje,njen sadrza se ispituje i uporedjuje sa 
podatcima koji se nalaze u bazi podataka.Ukoliko korisnik postoji i njegova sifra se poklapa 
sa šifrom iz baze podataka korisnik će biti preusmeren na profilnu stranicu i bice mu dodeljeni potrebni kolačići.
Ukoliko je doslo do greške korisnik će biti vraćena login stranica.Dobra je praksa da se podatci iz forme pre pretrage baze
provere sto ovde nije slučaj ali je zbog lakšeg testiranja taj korak jednostavno preskočen.
*/

router.post('/',function(req,res,next){  
  User=db.Users;  
  password=req.body.password;
  email=req.body.email;
  console.log(password);  
 User.findOne({
        email: email
      }).then(user => { 
        console.log(user)       
        if (!user) {         
          res.render('login',{message:'Go to register page'})         
        }
        if (password == user.password)
          {
            console.log('Uspesan login');
            res.cookie('username',user.username);
            res.cookie('email',user.email);
            res.cookie('logined',true);
            res.redirect('/profile');      
          }
        else {
          res.render('login',{message:'Password error'})  
        }
      });
})

module.exports = router;