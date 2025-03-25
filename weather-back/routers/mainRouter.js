const express = require("express")
const Router = express.Router()


const {
    register,
    login,
    autoLogin,
    saveSearch,
    deletePlace
} = require("../controllers/mainController")

const {
    registerValidate,
    loginValidate,
} = require("../middleware/validators")

const authMiddle = require("../middleware/auth")

Router.post("/register", registerValidate, register)
Router.post("/login", loginValidate, login)
Router.post("/auto-login",authMiddle,autoLogin)
Router.post("/save-search",authMiddle,saveSearch)
Router.delete("/delete-place/:id",authMiddle, deletePlace)

module.exports = Router