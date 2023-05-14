
const express = require("express");
const {randomBytes} = require("crypto");
const amqp = require("amqplib");
const {config} = require("dotenv");
config();
const PORT = process.env.PORT || 4003;

const app = express();
const cors = require("cors")

app.use(express.json());
app.use(cors())

var channel, connection;
connectQueue()  // call the connect function
 
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
        channel.consume("test-queue", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}




const commentsByPostId = {};

//  create a new comment associated with the given post 
app.post("/new/:postId", (req,res) =>{
    const {content} = req.body;
    const postId = req.params.postId;

    const commentId = randomBytes(4).toString("hex");
    let comments = commentsByPostId[postId] || [];

    comments.push({
        id: commentId,
        content
    })


    commentsByPostId[postId] = comments

    res.status(200).send(commentsByPostId[postId]);
})


// retrieve all comments assocaited with the given post
app.get("/comment-list/:postId", (req,res) =>{
    const postId = req.params.postId;
    res.send(commentsByPostId[postId] || [])
})


app.listen(PORT, () =>{
    console.log(`Comment service is running on ${PORT}`)
})






