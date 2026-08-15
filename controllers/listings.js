const Listing = require("../models/listing") ; 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN  ; 
const geocodingClient = mbxGeocoding({accessToken: mapToken}) ; 

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({}) ; 
    res.render("listings/index.ejs",{allListings}) ; 
}  ; 


module.exports.renderNewForm = (req,res)=>{ 
res.render("listings/new.ejs") ;   
} ; 

module.exports.showListing= async(req,res)=>{
    let {id}=req.params ;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
    populate:{
        path:"author" , 
    },
    }) 
    .populate("owner"); 
    if(!listing){
        req.flash("error","Listing u requested does not exsit") ; 
        return res.redirect("/listings") ; 
    }
    console.log(listing) ; 
    res.render("listings/show.ejs",{listing}) ; 

} ; 


module.exports.createListing=async(req,res)=>{
    // let result = listingSchema.validate(req.body) ; 
    // console.log(result) ; 
    // if(result.error){
    //     throw new ExpressError(400,result.error) ; 
    // }
    // // if(!req.body.listing){
    // //     throw new ExpressError(400,"send valid data for listing") ; 
    // // }

    let response = await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location ,
    limit: 1
})
  .send()
//   console.log(response.body.features) ; 
//   console.log(response.body.features[0].geometry) ; 
//   res.send("done") ; 
  

    let url = req.file.path ; 
    let filename = req.file.filename ; 
    console.log(url,"..",filename)
    const newListing= new Listing(req.body.listing) ; 
    // // if(!newListing.title){
    // //     throw new ExpressError(400,"Title is missing") ; 
    // // }
   
    // // if(!newListing.description){
    // //     throw new ExpressError(400,"Description is missing!") ; 
    // // }
    // // if(!newListing.location){
    // //     throw new ExpressError(400,"location is missing!") ; 
    // // }
    
    newListing.owner = req.user._id ; 
    newListing.image = {url,filename} ;  

    newListing.geometry = response.body.features[0].geometry
    let savedListing = await newListing.save() ; 
    console.log(savedListing) ; 
        // 👈 Ye bhi add karo
        req.flash("success","New Listing created") ; 
    res.redirect("/listings");  
    //  console.log(req.body);      
    // res.send(req.body);   
   
} ;

module.exports.renderEditForm = async(req,res)=>{
    
    let {id}=req.params ;
    const listing =await Listing.findById(id) ; 
    if(!listing){
        req.flash("error","Listing u requested does not exsit") ; 
        return res.redirect("/listings") ; 
    }

    let originalImageUrl = listing.image.url ; 
    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/w_250"
    );   
    res.render("listings/edit.ejs",{listing,originalImageUrl}) ;
} ; 


module.exports.updateListing =async(req,res)=>{
    let {id}=req.params ;
    // req.body.listing.image = {
    //     url: req.body.listing.image,
    //     filename: "",
    // };
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path ; 
    let filename = req.file.filename ; 
    listing.image = {url,filename} ; 
    await listing.save() ;  

    }
    
    req.flash("success","Listing Updated!") ; 
    res.redirect(`/listings/${id}`) ; 
} ; 

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params ; 
    let deleteedListing = await Listing.findByIdAndDelete(id) ; 
    console.log(deleteedListing) ; 
    req.flash("success","Listing deleted successfully") ; 
    res.redirect("/listings") ; 
} ; 