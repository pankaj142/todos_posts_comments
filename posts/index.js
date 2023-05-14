const express = require("express");
const {randomBytes} = require("crypto")
const amqp = require("amqplib");
const {config} = require("dotenv");
config();
const PORT = process.env.PORT || 4002;

const app = express();
app.use(express.json());

connectQueue();
// rabbitMQ 
let channel, connection;
async function connectQueue(){
    try{
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
    }catch(error){
        console.log(error)
    }
}

async function sendData (data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    // await channel.close();
    // await connection.close(); 
}

const posts = {

}

// get all posts
app.get('/post-list', (req, res)=>{
    console.log("ddddddddddd")
    res.send(posts)
})

// get a single post by id
app.get('/:id', (req, res)=>{
    console.log("ggggg")
    const id = req.params.id;
    res.status(200).send(posts[id]);
})

// create a post 
app.post('/new', (req, res)=>{
    console.log("ffff", req.body)
    const id = randomBytes(4).toString("hex");
    const {text} = req.body;
    posts[id] = {
        id, text
    }

     // data to be send to rabbitMQ
     const data = {
        title  : "Six of Crows",
        author : "Leigh Burdugo"
    }
    sendData(data);  // pass the data to the function we defined


    res.status(200).send(posts[id]);
})

app.listen(PORT, ()=>{
    console.log(`POST service is running on ${PORT}`)
})

