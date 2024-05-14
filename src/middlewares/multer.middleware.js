import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname) // it is for sometime on server
    }
})

export const upload = multer({storage:storage})