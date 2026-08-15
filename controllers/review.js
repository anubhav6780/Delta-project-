const Listing = require("../models/listing") ; 
const Review = require("../models/review") ; 

module.exports.createReview =async (req, res) => {
    console.log("params:", req.params);
    console.log("originalUrl:", req.originalUrl);
    console.log("body:", req.body);

    let listing = await Listing.findById(req.params.id);
    console.log("listing:", listing);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id ; 
    console.log(newReview) ; 
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
};  


module.exports.destroyReview =async(req,res)=>{
    let{id,reviewId} = req.params ; 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) ; 
    await Review.findByIdAndDelete(reviewId) ; 
    req.flash("success","Review Deleted") ; 
    res.redirect(`/listings/${id}`) ; 
}