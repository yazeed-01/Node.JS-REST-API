const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Books = require('./books');

const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    bio:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is in valid')
            }
        },
        trim: true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

authorSchema.virtual('books',{
    ref:'Books',
    localField:'_id',
    foreignField:'owner'
})

authorSchema.methods.toJSON = function () {
    const author = this.toObject()
    delete author.password
    delete author.tokens
    return author;
}
authorSchema.methods.generateAuthToken = async function () {
    const author = this
    const token = await jwt.sign({ _id: author._id.toString() }, 'thisismynewcourse')
    author.tokens = author.tokens.concat({ token });
    await author.save();
    return token;
}
authorSchema.statics.findByCredentials = async (email, password) => {
    try {
        const author = await Authors.findOne({ email })
        if (!author)
            throw new Error()
        const isMatch = await bcrypt.compare(password, author.password)
        if (!isMatch)
            throw new Error()
        return author;
    } catch (e) {
        return "Unable to login"
    }
}
authorSchema.pre('save', async function (next) {
    const author = this
    if (author.isModified('password')) {
        author.password = await bcrypt.hash(author.password, 8);
    }
    next();
})

authorSchema.pre('remove',async function(next){
    const author = this
    await Books.remove({owner:author._id})
    next();
})
const Authors =  mongoose.model('Authors',authorSchema)

module.exports = Authors