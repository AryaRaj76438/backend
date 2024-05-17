import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"


dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
    app.on("error", (error)=>{
        console.log("Error: ", error);
    })
})
.catch((err)=>{
    console.log("MONOGDB connection failed!!", err);
})


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