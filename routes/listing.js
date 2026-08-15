const express = require("express") ; 
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
  
const Listing = require("../models/listing.js") ; 
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js") ;
const listingController = require("../controllers/listings.js") ; 
const { createListing } = require("../controllers/listings.js");
const { updateListing } = require("../controllers/listings.js");
const multer  = require('multer')  ; 

const {storage} = require("../cloudConfig.js") ;   
// const upload = multer({ dest: 'uploads/' })
 const upload = multer({ storage })
// const validateListing = (req,res,next) =>{
//     let {error} = listingSchema.validate(req.body) ; 
  
//     if(error){
//       let errMsg = error.details.map((el)=> el.message).join(",")  ; 
//       throw new ExpressError(400,errMsg) ; 
//     }else{
//       next() ; 
//     }
// }

//index route  
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
    
    
    
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm) ; 

router.route("/:id")
    //Show  Route  
    .get(wrapAsync(listingController.showListing) )  
    //update route 
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing) )
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));






//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)) ;
//update route 

// router.put("/:id", (req, res, next) => {
//     console.log(req.body);
//     next();
// }, validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;

//     req.body.listing.image = {
//         url: req.body.listing.image,
//         filename: "",
//     };

//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//     req.flash("success", "Listing updated successfully");
//     res.redirect(`/listings/${id}`);
// }));





module.exports = router ; 
