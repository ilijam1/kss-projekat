var express = require('express');
var router = express.Router();
var multer  = require('multer')
var mongoose = require('mongoose');
var db=require('../database/models');
var fs = require('fs');
var path = require('path');
/*Filter za multer upload.Ovim filterom ogranicavamo tip fajlova koji je moguce uploadovati na nas server.
U ovom slucaju to su slike.
*/ 
const fileFilter = (req, file, cb) => {
    if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
  }
};
/*Podesavanja za multer.
Filename je funkcija koja nam odredjuje pod kojim imenom ce smestiti fajl nakon upload-a.
Destinacija snimljenih fajlova je /public/images gde se nalaze sve slike i one su dostupne svima.
*/
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    var extension;
    if(file.mimetype==="image/png"){
      extension='.png'
    }
    if(file.mimetype==="image/jpg"){
      extension='.jpg'
    }
    if(file.mimetype==="image/jpeg"){
      extension='.jpeg'
    }
    var User=req.cookies.username;
    pictureName=User+Date.now()+extension;    
    cb(null, pictureName);
  },
  destination: function (req, file, cb) {
    cb(null, './public/images')
  
},
})

/*Nakon sto smo podesili sve parametre i filter potrebno generisati multer objekat sa zadatim parametrima koji ce se kasnije koristiti za upload*/
var upload = multer({ storage: storage,fileFilter})
/*Ruta koja korisniku dostavlja stranicu sa profilom.Ovde se na osnovu kolacica
iz baze podataka citaju slike korisnika sa njihovim podatcima.Zbog jednostavnijeg koda
broj slika je ogranicen na 10.*/
router.get('/',function(req,res,next){
  Picture=db.Pictures; 
  var email=req.cookies.email;
  Picture.find({email:email}).limit(10).then(pictures=>{
    username=req.cookies.username;
    res.render('profile',{title:'profile',user:username,userImg:pictures});
  })            
})

/*Ruta koja dostavlja korisniku stranicu na kojoj moze da doda nove fotografije*/
router.get('/upload', function(req, res, next) {
  username=req.cookies.username;
  res.render('upload', { title: 'Express' ,user:username});  
});

/*Ruta za uploadovanje slika.Preko forme slika se putem post zahteva salje serveru koji je snima u za to predvidjen folder.
Nakon sto slika bude snimljena na disk potrebno je generisati podatke koji se smestaju u bazu podataka.Da bi dobili link do slike
potrebno je preuzeti put to slike i iz njega izbrisati prvih 6 karaktera a nakon toga sve  zameniti \ sa /.
Nakon toga imamo sve potrebne podatke i sliku mozemo smestiti u bazu
 */
router.post('/upload', upload.single('avatar'), function (req, res, next) {
  //console.log(req.file.path.substr(6));
  Picture=db.Pictures;
  var email=req.cookies.email;
  link=req.file.path.substr(6).replace(/\\/g, "/")
    var newPicture=new Picture(
    {
      email:email,
      imageLink:link
    }
  );
  newPicture.save();
  res.redirect('/profile');
})
//Ruta za brisanje slika
router.post('/delete',function(req,res,next){
  console.log(req.body.id);
  Picture=db.Pictures;
  Picture.findByIdAndRemove(req.body.id, function(err,data){
    console.log(data.imageLink)
    fs.unlink("public/"+data.imageLink, function(err){
      if(err){console.log(err)};
    })
  })
  res.end('Deleted');
})

/*Za login sistem koriste se kolacici koje je potrebno obrisati to radimo u sledecoj ruti*/
router.get('/logout',function(req,res,next){
  res.clearCookie('email');
  res.clearCookie('logined');
  res.clearCookie('username');
  res.redirect('/');
})
module.exports = router;