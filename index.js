const express = require('express')
const app = express()
const Mongoose = require('mongoose')
const FriendsModel = require('./models/Friends')
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())

Mongoose.connect('mongodb+srv://basicMern:basicMern@basicmern.neahq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
)


app.post('/addFriend', async (req, res) => {
    const name = req.body.name
    const age = req.body.age

    const friend = new FriendsModel({ name: name, age: age })
    await friend.save()
    res.send(friend)
})

app.get('/read', (req, res)=>{
    FriendsModel.find({},(err, result) => {
        if (err) {
            console.log(err);;
        }
        else {
            res.send(result)
        }
    })
})

app.put('/update', async (req,res) => {
    const newAge = req.body.newAge
    const id = req.body.id

    try {
        await FriendsModel.findById(id, (error, update) => {
            update.age = Number(newAge)
            update.save()
        })
    } catch(err) {
        console.log(err);
    }

    res.send('Updated')
})

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    await FriendsModel.findByIdAndRemove(id).exec()
    res.send('item deleted')
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(process.env.PORT || 3001, ()=>{
    console.log('connected');
})