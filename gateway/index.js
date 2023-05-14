
const gateway = require("fast-gateway");
const {config} = require("dotenv");
config();
const PORT = process.env.PORT || 4000;

const server = gateway({
    routes :[
        {
            prefix : "/user",
            target : "http://localhost:4001/",
            hooks : {}
        },
        {
            prefix : "/posts",
            target : "http://localhost:4002/",
            hooks : {}
        },
        {
            prefix : "/comments",
            target : "http://localhost:4003/",
            hooks : {}
        }
    ],
})

server.get("/gateway", (req,res)=>{
    res.send(`API Gateway is called`)
})

server.start(PORT).then(server=>{
    console.log(`API Gateway is running on ${PORT}`)
})