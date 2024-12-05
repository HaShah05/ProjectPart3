var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// telling my router that I have this model
let Tournament = require('../model/tournament.js');
const tournament = require('../model/tournament.js');
let indexController = require('../controllers/index.js');


/* Get route for the book list - Read Operation */
/*
GET,
Post,
Put --> Edit/Update
*/
/* Read Operation --> Get route for displaying the books list */


function requireAuth(req,res,next)
{   console.log('Authentication check:', req.isAuthenticated());
    if(!req.isAuthenticated()){
      return res.redirect('/login');
    }

    console.log('User is authenticated');
    next();
}

router.get('/',async(req,res,next)=>{
try{
    const TournamentList = await Tournament.find();
    res.render('Tournament/list',{
        title:'Tournament List',
        TournamentList:TournamentList,
        isLoggedIn: !!req.user,
        displayName: req.user ? req.user.displayName : ''
    })}
    catch(err){
        console.error(err);
        res.render('Tournament/list',{
            error:'Error on the server',
            isLoggedIn: !!req.user,
            displayName: req.user ? req.user.displayName : ''
        })
    }
    });
/* Create Operation --> Get route for displaying me the Add Page */
router.get('/add',requireAuth, async(req,res,next)=>{
    console.log('Add tournament page requested');
    try{
        res.render('Tournament/add',{
            title: 'Add Tournament'
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Tournament/list',{
            error:'Error on the server'
        })
    }
});
/* Create Operation --> Post route for processing the Add Page */
router.post('/add',requireAuth,async(req,res,next)=>{
    try{
        let newTournament = Tournament({
            "Date":req.body.Date,
            "Name":req.body.Name,
            "Location":req.body.Location,
            "Description":req.body.Description,
        });
        Tournament.create(newTournament).then(()=>{
            res.redirect('/tournamentslist');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Tournament/list',{
            error:'Error on the server'
        })
    }
});
/* Update Operation --> Get route for displaying me the Edit Page */
router.get('/edit/:id',requireAuth, async(req,res,next)=>{
    try{
        const id = req.params.id;
        const tournamentToEdit= await Tournament.findById(id);
        res.render('Tournament/edit',
            {
                title:'Edit Tournament',
                Tournament:tournamentToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); // passing the error
    }
});
/* Update Operation --> Post route for processing the Edit Page */ 
router.post('/edit/:id',requireAuth, async(req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedTournament = Tournament({
            "_id":id,
            "Date":req.body.Date,
            "Name":req.body.Name,
            "Location":req.body.Location,
            "Description":req.body.Description,
        });
        Tournament.findByIdAndUpdate(id,updatedTournament).then(()=>{
            res.redirect('/tournamentslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Tournament/list',{
            error:'Error on the server'
        })
    }
});
/* Delete Operation --> Get route to perform Delete Operation */
router.get('/delete/:id',requireAuth, async(req,res,next)=>{
    try{
        let id=req.params.id;
        Tournament.deleteOne({_id:id}).then(()=>{
            res.redirect('/tournamentslist')
        })
    }
    catch(error){
        console.error(err);
        res.render('Tournament/list',{
            error:'Error on the server'
        })
    }
});
module.exports = router;