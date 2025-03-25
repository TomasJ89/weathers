const express = require("express")
const Router = express.Router()

// Import controllers
const {
    register,
    login,
    autoLogin,
    saveSearch,
    deletePlace
} = require("../controllers/mainController")

// Import middleware
const {
    registerValidate,
    loginValidate,
} = require("../middleware/validators")

const authMiddle = require("../middleware/auth")

// Define routes
Router.post("/register", registerValidate, register)
Router.post("/login", loginValidate, login)
Router.post("/auto-login",authMiddle,autoLogin)
Router.post("/save-search",authMiddle,saveSearch)
Router.delete("/delete-place/:id",authMiddle, deletePlace)

module.exports = Router