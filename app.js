const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const app = express()
const {connectDB} = require('./util/connection')
const Task = require('./model/task')
const server = http.createServer(app)
const io = require('socket.io')(server);
const {createAdmin} = require('./service/createADMIN')

const userRoutes = require('./routes/userRoutes')
//const taskRoutes = require('./routes/taskRoutes')

app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the 'index.html' file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.json()) 
app.use(cors())
dotenv.config()

app.use('/api', userRoutes)
//app.use('/api/task', taskRoutes)

connectDB()

//to create admin manually
//createAdmin()




io.on('connection', (socket) => {
    console.log('A user connected');

    // gettiing all the task of user from database and will emit it from backend
    socket.on('fetch-tasks',(data)=>{
        const {userId, role} = data
        console.log(userId, role)
        if(role ==='user'){
            console.log('getting user tasks')
            Task.find({userId:userId}).then((tasks)=>{
                console.log(tasks)
                io.emit('user-tasks',tasks)
            }).catch(error=>{
                console.log('error in user tasks emit function', error)
            })
        }else{
            Task.find().then((tasks)=>{
                console.log(tasks)
                io.emit('admin-tasks',tasks)
            }).catch(error=>{
                console.log('error in admin tasks emit function', error)
            })
        }

    })



    // create task in database
    socket.on('create-task', (body) => {
        const { description, userId } = body;
        //console.log(description,userId)      
        Task.create({ description, userId })
        .then((newTask) => {       
            //console.log(newTask);
        }).catch((error) => {
            console.error('Error creating task:', error);
        });
    });

    socket.on('user-delete-task',(body)=>{
        const {_id} = body
        Task.findOneAndDelete({_id:_id})
        .then((result)=>{
            console.log('task deleted', result)
        }).catch((err)=>{
            console.log('error in deleting task', err)
        })        
    })

    socket.on('user-edit-task',(body)=>{
      console.log('lets update task in backend')
        const {updatedDescription, id}= body
        
            
            
            const filter = {_id: id}
            const update = {description : updatedDescription} 
            console.log(filter, update)
            Task.findOneAndUpdate(filter, update, {new: true})
            .then((result)=>{
                console.log('taskupdated', result)
            }).catch(err=>console.log('error in updating task', err))
        
    })

    socket.on('update-status',(body)=>{
        const {taskId} = body
         
         
        Task.findOneAndUpdate(
            { _id: taskId },
            { status: 'completed' },
            { new: true },
          ).then((result)=>{
            console.log('status updated of a task', result)

          }).catch(err=>console.log('err in updating status', err))
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });


});
  

server.listen(3000, () => {
    console.log('server connected to port 3000')
})
