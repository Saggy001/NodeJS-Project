const con = require("../../database");
const fs = require('fs');

module.exports = {
    getCountRow,
    getAllRow,
    getRow, 
    deleteRow,
    deleteFile,
    createRow,
    updateRow
};

function updateRow(data, filename, id, callback){
    con.query(
        `update users set name = ? , email = ?
        , age = ?, dob = ?, image = ? where id = ?`,
        [
            data.name,
            data.email,
            data.age,
            data.dob,
            filename,
            id
        ],
        (error, result, field)=>{
            if(error)return callback(error);
            return callback(null, result);
        }
    )
}

function createRow(data, filename, callback){
    con.query(
        `insert into users(name, email, age, image, dob, password)
        values(?,?,?,?,?,?)`,
        [
            data.name,
            data.email,
            data.age,
            filename,
            data.dob,
            data.password
        ] , 
        (error, result, fields)=>{
            if(error){
               return callback(error);
            }
            return callback(null, result);
        }
    );
}

function deleteFile(filePath){
    fs.unlinkSync(filePath);
}

function deleteRow(id, callback){
    con.query(
        'delete from users where id = ?',
        id,
        (error, result, field)=>{
            if(error) return callback(error);
            return callback(null, result);
        }
    );
}

function getRow(id, callback){
    con.query(
        `select id, name, email, image, age, dob from users where id = ?`,
        id,
        (error, result, field)=>{
            if(error) return callback(error);
            return callback(null, result[0]);
        });
}

function getCountRow(search , callback){
    con.query(
    `select count(*) as count from users 
            where name like '%${search}%' or email like '%${search}%' 
            or id like '%${search}%' or age like '%${search}%' `,
            (error, result , field)=>{
                if(error) return callback(error);
                return callback(null, result[0].count);
            });
}

function getAllRow(sortBy , sortDir, limit, search, callback){
    con.query(
        `Select id, name, email, age, image, dob from users 
    where name like '%${search}%' or email like '%${search}%' 
    or id like '%${search}%' or age like '%${search}%' 
    order by ${sortBy}  ${sortDir} limit ${limit} , 5;`,
    (error , result , field)=>{
        if(error) return callback(error); 
        return callback(null, result);
    });
}