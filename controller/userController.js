const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signUp = async (req,res)=>{
  const name=req.body.name;
  const email=req.body.email;
  const password=req.body.password;
  console.log(req.body)

  if (!password) {
    return res.status(400).send({ message: "Password is required" });
  }
  if (!name) {
    return res.status(400).send({ message: "Name is required" });
  }
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }
  try {
    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }
    const hash = bcrypt.hashSync(password, 10);
     await User.create({
      name: name,
      email: email,
      password: hash,
      role:'user'
    });

    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
};

const generateAccessToken=(id, name, role)=>{
    return jwt.sign({userId: id, name:name, role:role},process.env.JWT_SECRET)
  }

const login = async(req,res) =>{
    const {email, password} = req.body
    console.log(req.body)
    try{
        User.findOne({ email: email } )
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).send({ alert: "Server error" })
          } else if (result) {
           // console.log('success')
            return res.status(200).send({message: "welcome", token: generateAccessToken(user._id, user.name, user.role),
            userId:user._id, role: user.role
          });            
          } else {
            res.status(401).send({ alert: "Invalid password" })
          }
        })
      } else {
        res.status(404).send({ alert: "User does not exist" })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ alert: "Server error" })
    }) 

    }catch(error){
       console.log(error)
       res.status(500).send({ message: "Server error" });
    }
}

module.exports = {signUp, login}