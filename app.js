const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
mongoose.connect("mongodb://localhost:27027/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const itemsSchema = {
    name: String
}
const Item = mongoose.model('Item', itemsSchema)
const item1 = new Item({
    name: "Buy milk"
})
const item2 = new Item({
    name: "Tidy up"
})
const item3 = new Item({
    name: "Feed the pets"
})
const defaultItems = [item1, item2, item3]
Item.insertMany(defaultItems, (err)=>{
    if (err){
        console.error(err)
    }
})
app.get('/', (req, res) => {
    var today = new Date()
   /* var weekday=new Array(7);
    weekday[0]="Monday";
    weekday[1]="Tuesday";
    weekday[2]="Wednesday";
    weekday[3]="Thursday";
    weekday[4]="Friday";
    weekday[5]="Saturday";
    weekday[6]="Sunday";*/
    var currentDay = today.getDay().toLocaleString('en-us', {weekday: "long"});
    Item.find({}, function(err, items){
        if (!err){
    res.render("list", {currentDay: currentDay, newItems: items})
        }else{
            console,log(err)
        
    }
})
})

app.post('/', (req, res)=>{
    const newItem = req.body.newItem;
    Item.insertMany(newItem, (err)=>{
        if(err){
            console.log(err)
        }
    })
})
app.listen(3000, function(){
    console.log("Server is running on port 3000")
})

process.on('SIGTERM', ()=>{
    app.close()
})