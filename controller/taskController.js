const Task = require('../model/task')

const createTask = async(req,res) =>{
    try{
        const {description} = req.body
        console.log(description)

        if (!description || description.length === 0) {
            return res.status(400).json({ message: 'empty description' });
        }
    
        await Task.create({
            description: description,
            userId: req.user._id
        })
    
        return res.status(201).json({ message: 'Task created' });
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Issue in creating new Task' });
    }
}

const userTask = async(req,res)=>{

}

module.exports = {createTask}