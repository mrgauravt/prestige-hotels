var express      = require("express");
var router       = express.Router();
var Hotel        = require("../models/hotel");
var middleware   = require("../middleware");

//INDEX - Show all Hotels
router.get("/", function(request, response){
     // Get all hotels from DB
    Hotel.find({}, function(error, hotels){
        if(error){
            console.log(error);
        } else {
            response.render("hotels/hotel_list", { hotel_list: hotels, page: 'hotel' });
        }
    });
    /*response.render("hotel_list", { hotel_list: hotel_list });*/
});

//CREATE - add new hotel to DB
router.post("/", middleware.isLoggedIn, function(request, response){
    // get data from form and add to hotel's array
    var name        = request.body.name;
    var image       = request.body.image;
    var cost        = request.body.cost;
    var description = request.body.description;
    var author = {
        id: request.user._id,
        username: request.user.username
    }
    var newHotel = { name: name, image: image, cost: cost, description: description, author:author};
    // Create a new hotel and save to DB
    Hotel.create(newHotel, function(error, newlyAddedHotel){
        if(error){
            console.log(error);
        } else {
            //redirect back to hotel_list page
            response.redirect("/hotel_list");
        }
    });
    
   /* hotel_list.push(newHotel);*/
});

//NEW - show form to create new hotel info
router.get("/new", middleware.isLoggedIn, function(request, response) {
    response.render("hotels/new");
});

// SHOW - shows more info about one hotel
router.get("/:id", function(request, response) {
     //find the hotel with provided ID
    Hotel.findById(request.params.id).populate("comments").exec(function(error, foundHotel){
        if (error || !foundHotel) {
            request.flash("error", "Hotel not found");
            response.redirect("back");
        } else {
            //console.log(foundHotel);
            //render show template with that hotel
            response.render("hotels/show", { hotel: foundHotel});
        }
    });
});

// EDIT HOTEL ROUTE
router.get("/:id/edit", middleware.checkHotelOwnership, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            console.log(err);
        }
        res.render("hotels/edit", {hotel: foundHotel});
    });
});

// UPDATE HOTEL ROUTE
router.put("/:id", middleware.checkHotelOwnership, function(req, res){
    // find and update the correct hotel info
    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedHotel){
       if(err){
           res.redirect("/hotel_list");
       } else {
           //redirect somewhere(show page)
           res.redirect("/hotel_list/" + req.params.id);
       }
    });
});

// DESTROY HOTEL ROUTE
router.delete("/:id",middleware.checkHotelOwnership, function(req, res){
   Hotel.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/hotel_list");
      } else {
          res.redirect("/hotel_list");
      }
   });
});

module.exports = router;