const con = require("../../database");

module.exports = {
    create,
    countEmail,
    getUserByEmail,
    getUserById,
    getUsers, 
    countToken,
    setToken,
    updatePassword,
    checkTokenExist
};

function checkTokenExist(token, callback){
    con.query(
        `select count(*) as count from users where token = ?`,
        token,
        (error, result, field)=>{
            if(error)return callback(error);
            return callback(null, result[0].count);
        }

    )
}

function updatePassword(password, token, callback){
    con.query(
        `update users set password = ?, token = ? where token  = ?`,
        [password,null, token],
        (error, result, field)=>{
            return error? callback(error): callback(null , result);
        }
    )
}

function setToken(email, token, callback){
    con.query(
        `update users set token = ? where email = ?`,
        [token , email],
        (error, result, field)=>{
            return error? callback(error): callback(null , result);
        }
    )
}

async function countToken(token){
    con.query(
        `select count(*) as count from users where token = ?`,
        token,
        (error, result, field)=>{
            return error? 2 : result[0].count;
        }
    )
}

function countEmail(email, callback){
    con.query(
        `select count(*) as count from users where email = ?`,
        email,
        (error, result, field)=>{
            if(error) return callback(error);
            return callback(null, result[0].count);
        }
    )
}

function getUserById(id, callback){
    con.query(
        `select id, name, email, age, image, dob from users where id = ?`,
        id,
        (error, result, field)=>{
            if(error)return callback(error);
            return callback(null, result[0]);
        }
    )
}

function getUserByEmail(email, callback){
    con.query(
        `select id, name, email, password from users where email = ?`,
        email,
        (error, result, field)=>{
            if(error)return callback(error);
            return callback(null, result[0]);
        }
    )
}

function create(data , callback){
    con.query(
        `insert into users(name, password, email)
        values(?,?,?)`,
        [ data.name, data.password, data.email] , 
        (error, result, fields)=>{
            return error ? callback(error): callback(null, result);
        }
    );
}

function getUsers(callback){
    con.query(
        `select name, email, password from users`,
        (error, result, field)=>{
            return error? callback(error) : callback(null, result);
        }
    )
} 