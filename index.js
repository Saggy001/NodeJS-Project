require("dotenv").config();
const express = require('express');
const cors = require('cors');

const authRouter = require("./api/auth/auth.routes");
const userRouter = require("./api/users/users.routes");
const demoRouter = require("./api/demo/demo.router");

const app = express();
app.use(express.static('images'));
app.use(express.json());
app.use(cors());
// app.options('*', cors());
// app.use(bodyParser.json({limit: '10mb', extended: true}));
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use("/api/auth" , authRouter);

app.use("/api/demo", demoRouter);

app.use("/api/users" , userRouter);
  
app.get('/',(req,res)=>{
    res.send("Have a nice day");
});

const PORT = process.env.PORT;
app.listen(PORT, ()=> console.log("listening to port ", PORT));