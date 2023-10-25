document.getElementById('loginBtn').addEventListener('click', logIn)
function logIn (e){
    e.preventDefault()
    console.log('login function called')
    const loginDetails = {
        email: document.getElementById("log-email").value,
        password: document.getElementById("log-password").value,
        role: document.getElementById("role").value 


    }
    
    console.log(loginDetails)
    axios.post('http://localhost:3000/api/login',loginDetails)
    .then(response => { 
      console.log('login post api');
      console.log(response.data)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId); 
        localStorage.setItem('role',response.data.role)
        redirectToIndexPage()
       
    })
    .catch(error => {
        alert('user doesnt exists')
        console.log(error, 'something is wrong with login html or controller code')
        
    });
}


function redirectToIndexPage() {
    window.location.href = 'main.html';
}

