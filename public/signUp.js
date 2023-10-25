document.getElementById('signup-form').addEventListener('submit', (event) =>{
    event.preventDefault(); // prevent default form submission
    const fullName = document.querySelector('#name').value;
    const emailId = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    axios.post('http://localhost:3000/api/add', {
            name: fullName,
            email: emailId,
            password: password
        })
        .then((res)=>{
            window.location.href = 'index.html' //to redirect user after signup 
        })
        .catch(err=>console.log(err))
});