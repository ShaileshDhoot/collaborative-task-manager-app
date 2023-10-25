const express = require('express')

const router = express.Router()

const taskController = require('../controller/taskController')
const middleware = require('../middleware/auth')

router.post('/new-task', middleware.authMiddleware , taskController.createTask)

module.exports = router