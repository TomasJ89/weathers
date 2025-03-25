const userDb = require("../schemas/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');


module.exports = {
    register: async (req, res) => {
        const {password, name, email} = req.body;
        const userExist = await userDb.findOne({email: email})

        if (userExist) {
            return res.send({message: "Username already taken", success: false, data: null});
        }

        const salt = await bcrypt.genSalt(10)

        const passHash = await bcrypt.hash(password, salt)


        const user = new userDb({
            username: name,
            password: passHash,
            image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            email: email,
        });
        await user.save();
        return res.send({message: "Registration successful", success: true, data: null});
    },
    login: async (req, res) => {
        const {password, email} = req.body;

        const user = await userDb.findOne({email: email})
        if (!user) {
            return res.send({message: "user not found", success: false, data: null});
        }

        const passValid = await bcrypt.compare(password, user.password)
        if (passValid) {
            const newUser = user.toObject();
            delete newUser.password;

            const token = jwt.sign({ _id: newUser._id, username: newUser.username }, process.env.JWT_SECRET);

            return res.send({ message: "Login success", success: true, token, data: newUser });
        } else {

            return res.send({message: "Bad credentials", success: false, data: null});
        }

    },
    autoLogin: async (req, res) => {
        try {
            const  user  = req.user;
            if (!user) {
                return res.send({ message: "User data missing", success: false });
            }

            const userInDb = await userDb.findOne({ _id: user._id }).select('-password');

            if (!userInDb) {
                return res.send({ message: "User not found", success: false, data: null });
            }
            const newUser = {
                _id: userInDb._id,
                username: userInDb.username,
            };
            const token = jwt.sign(newUser, process.env.JWT_SECRET);
            res.send({ message: "User found successfully", success: true, token, data: userInDb });
        } catch (error) {
            console.error('Auto-login backend error:', error);
            res.status(500).send({ message: "Internal server error", success: false });
        }
    },
    deletePlace:async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        try {
            const updatedUser = await userDb.findOneAndUpdate(
                {_id: user._id},
                { $pull: { mostViewed: { place_id: Number(id) } } },
                {new: true, projection: {password: 0}}
            );

            if (!updatedUser) {
                return res.status(404).send({message: "User not found", success: false});
            }

            return res.send({success: true, message: "Place deleted successfully from most viewed", data: updatedUser});
        } catch (error) {
            console.error("Error deleting place from most viewed", error);
            return res.status(500).send({message: "Server error", success: false});
        }
    },
    saveSearch:async (req, res) => {

        try {
            const { place } = req.body;
            const user = req.user;

            if (!user || !place) {
                return res.send({ message: "Missing Data", success: false });
            }

            const userInDb = await userDb.findOne({ _id: user._id }).select('-password');

            if (!userInDb) {
                return res.send({ message: "User not found", success: false, data: null });
            }
            const placeWithTimestamp = { ...place, viewedAt: new Date() };
            userInDb.mostViewed = userInDb.mostViewed.filter(item => item.place_id !== place.place_id);
            userInDb.mostViewed.unshift(placeWithTimestamp);
            userInDb.mostViewed = userInDb.mostViewed.slice(0, 5);

            await userInDb.save();

            res.send({ message: "Successfully added", success: true, data: userInDb });
        } catch (error) {
            console.error('save-search backend error:', error);
            res.status(500).send({ message: "Internal server error", success: false });
        }

    },
}