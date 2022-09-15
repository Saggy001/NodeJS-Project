const { getUsers, getUser, deleteUser, createUser, updateUser, updateUserWithId} = require('./users.controller');
const multer = require('multer');
const path = require('path');
const { checkToken } = require('../auth/token.validation');
const router = require('express').Router();

const storage = multer.diskStorage({
    destination: (req , file, cb) =>{
        cb(null, 'images');
    },
    filename: (req , file , cb)=>{
        cb(null , Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage})

router.get('/' ,checkToken, getUsers);

router.get('/:id',checkToken, getUser);

router.delete('/:id',checkToken, deleteUser);

router.post('/', checkToken, upload.single("image"), createUser);

router.put('/' ,checkToken, upload.single("image"), updateUser);

router.put('/:id' ,checkToken, upload.single("image"), updateUser);


module.exports = router;