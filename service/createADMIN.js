const bcrypt = require('bcrypt');
const User = require('../model/user')


const createAdmin = ()=>{

    // Check if the admin user already exists
    User.findOne({ email: 'shailesh.dhoot@yahoo.com' })
    .then((existingAdmin)=> { 
    if (existingAdmin) {
        console.log('Admin user already exists');
    } else {
        // Create a new admin user
        const adminUser = new User({
        name: 'Shailesh',
        email: 'shailesh.dhoot@yahoo.in',
        role: 'admin'
        });

        // Hash the admin user's password before saving
        bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
        } else {
            bcrypt.hash('shailesh', salt, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
            } else {
                adminUser.password = hash;
                // Save the admin user to the database
                adminUser.save().then(()=>{
                    console.log('admin created')
                }).catch(err=>console.log('error in svae method in creating admin', err))
                
            }
            });
        }
        });
    }
    });
}

module.exports= {createAdmin}