var db = require('../model/dao.js').db;
var _ = require( 'underscore' );
var Handlebars = require( "handlebars");
/*
 * GET vehicles listing.
 */

exports.list = function(req, res){
  db.view( 'vehicles/all', function(err, doc ) {
    if ( err ) {
      console.log('error retreiving view' + err);
      //res.send( 500, err );
      res.render('vehicle', {vehicles: null});
    } else {
      var vehicles = _.pluck(doc, 'value');
      res.render('vehicle', {vehicles: vehicles});
    }
  });
};

exports.edit = function (req, res) {
    var vehicleID = req.param('id');
    console.log('Edit request for: ' + vehicleID);
    db.view( 'vehicles/byVin', { key: vehicleID }, function(err, doc ) {
    if ( err ) {
      console.log('error retreiving view' + err);
      res.send( 500, err );
    } else {
      var vehicles = _.pluck(doc, 'value');
      console.log(vehicles);
      res.send(vehicles);
    }
  });
};

exports.add = function(req, res){
   //console.log(req.body);
   var data = _.extend( {type: 'vehicle'}, req.body)
   db.save(data, function (err, res) {
         if(err) console.log('DB error saving user - ' + err);
   	});
   res.redirect('/vehicle');
 //  res.render('vehicle', {vehicles: vehicles});
};

/* dummy database
var vehicles = [
    {make: 'Audi', model: 'A4', year: '2006', vin: 'AFWRF312'},
    {make: 'VW', model: 'CC', year: '2011', vin: 'AFWRF313'}];
*/