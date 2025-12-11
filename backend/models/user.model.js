import mongoose from "mongoose";
const userschema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            trim:true , 
        },
        email:{
            type:String,
            required:false,
            sparse: true,
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
        friends:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            }
        ],
        lastOnline: 
        {
            type: Date, default: Date.now 
        }

    },
    {timestamps:true}
)

// Create sparse unique index for email - only indexes documents where email exists
userschema.index({ email: 1 }, { unique: true, sparse: true });

    const user =mongoose.model("User",userschema);
    export default user;