var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db=require('../database/models');
/*Ruta koja korisniku dostavlja stranicu na kojoj se nalazi forma za registraciju*/
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/*Kada korisnik posalje formu za registraciju njen sadržaj se proverava u ovoj ruti.
Prvo se proverava da li korisnik postoji.Ukoliko postoji biće mu prikazana stranica za registraciju.
Ukoliko to nije slučaj njegov nalog će biti kreiran i smešten u bazu podataka nakon čega korisnik biva 
usmeren na stranicu za prijavu*/
router.post('/',(req,res,next)=>{
    form=req.body;
    User=db.Users;
  User.exists({email:form.Email}).then(user=>{
    console.log(user);
    if(user)
    {
      //Ukoliko korisnik postoji
      console.log("User exist");
    }
    else
    {
      //Ukoliko korisnik ne postoji
      newUser=new User({
      username:form.Username,
      password:form.Password,
      email:form.Email,
    })
      newUser.save()
    }
})
    res.redirect('/login')
})

module.exports = router;