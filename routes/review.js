const express = require("express") ; 
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js") ; 

const Review = require("../models/review.js") ; 
const Listing = require("../models/listing.js") ;  
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js") ; 

const reviewController = require("../controllers/review.js") ; 

// const validateReview = (req,res,next) =>{
//     let {error} = reviewSchema.validate(req.body) ; 
  
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",")  ; 
//         throw new ExpressError(400,errMsg) ; 
//     }else{
//         next() ; 
//     }
// } ; 
//Reviews
//post review route
// router.post("/",validateReview,wrapAsync(async(req,res)=>{
 
//     let listing = await Listing.findById(req.params.id)  
//     let newReview = new Review(req.body.review) ;   
//     listing.reviews.push(newReview) ; 
//     await newReview.save() ; 
//     await listing.save(); 
//     console.log("new review saved") ; 
//     // res.send("new review saved") ; 
//     res.redirect(`/listings/${listing._id}`)
// })
// );
//post review route 
router.post("/", validateReview, isLoggedIn,wrapAsync(reviewController.createReview));

// Delete review  route 
router.delete("/:reviewId",isReviewAuthor,isLoggedIn,
    wrapAsync(reviewController.destroyReview) 
);
   
module.exports = router ; 