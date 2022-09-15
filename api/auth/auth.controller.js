const { hashSync, genSaltSync, compareSync} = require("bcrypt");
const { sign } = require("jsonwebtoken");
const Joi = require('joi');
const Async = require('async');
const nodeMailer = require('nodemailer');
const { create, countEmail, getUserByEmail, getUserById, getUsers, countToken, setToken, updatePassword, checkTokenExist } = require("./auth.service");

module.exports = {
    createUser,
    checkEmailExistance,
    loginUser,
    getAllUsers,
    forget,
    checkValidToken,
    resetPassword, 
    myCredentials,
    logout
};

function logout(req, res){
    let token = req.get("Authorization");
    token = token.slice(7);

    
}

function myCredentials(req, res){
    getUserById(req.myID, (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Internal Server Error"
            });
        }
        if(!result){
            return res.status(400).json({
                message: "Session Expired"
            });
        }
        return res.json({
            data : result
        })
    });
}


function resetPassword(req, res){
    const schema = Joi.object({
        password : Joi.string().min(8).required()
    });

    const results = schema.validate(req.body);

    if(results.error){
        return res.status(400).json({
            message : results.error.details[0].message
        });
    }

    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password , salt);
    updatePassword(body.password , req.params.token, (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Internal Server Error"
            });
        }
        
        return res.json({
            message: "password updated successfully"
        })
    });
}

function checkValidToken(req, res){
    checkTokenExist(req.params.token, (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Internal Server Error"
            });
        }
        if(result == 1){
            return res.json({
                result: true
            })
        }
        return res.status(400).json({
            message: "Invalid token"+req.params.token
        });
    });
}

async function forget(req, res){
    //check email validity
    getUserByEmail(req.params.email,(error, results)=>{
        if(error){
            return res.status(500).json({
                message : "Internal Server Error"
            });
        }
        if(!results){
            return res.status(400).json({
                message : "Invalid email"
            }); 
        }
        //generate unique token
        generateToken(results).then(
            function(token){
                console.log(token);
                setToken(req.params.email, token, (err, resu)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({
                            message : "Internal Server Error"
                        });
                    }
                    let link = "http://localhost:4200/reset/"+token;
        
                    let body = `hello1 ${results.name},<br>
                    click the below <a target="_blank" href="${link}">link</a> to reset your password.`;
        
                    let transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: process.env.NODEMAILER_PORT,
                        auth: {
                            user: process.env.MY_EMAIL,
                            pass: process.env.MY_PASS
                        }
                    });
            
                    let mailOptions = {
                        from: process.env.MY_EMAIL,
                        to: req.params.email, 
                        subject: "Reset Password",
                        html: body, 
                    };
        
                    transporter.sendMail(mailOptions, (erro, info) => {
                        if (erro){
                            console.log(erro);
                            return res.status(500).json({message : "Internal Server Error"});
                        }
                    });
                    return res.json({message: "Email sent successfully"});
                });
            }
        );
    });
}

async function generateToken(results){
    const token = sign({result : results}, process.env.ENC_KEY ,{
        expiresIn : "1h"
    });
    const result = await countToken(token);
    return !result ? token : await generateToken(results);
}



function loginUser(req, res){
    const body = req.body;
    getUserByEmail(body.email, (error, results)=>{
        if(error){
            return res.status(500).json({
                message : "Database Connectivity Error"
            });
        }
        if(!results){
            return res.status(400).json({
                message : "Invalid Credentials"
            });
        }
        const result = compareSync(body.password , results.password); 
        if(result){
            results.password = undefined;
            const jsontoken = sign({result : results}, process.env.HASH_KEY ,{
                expiresIn : "2h"
            });
            return res.json({
                message : "login Successfully",
                token: jsontoken
            })
        }
        return res.status(400).json({
            message : "Invalid Credentials"
        })
    });
}

function createUser(req, res){
    const schema = Joi.object({
        name : Joi.string().min(3).max(25).required(),
        email: Joi.string().required().email({ tlds: { allow: false } }),
        password : Joi.string().min(8).required()
    });

    const results = schema.validate(req.body);

    if(results.error){
        return res.status(400).json({
            message : results.error.details[0].message
        });
    }

    countEmail(req.body.email , (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database Connectivity Error"
            });
        }
        if(result != 0){
            return res.status(400).json({
                message : "Email is already in use"
            }); 
        }
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password , salt);
        create(body , (err, r)=>{
            if(err){
                return res.status(500).json({
                    message : "Database Connectivity Error"
                });
            }
            return res.json({
                message : "User created successfully"
            });
        })
    });
}


function checkEmailExistance(req, res){
    countEmail(req.params.email , (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database Connectivity Error"
            });
        }
        return res.json({
            data : result ? true : false
        });
    });
}

function getAllUsers(req, res){
    getUsers((error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database Connectivity Error"
            });
        }
        return res.json({data : result});
    })
}