import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
})

connectDB()

/*
import express from "express"
const app = express()

// add semi-column
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("connected to db")
        app.on("error", (error)=>{
            console.log("error", error)
            throw error
        })
        app.listen(process.env.PORT, ()=> {
            console.log("server is running on port", process.env.PORT)

        })
    } catch (error) {
        console.log("ERROR", error);
        throw error
    }
})()

*/