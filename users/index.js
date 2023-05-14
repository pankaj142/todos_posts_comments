const express = require("express");
const {randomBytes} = require("crypto")
const {config} = require("dotenv");
config();
const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.json());

const users = {}

// login
app.post('/login', (req, res)=>{
    const {email, password, id} = req.body;
    res.send(users[id] || "user not exist")
})

// signup
app.post('/signup', (req, res)=>{
    const id = randomBytes(4).toString("hex");
    const {firstName, lastName, email, password} = req.body;
    
    const user = {
        id, firstName, lastName, email, password
    }
    users[id] = user;
    res.status(200).send(users);
})

app.listen(PORT, ()=>{
    console.log(`USERS service is running on ${PORT}`)
})

