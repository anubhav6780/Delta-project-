const mongoose = require("mongoose") ; 
const { listingSchema } = require("../schema");
const schema = mongoose.Schema ; 
const Review = require("./review.js") ; 
const { ref } = require("joi");

const listingschema = new schema({
    title:{
        type:String ,
        required : true ,
    },
    description: String,
    // image:{
    //     type : String ,
    //      default: "C:/Users/anubh/OneDrive/Documents/Desktop/MAJORPROJECT/Screenshot 2026-06-22 091407.png",
    //     set:(v)=>
    //         v ===""?"C:\Users\anubh\OneDrive\Documents\Desktop\MAJORPROJECT\Screenshot 2026-06-22 091407.png"  : v ,
    //     },
    image:{
    url: String,     
    filename: String,
    
},

        price: Number,
        location: String ,
        country : String ,
        reviews:[
            {
                type:schema.Types.ObjectId , 
                ref:"Review" , 
            },  
           ],
            owner:{
                type:schema.Types.ObjectId,
                ref: "User",
            },
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }        
        
}) ; 
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}}) ;
    }
     

}) ; 
const Listing = mongoose.model("Listing",listingschema) ; 
module.exports=Listing ;     