
/* Dependencies */
var mongoose = require('mongoose'),
    Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message.
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);


  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;

  /** TODO **/
  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  listing.code = req.body.code;
  listing.name = req.body.name;
  listing.address = req.body.address;
  Listing.update({code: listing.code}, { $set: {code:req.body.code, name: req.body.name, address: req.body.address}},
  function(err) {
    if(err) {
      res.status(404).send(err);
    }

    listing.save(function(err) {
      if(err) {
        res.status(404).send(err);
      }
    });
  });

  res.json(listing);
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

  /** TODO **/
  /* Remove the article */
  Listing.find({code: listing.code}, function(err, doc) {
    if(err) {
      res.status(404).send(err);
    }
    if(doc.length > 0) {
      console.log('\nDocument with code="'+listing.code+'":\n'+doc);
      console.log('\nRemoving document with code="'+listing.code+'"...');
      Listing.deleteOne({code: listing.code},function(err) {
        if(err) {
          res.status(404).send(err);
        }
        res.json(listing);
        console.log('\nDocument with code="'+listing.code+'" was successfully removed.');
      });
    }
    else {
      res.json(listing);
      console.log('\nDocument with code="'+listing.code+'" has already been removed.');
    }
  });
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /** TODO **/
  /* Your code here */
  Listing.find({}, function(err, doc) {
    if(err) {
      res.status(404).send(err);
    }
    console.log('\nAll listings in the database have been retrieved.');
    res.json(doc);
  }).sort({code: 'ascending'});
};

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.

  Find the listing using a mongoose query,
        bind it to the request object as the property 'listing',
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(404).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};
