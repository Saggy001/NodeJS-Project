const url = require('url');
const Joi = require('joi');
const { getAllRow, getCountRow, getRow, deleteRow, deleteFile, createRow, updateRow } = require('./users.service');
const { countEmail } = require('../auth/auth.service');
const { genSaltSync } = require('bcrypt');
const { hashSync } = require('bcrypt');

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    createUser,
    updateUser
};

function updateUser(req, res){
    let id = req.params.id? req.params.id : req.myID;
    console.log(id);
    getRow(id, (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database connection error"
            });
        }
        if(!result){
            return res.status(400).json({
                message : "User not found"
            });
        }

        const schema = Joi.object({
            name : Joi.string().min(3).max(25),
            email: Joi.string().email({ tlds: { allow: false } }),
            age : Joi.number().min(0).max(150),
            dob: Joi.date()
        });
        const r = schema.validate(req.body);
        if(r.error){
            return res.status(400).json({
                message : r.error.details[0].message
            });
        }

        const body = req.body;
        console.log(body);
        if(!body.name) body.name = result.name;
        if(!body.age) body.age = result.age;
        if(!body.email)body.email = result.email;
        if(!body.dob) body.dob = result.dob;
        let iimage = result.image;

        if(req.file && req.file.filename) {
            if(iimage) deleteFile('./images/'+ iimage)
            iimage = req.file.filename;
        }  

        updateRow(body, iimage, id, (err, ans)=>{
            if(err){
                return res.status(500).json({
                    message : "Internal Server Error"
                });
            }
            return res.json({
                message : "Profile Updated Successfully"
                });
        })
    });
}


function createUser(req, res){
    const schema = Joi.object({
        name : Joi.string().min(3).max(25).required(),
        email: Joi.string().email({ tlds: { allow: false } }),
        age : Joi.number().min(0).max(150),
        password : Joi.string().min(8).required(),
        dob: Joi.date()
    });

    const result = schema.validate(req.body);

    if(result.error){
        return res.status(400).json({
            message : result.error.details[0].message
        });
    }

    countEmail(req.body.email, (error, result)=>{
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
        if(!body.age) body.age = null;
        if(!body.dob) body.dob = null;
        const filename = (req.file && req.file.filename) ? req.file.filename : null;

        const salt = genSaltSync(10);
        body.password = hashSync(body.password , salt);
        createRow(body, filename, (e, r)=>{
            if(e){
                return res.status(500).json({
                    message : "Internal Server Error"
                });
            }
            return res.json({
                message: "User created "
            })
        });
    });
}

function deleteUser(req, res){
    getRow(req.params.id , (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database connection error"
            });
        }
        if(!result.length){
            return res.status(400).json({
                message : "User not found"
            });
        }
        deleteRow(req.params.id, (err, r)=>{
            if(err){
                return res.status(500).json({
                    message : "Database connection error"
                });
            }
            if(result[0].image)deleteFile('./images/'+ result[0].image);
            return res.json({
                message : "User deleted successfully"
            });
        });
    });
}

function getUser(req , res){
    getRow(req.params.id , (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database connection error"
            });
        }
        if(!result){
            return res.status(400).json({
                message : "User not exist"
            });
        }
        return res.json({
            data : result
        });
    });
}

function getUsers(req, res){
    const q = url.parse(req.url, true).query;
    const sortBy = q.sortBy ? q.sortBy : "id";
    const sortDir = q.sortDir ? q.sortDir : "Desc";
    const page = q.page ?  q.page : 1;
    const search = q.search ? q.search : "";
    const limit = (page-1) * 5;

    getAllRow(sortBy, sortDir, limit, search, (error, result)=>{
        if(error){
            return res.status(500).json({
                message : "Database connection error"
            });
        }
        getCountRow(search , (err, r)=>{
            if(err){
                return res.status(500).json({
                    message : "Database connection error"
                });
            }
            return res.json({
                count : r,
                data : result
            });
        });
    });
}
