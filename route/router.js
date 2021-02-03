const { json } = require('body-parser');
const express =require('express');
const route = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const fs = require('fs');
const conn = require("./connection/connect");
console.log("vvv" + conn);
var  txtWrite=[];







  route.get('/search', (req, res) => {
   
    const sql = "SELECT DISTINCT flyingFrom,flyingTo FROM `flights_list`";
    const sql1="SELECT * FROM `flights_list` ";
    const query = conn.query(sql, (err, data) => {
         conn.query(sql1, (err, data1) => {
        if (err) throw err;
        res.render('recherche', {
            from: data,
            list:data1
        });

    });
});
});

/*route.get('/vole', (req, res) => {
   
    let {from,to} = req.body;
       
    const sql = "SELECT * FROM flights_list ";
    const query = conn.query(sql, (err, data) => {
        if (err) throw err;
        res.render('voyages', {
            vol: data
        });

    })



     });
     */
    /* route.get('/vole', function(req, res) {

        var q = req.query.id;

        const sql = "SELECT * FROM escales WHERE id_fly=?";
        console.log("Searching for " +q);
        conn.query(sql, q, (err, data) => {
            if (err) throw err;
            res.render('voyages',{esc:data
            ,
        vol:[]});
        console.log("hhh" + JSON.stringify(data));
   });
   
});
*/
     route.get('/vole/:id/:flyingFrom/:flyingTo/:dapart_time', (req, res) => {
     let {id,flyingFrom,flyingTo,dapart_time} = req.params;
       console.log("id" + id);
     const sql = "SELECT * FROM escales WHERE id_fly=" + id;
   const  sql1 = "SELECT flights_list.* FROM flights_list  WHERE flyingFrom=? AND flyingTo=? AND seats>0  AND cast(dapart_time AS SIGNED)>=? ";
     conn.query(sql, (err, data) => {
       conn.query(sql1,[flyingFrom,flyingTo,dapart_time], (err, data1) => {
         if (err) throw err;
         res.render('voyages', {
             esc: data,
             vol:data1
         });
     });
 
     });
    });

     route.post('/vole', (req, res) => {
//"SELECT * FROM flights_list f,escales e WHERE flyingFrom=? AND flyingTo=? AND seats>0 AND departingDate=? AND cast(dapart_time AS SIGNED)>=? AND f.id=e.id_fly GROUP BY f.id ";
        let {from,to,departingDate,dapart_time} = req.body;
        var escale=[];
    const sql = "SELECT flights_list.* FROM flights_list  WHERE flyingFrom=? AND flyingTo=? AND seats>0 AND departingDate=? AND cast(dapart_time AS SIGNED)>=? ";
    const query = conn.query(sql,[from,to,departingDate,dapart_time], (err, data) => {
       // conn.query(sql,data.id, (err, data) => {
        if (err) throw err;
        res.render('voyages', {
            vol: data,
           esc:[]
        });
    
        
    });



     });



route.get("/reservation/:id/:price",function(req,resp){
var {price}=req.params;
var {id} = req.params;
    console.log("price " + price + " id " + id);
resp.render("reservation",{id:id,price:price});
});

route.post("/confirmation",function(req,resp){
    var {FullName,numeroTel,email,numeroPassport,departingDate,returningDate,Adult,children,travel_class,price,id_flight}=req.body;
  
var sql="INSERT INTO reservation( `FullName`, `numeroTel`, `email`, `numeroPassport`, `departingDate`, `returningDate`, `Adult`, `children`, `travel_class`, `price`, `id_flight`) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    const sql1 = "SELECT * FROM flights_list WHERE flights_list.id=?" ;

conn.query(sql,[FullName,numeroTel,email,numeroPassport,departingDate,returningDate,Adult,children,travel_class,price,parseInt(id_flight)],function(error,data){
    conn.query(sql1,parseInt(id_flight),function(error,data1){
    if (error) throw error;
    resp.render("confirmation",{
        name:FullName ,
        numeroTel: numeroTel,
        email:email, 
        numeroPassport:numeroPassport,
        Adult:Adult,
        children:children,
        travel_class:travel_class,
        price:price,
        id_flight:data1[0].id,
        flyingFrom: data1[0].flyingFrom,
        flyingTo:data1[0].flyingTo,
            });
    });
        var txtRow="[<<< WELCOME >>> \n Nom et prenom : "+FullName + "\n numero Telephone : " + numeroTel + " \n email :" + email + "\n numero Passport : " + numeroPassport + "\n departing Date :" + departingDate + " \n returning Date : " + returningDate + " \n Adult :" + Adult + "\n children : " + children + "\n travel_class : " + travel_class + "\n price : " + price + "\n ]";
      txtWrite.push(txtRow) ;  
  fs.writeFile('reservation.txt', JSON.stringify(txtWrite,null,5), (err) => { if (err) throw err;
        console.log("File Write")
        });

});
});
//Send Email 
route.post("/sendEmail",function(req,resp){
    var {fullName,numeroTel,Email,id_flight,flyingFrom,flyingTo,Adult,children,travel_class,Price}=req.body;
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abdilahelaidii@gmail.com',
          pass: 'dbkdkuofwtthkpsp'
        }
      });
     
    var mailOptions = {
        from: 'abdilahelaidii@gmail.com',
        to: Email,
        subject: 'Gestion Des Voles',
        text: "Bonjour Mr :" + fullName + " \n"
               + "Numero telephone : " + numeroTel + "\n"
               + "flying From : " + flyingFrom + "\n"
               + "flying To " + flyingTo + "\n" 
               + "Seats : => Adult : "+ Adult + " , Children : " + children  + "\n"
               + " travel_class : " + travel_class + "\n "
               +   "Price : " + Price + "DHs \n" 
               + "Email " + Email
    };
      
      mail.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          var sql="update flights_list set seats = flights_list.seats-(? + ?)  where flights_list.id = ?";

      conn.query(sql,[Adult,children,parseInt(id_flight)],function(err,data){
          if (error) throw error;
          console.log("Updating");
      });
          resp.redirect("/fin");
        }
      });
      
});

//
route.get("/fin",function(req,resp){
    resp.render("fin");
});

       // -------------------------------------------Dashboard-------------------------------



//   route.get('/', (req, res) => {
//  const sql = "SELECT produit_id,produit_name,prix,Quantité,Frs_name,Tel,Rayon_name FROM  ((produits INNER JOIN fournisseurs ON produits.Frs_id = fournisseurs.Frs_id) INNER JOIN rayons ON produits.Rayon_id = rayons.Rayon_id)";
//     const query = conn.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('dashboard', {
//             ALL: rows
//         });

//     })

// });




// // ------------------------------------- display all products-------------------------------


// route.get('/produc', (req, res, next) => {
//     const sql = "SELECT * FROM produits";
//     const query = conn.query(sql, (err, rows) => {
//         if (err) throw err;

          
//            res.json(rows);
       
         
//     })
// })







// route.get('/product', (req, res, next) => {
//     const sql = "SELECT * FROM produits";
//     const query = conn.query(sql, (err, rows) => {
//         if (err) throw err;


//         res.render('products', {
//             prods: rows
//         });
         
//     })
// })

//      // ------------------------------------- Caissier -------------------------------

//   route.get('/caisse', (req, res) => {
//      const sql = "SELECT * FROM produits";
//     const query = conn.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('caissier', {
//             prods: rows
//         });

//     })
// });
//     route.post('/caisse', (req, res) => {
     
//      console.log(req.body)
//      let proId = req.body.produit_id

//     let sql = "Update produits SET Quantité= Quantité -'" + req.body.Quantité + "' where produit_id =" + proId;
//     let query = conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.redirect('/caisse');
//     });

// });







// // --------------------------------------add products----------------------------------------
// route.get('/add', (req, res) => {
    

//     const sql = "SELECT * FROM fournisseurs";
//     const sqll = "SELECT * FROM rayons";
//     const query = conn.query(sql, (err, rows) => {
//     	const query = conn.query(sqll, (err, rows2) => {
//         if (err) throw err;
//         res.render('addPage', {
//             frs: rows,
//             ray: rows2,
//         });
//           });
//     })
      

// });

// route.post('/save', (req, res) => {
// 	console.log(req.body)

//      const a = parseInt(req.body.prix);  
//      const b = parseInt(req.body.Quantité);
//      const pr=a*b;
 
//     const data = {
//         produit_name: req.body.produit_name,
//         prix: pr,
//         Quantité: req.body.Quantité,
//         Frs_id:req.body.Frs_id,
//         Rayon_id:req.body.Rayon_id,

//     };
//     const sql = "INSERT INTO produits SET ?";
//     const query = conn.query(sql, data, (err, results) => {
//         if (err) throw err;
//         res.redirect('/product');
//     });
// });

// //--------------------------------------Edit products ------------------------------------
// route.get('/edit/:proId', (req, res) => {
//     const proId = req.params.proId;
//     let sql = `Select * from produits where produit_id = ${proId}`;
//     let query = conn.query(sql, (err, result) => {
//         if (err) throw err;
//         res.render('editPage', {
//             pro: result[0]
//         });
//     });
// });

// route.post('/update', (req, res) => {

//     let proId = req.body.produit_id

//     let sql = "Update produits SET  produit_name='" + req.body.produit_name + "', prix='" + req.body.prix + "', Quantité='" + req.body.Quantité + "' where produit_id =" + proId;
//     let query = conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.redirect('/product');
//     });
// });

// //-----------------------------------------------Delete products------------------------------------------
// route.get('/delete/:proId', (req, res) => {
//     const proId = req.params.proId;
//     let sql = `DELETE from produits where produit_id = ${proId}`;
//     let query = conn.query(sql, (err, result) => {
//         if (err)
//             throw err;
//         res.redirect('/product');
//     });
// });





// //-----------------------------------------------Display all rayons------------------------------------------



// route.get('/rayon', (req, res, next) => {
//     const sql = "SELECT * FROM rayons";
//     const query = conn.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('rayons', {
//             rys: rows
//         });

//     });
// });

// //-----------------------------------------------Add rayons------------------------------------------



// route.get('/addRayon', (req, res) => {
//         res.render('addRayon');
       
// });


// //-----------------------------------------------save rayons------------------------------------------

// route.post('/savery', (req, res) => {
//     console.log(req.body)
//     const data = {
//         Rayon_name: req.body.Rayon_name

//     };
//     const sql = "INSERT INTO rayons SET ?";
//     const query = conn.query(sql, data, (err, results) => {
//         if (err) throw err;
//         res.redirect('/rayon');
//     });
// });


// //--------------------------------------Edit products ------------------------------------
// route.get('/editry/:ryId', (req, res) => {
//     const ryId = req.params.ryId;
//     let sql = `Select * from rayons where Rayon_id = ${ryId}`;
//     let query = conn.query(sql, (err, result) => {
//         if (err) throw err;
//         res.render('editry', {
//             ry: result[0]
//         });
//     });
// });

// route.post('/updatery', (req, res) => {

//     let ryId = req.body.Rayon_id

//     let sql = "Update rayons SET  Rayon_name='" + req.body.Rayon_name  + "' where Rayon_id =" + ryId;
//     let query = conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.redirect('/rayon');
//     });
// });

// //-----------------------------------------------Delete products------------------------------------------
// route.get('/deletery/:ryId', (req, res) => {
//     const ryId = req.params.ryId;
//     let sql = `DELETE from rayons where Rayon_id = ${ryId}`;
//     let query = conn.query(sql, (err, result) => {
//         if (err)
//             throw err;
//         res.redirect('/rayon');
//     });
// });

















// //-----------------------------------------------Display all suppliers------------------------------------------




// route.get('/fournisseur', (req, res, next) => {
//     const sql = "SELECT * FROM fournisseurs";
//     const query = conn.query(sql, (err, rows) => {
//         if (err) throw err;
//         res.render('fournisseurs', {
//             frs: rows
//         });

//     });
// });

// //-----------------------------------------------  Add suppliers------------------------------------------

// route.get('/addFournisseur', (req, res) => {
//     res.render('addFournisseur');
   
// });
// route.post('/savefr', (req, res) => {

// const data = {
//     Frs_name: req.body.Frs_name,
//     Société: req.body.Société,
//     Address: req.body.Address,
//     Tel: req.body.Tel,
//     Email: req.body.Email

// };
// const sql = "INSERT INTO fournisseurs SET ?";
// const query = conn.query(sql, data, (err, results) => {
//     if (err) throw err;
//     res.redirect('/addFournisseur');
// });
// });




// //--------------------------------------Edit FRS ------------------------------------
// route.get('/editfr/:frId', (req, res) => {
//     const frId = req.params.frId;
//     let sql = `Select * from fournisseurs where Frs_id = ${frId}`;
//     let query = conn.query(sql, (err, result) => {
//         if (err) throw err;
//         res.render('editfr', {
//             fr: result[0]
//         });
//     });
// });

// route.post('/updatefr', (req, res) => {

//     let frId = req.body.Frs_id

//     let sql = "Update fournisseurs SET  Frs_name='" + req.body.Frs_name +"' , Société = '" + req.body.Société +"' , Address='" + req.body.Address + "', Tel='" + req.body.Tel + "', Email='" + req.body.Email + "'  where Frs_id ="+ frId;
//     let query = conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.redirect('/fournisseur');
//     });
// });

// //-----------------------------------------------Delete FRS------------------------------------------
// route.get('/deletery/:frId', (req, res) => {
//     const frId = req.params.frId;
//     let sql = `DELETE from fournisseurs where Frs_id = ${ryId}`;
//     let query = conn.query(sql, (err, result) => {
//         if (err)
//             throw err;
//         res.redirect('/fournisseur');
//     });
// });









































module.exports = route;
