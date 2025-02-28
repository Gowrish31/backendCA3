const express = require("express")
const app = express()
app.use(express.json())

const jwt = require("jsonwebtoken")
const SECRETkey = "ASD6544bbybu%%%^%GUgnh"

const users = [
    {username:"admin", password:"admin123",role:"admin"},
    {username:"user", password:"user123",role:"user"},
]

app.post("/login",(req,res)=>{
    const {username,password} = req.body;
    const user = users.find(u=>u.username === username && u.password === password)
    if(!user){
        return res.status(401).json({message:"user invalid credential"})
    }
    const token = jwt.sign(
        {username:user.username},
        SECRETkey,
        {expiresIn:"15m"}
    )
    res.json({token})
})

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if(!authHeader) {
        return res.status(401).json({error:"Unauthorized"})
    }
    const token = authHeader.split(" ")[1]
    jwt.verify(token,SECRETkey,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:"error has occured"})
        }
        res.send({decoded})
        next();
    })
}

app.get("/protected",verifyToken,(req,res)=>{
    return res.json({message:`Welcome ${req.user.username}`})

})
app.get("/admin-dashboard",verifyToken,(req,res)=>{
    if(req.user.role!="admin"){
        return res.status(403).json({error:"Forbidden"})
    }
    return res.json({message:"Welcome to dashboard"})
    
})

app.listen(3000,()=>{
    console.log("server is running on port: http://localhost:3000")
})