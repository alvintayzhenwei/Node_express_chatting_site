const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

//Databased
const mongoose = require('mongoose')
const dbUrl = 'mongodb+srv://alvin:alvin@cluster0.mzmrj.mongodb.net/chatDB'
mongoose.Promise = Promise
mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    console.log('mongo DB connected')
})

var messageCollection = mongoose.model('Message',{
    name:String,
    message:String
})


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://alvin:alvin@cluster0.mzmrj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// var messages = [
//     {name:'Alvin', message: 'Hi'},
//     {name:'Viki', message: 'Hello'}
// ]

app.get('/messages',(req,res)=>{
    messageCollection.find({},(err,messages)=>{
        res.send(messages)
    })
})

app.get('/messages/:user',(req,res)=>{
    var user = req.params.user
    messageCollection.find({name: user},(err,messages)=>{
        res.send(messages)
    })
})

app.post('/messages',async (req,res)=>{

    try{
        //throw 'Some bug'
        var msgC = new messageCollection(req.body)
    
        var savedMessage = await msgC.save()
        console.log('Saved')
        var censored = await messageCollection.findOne({message: 'fuck'})
        
        if(censored)
            await messageCollection.deleteOne({_id:censored.id})
        else
            io.emit('message',req.body)
        
        res.sendStatus(200)
    } catch(err){
        res.sendStatus(500)
        return console.error(err)
    } finally {
        //logger.log('message post called')
        console.log('message post called')
    }
  
    
    // PREMISE resolved nested call back issues.
    // msgC.save()
    // .then(()=>{
    //     console.log('Saved')
    //     return messageCollection.findOne({message: 'fuck'})
    // })
    // .then((censored)=>{
    //     if(censored){
    //         console.log('censored word found',censored)
    //         return messageCollection.deleteOne({_id:censored.id})
    //     }
    //     io.emit('message',req.body)
    //     res.sendStatus(200)
    // })
    // .catch((err)=>{
    //     req.sendStatus(500)
    //     return console.error(err)
    // })

    //Sample code of post first remove later of the censored word (Nested callback)
    // messageCollection.findOne({message: 'fuck'},(err,censored)=>{
    //     if(censored){
    //         console.log('censored word found',censored)
    //         messageCollection.remove({_id:censored.id},(err)=>{
    //             console.log('removed censored message')
    //         })
    //     }
    // })  
    //messages.push(req.body)        
    // io.emit('message',req.body)
    // res.sendStatus(200)
})




io.on('connection',(socket) => {
    console.log('a user connected')
}) 

var server = http.listen(8080,()=>{
    console.log('Server hosting on port:',server.address().port)
})




