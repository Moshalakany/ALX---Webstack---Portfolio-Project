import mongoose from "mongoose";
const userschema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            trim:true , 
        },
        username:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        gender:{
            type:String,
            required:true,
            enum:["male","female"],
        },
        profilepic:
        {
            type:String,
            default:"",
        },
        lastOnline: 
        {
            type: Date, default: Date.now 
        }

    },
    {timestamps:true}
)
    const user =mongoose.model("User",userschema);
    export default user;