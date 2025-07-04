const express = require("express")
const makeConnection = require("./DBconnection")
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "16kb" })); // maximum size of 16kb is accepted
app.use(express.urlencoded({extended: true})); // extended: true for accepting nested objects
app.use(express.static("images")); 

app.get('/', (req, res) => {
    res.send('Hello ji..')
})

makeConnection()

// Route imports
const UserRoute = require("./routes/userRoutes")
const AuthRoute = require("./routes/authRoutes")
const BlogRoute = require("./routes/blogRoutes")

// Route includes
app.use("/user", UserRoute)
app.use("/auth", AuthRoute)
app.use("/blog", BlogRoute)

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})