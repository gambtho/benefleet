
/*
 * GET vehicles listing.
 */

exports.list = function(req, res){
  console.log(vehicles);
  console.log(vehicles[0].make);
  res.render('vehicle', {vehicles: vehicles});
};

exports.edit = function (req, res) {
  res.send("Pretend you can see the vehicle details here");
};

exports.add = function(req, res){
   vehicles.push(req.body);
   res.render('vehicle', {vehicles: vehicles});
};

// dummy database
var vehicles = [
    {make: 'Audi', model: 'A4', year: '2006', vin: 'AFWRF312'},
    {make: 'VW', model: 'CC', year: '2011', vin: 'AFWRF313'}];