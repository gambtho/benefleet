var cradle = require('cradle');

/*
interesting stuff on views & map/reduce at
http://keyholesoftware.com/2012/12/10/node-application-server-with-couchdb/
*/

if ( process.env.CLOUDANT_URL ) {
    var db = new(cradle.Connection)(process.env.CLOUDANT_URL, 80).database('benefleet');
} else {
    db = new(cradle.Connection)('localhost', 5984).database('benefleet');
}

db.exists(function (err, exists) {
if(err) {
console.log('db error', err);
} else if (exists) {
//console.log('db exists');
} else {
console.log('Creating new database');
db.create();
}
});

db.save('_design/vehicles', {
	views: {
    	all: {
      		map: function (doc) {
        		if (doc.type === 'vehicle') {
          			emit(null, doc);
        		}
      		}
    	},
    	byVin: {
      		map: function (doc) {
        		if (doc.type === 'vehicle') {
          			emit(doc.vin, doc);
        		}
      		}
    	}
	}
});

exports.db = db;