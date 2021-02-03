const bodyParser = require('body-parser');
const express =require('express');
const route = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const conn = require('../connection/connect');
const { throws } = require('assert');

route.get("/admin",function(req,resp){
    const sql= "SELECT * FROM flights_list";
    conn.query(sql,function(err,data){
        if(err) throw err ;
        resp.render("Admin/home",{rows:data});
});
    });

    //Modifier
    route.get("/save/:id",function(req,resp){
        var id= req.params.id;
        console.log("id" + id);
        const sql= "SELECT * FROM flights_list WHERE id=?";
        conn.query(sql,id,function(err,data){
            if(err) throw err ;
            console.log("data" + JSON.stringify(data));
           resp.render("Admin/update",{
                id:data[0].id,
                flyingFrom:data[0].flyingFrom,
                flyingTo:data[0].flyingTo,
                departingDate:data[0].departingDate,
                returningDate:data[0].returningDate,
                seats:data[0].seats,
                Price:data[0].Price,
                depart_time:data[0].dapart_time,
                arrive_time:data[0].arrive_time
            });
    });
        });

        route.post("/modifier",function(req,resp){
            var {id,flyingFrom,flyingTo,seats,Price,depart_time,arrive_time}= req.body;
            const sql= "UPDATE flights_list SET flyingFrom=?,flyingTo=?,seats=?,Price=?,dapart_time=?,arrive_time=? WHERE id=?";
            conn.query(sql,[flyingFrom,flyingTo,seats,Price,depart_time,arrive_time,id],function(err,data){
                if(err) throw err ;
                resp.redirect("/admin");
        });
            });
//Supprimer
            route.get("/delete/:id",function(req,resp){
                var id= req.params.id;
             
                const sql= "DELETE FROM flights_list WHERE id=?";
                conn.query(sql,id,function(err,data){
                    if(err) throw err ;
                    
                   resp.redirect("/admin");
            });
                });
        
module.exports=route;