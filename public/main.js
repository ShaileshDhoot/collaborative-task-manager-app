const socket = io();


socket.on('connect', () => {
    console.log('Connected to the server via Socket.io');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role')
    console.log(userId, role)
    
    // an emit event which will get the task of that particular userId from data base
    socket.emit('fetch-tasks', {userId,role});

    // listening from backend
   if(role ==='user'){
    socket.on('user-tasks', (newTaskData) => {
      // hadnle the task of that particualr user
        console.log(newTaskData)
        newTaskData.forEach((task)=>{
          handleNewTaskLocally(task)
        })       
      
    })
   }else{
    socket.on('admin-tasks', (newTaskData) => {
      // hadnle the task of that particualr user
        console.log(newTaskData)
        newTaskData.forEach((task)=>{
          handleNewTaskLocally(task)
        })       
      
    })
   }
})




// creating new task in front end

document.getElementById('add-task').addEventListener('click', (e) => {
    
  e.preventDefault()

    const description = document.getElementById('description').value;

    // Emit a Socket.io event to create a new task
    socket.emit('create-task', {
      description,
      userId: localStorage.getItem('userId'), // Replace with your logic to get user ID
    })
    
    description = ''
})

// updating the task in frontend and in backend

document.getElementById('update-task').addEventListener('click',(e)=>{
  e.preventDefault()
  let desc =  document.getElementById('description').value.trim()
  const taskIdToEdit = localStorage.getItem('taskIdToEdit')
  const taskItem = document.getElementById(taskIdToEdit);
  const descriptionSpan = taskItem.querySelector('span'); // Find the <span> inside the list item

  // Update the text content of the <span> with the new description
  descriptionSpan.textContent = desc

  editTask(desc)

 
  desc = ''; // Clear the input field
  localStorage.removeItem('taskIdToEdit');


})

// function to delete task 

function deleteTask(taskId){

  // delete task event sent to backend
  socket.emit('user-delete-task',{_id: taskId})
}

// function to edit task
function editTask( newDescription){
  const taskIdToEdit = localStorage.getItem('taskIdToEdit')

  // edit task event sent to backend
  socket.emit('user-edit-task',{
    updatedDescription: newDescription,
    id:taskIdToEdit
  })

  const addTaskButton = document.getElementById('add-task')
  const updateTaskButton = document.getElementById('update-task');
  updateTaskButton.style.display = 'none';
  addTaskButton.style.display = 'block';
}


// function to handle newly created task locally in dom


function handleNewTaskLocally(newTaskData) {

  const taskList = document.getElementById('list');

  if(newTaskData.status ==='completed'){

    const taskItem = document.createElement('li');
    taskItem.id = newTaskData._id
    taskItem.classList.add('list-group-item d-flex justify-content-between align-items-center')
    // Create a span element to display the task description
    const descriptionSpan = document.createElement('span');
    descriptionSpan.classList.add('task-description')
    descriptionSpan.textContent = `${newTaskData.description} Task status:${newTaskData.status}`;



    taskItem.appendChild(descriptionSpan)

    taskList.appendChild(taskItem)

  }else{
      // Create a new list item for the task
      const taskItem = document.createElement('li');
      taskItem.id = newTaskData._id
      taskItem.classList.add('list-group-item d-flex justify-content-between align-items-center')
      // Create a span element to display the task description
      const descriptionSpan = document.createElement('span');
      descriptionSpan.classList.add('task-description')
      descriptionSpan.textContent = newTaskData.description;
    
      // Create edit and delete buttons
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      //editButton.classList = 'editBtn'
      editButton.classList.add('btn', 'btn-primary', 'editBtn');

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      //deleteButton.classList = 'deleteBtn'
      deleteButton.classList.add('btn', 'btn-danger', 'deleteBtn')
    
    
      const addTaskButton = document.getElementById('add-task')
      const updateTaskButton = document.getElementById('update-task');
    
      // event handle on edit button on click
    
      editButton.addEventListener('click', (e) => {
        e.preventDefault()
        const descriptionInput = document.getElementById('description');
        updateTaskButton.style.display = 'block';
        addTaskButton.style.display = 'none';
        localStorage.setItem('taskIdToEdit', newTaskData._id)
    
        
        // Repopulate the input field with the existing task description
        descriptionInput.value = newTaskData.description;    
        console.log('Edit button clicked for task:', newTaskData);
      });
    
      // event handle on delete button on click
    
      deleteButton.addEventListener('click', (e)=>{
        e.preventDefault()
        console.log('task deleted')
        deleteTask(newTaskData._id)
        taskList.removeChild(taskItem);
      });
    
      // Creating complete button to change the status of task
      const completeButton = document.createElement('button');
      completeButton.textContent = 'Completed';
      completeButton.classList.add('btn', 'btn-success', 'completeBtn')
    
      completeButton.addEventListener('click',(e)=>{
        e.preventDefault()
        taskItem.removeChild(editButton)
        taskItem.removeChild(deleteButton)
        taskItem.removeChild(completeButton)
        taskItem.style.background = 'green'
        console.log('task complete button clicked', newTaskData._id)
        socket.emit('update-status', {taskId:newTaskData._id})
      })
    
      // Append the description, edit, and delete elements to the task item
      taskItem.appendChild(descriptionSpan);
      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);
      taskItem.appendChild(completeButton);
    
      // Append the task item to the task list
      taskList.appendChild(taskItem);
  }
}


// creating task with axios

// document.getElementById('add-task').addEventListener('click', (e)=>{
//     e.preventDefault()
    
//     const token = localStorage.getItem("token");
//     if (token) {
//         console.log(token, "add expense");
//     } else {
//         console.log("can't get token");
//         return;
//     }
    
//     axios.post('http://localhost:3000/api/task/new-task',{
//         description:  document.getElementById('description').value
//     },{headers: { Authorization: token }})
//     .then((res)=>{
//         console.log(res)

//     }).catch((err)=>{
//         console.log(err)
//     })
// })

