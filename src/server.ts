import express from 'express'

//Initialize express app
const app = express();
const PORT = 3000

//Middlewares
app.use(express.json()); //for parsing application/json
app.use(express.urlencoded({extended: true})); //for parsing application/x-www-form-urlencoded

//Routes
app.get('/', (req,res) => {
    res.send('Hello world1')
})


//Start the server 

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} 🔥🚀`)
})