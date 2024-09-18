import mongoose from "mongoose";
const connectToMongo=async()=>
    {
        await mongoose.connect(process.env.MONGO_DB_URI)
        .then(()=>console.log("database connected"))
        .catch((err)=>console.log(err))
    }
export default connectToMongo