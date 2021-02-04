var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db=require('../database/models');
/*
Ruta koja dostavlja korisniku stranicu na kojoj može da glasa za slike na osnovu šablona pictures.ejs*/ 
router.get('/',function(req,res,next){
    var user=req.cookies.email;  
    res.render('pictures',{user:user})
})

/*Kada korisnik posalje post zahtev biće mu dostavljene informacije o nekoj nasumičnoj slici iz baze podataka.
to se postiže tako se prvo prebroje sve slike koje nisu uploadovane od strane trenutno ulogovanog korisnika.
Dobijeni broj se zatim množi sa nekim nasumičnim brojem izmedju 0 i 1 tako dobijeni broj se uz pomoć f-je 
Math.flor zaokružuje na celobrojnu vrednost.Nakon toga se trazi slika u bazi sa tim da je preskočeni broj slika
jednak predhodno dobijenom broju.Nakon toga se podatci dostavljaju Jquery funkciji koja ih obradjuje 
i na osnovu njih korisniku prikazuje sliku
*/ 
router.post('/',function(req,res,next){
    var PicturesToSpin=db.Pictures;
    var user=req.cookies.email;
    PicturesToSpin.countDocuments({email:{ $ne: user }},function(err,count){   
        var random = Math.floor(Math.random()*count);
        PicturesToSpin.findOne({email:{ $ne: user }}).skip(random).exec(function(err,picture){
            console.log(picture);           
            res.send(picture);
        }) 
    })       
})
/*Ukoliko korisnik oceni sluku pozitivno post zahrev sa id-jem slike ce biti upućen ovoj ruti.
Nakon toga podatak o broju pozitivnih ocena biće uvećan za 1 i smešten u bazu podataka.
Ruta za negativne ocene je ista te neće biti komentarisana.
*/
router.post('/like',function(req,res,next){
    var PicturesLike=db.Pictures;
    console.log(req.body.id+" LIKE");
    var id =req.body.id;  
    PicturesLike.findById(id).exec(function(err,picture){
        picture.like++;
        picture.save();
        res.end("Like");
    })        
})

router.post('/dislike',function(req,res,next){
var PicturesLike=db.Pictures;
    var id =req.body.id;  
    PicturesLike.findById(id).exec(function(err,picture){
        console.log(picture);
        picture.dislike++;
        picture.save();
        res.end("Dislike");
    })
    
})

module.exports = router;
