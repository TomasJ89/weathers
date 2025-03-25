const userDb = require("../schemas/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');


module.exports = {
    // User registration function
    register: async (req, res) => {
        const {password, name, email} = req.body;

        // Check if the email is already registered
        const userExist = await userDb.findOne({email: email})

        if (userExist) {
            return res.send({message: "Username already taken", success: false, data: null});
        }

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10)
        const passHash = await bcrypt.hash(password, salt)

        // Create a new user with a default profile image
        const user = new userDb({
            username: name,
            password: passHash,
            image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            email: email,
        });
        // Save the new user to the database
        await user.save();
        return res.send({message: "Registration successful", success: true, data: null});
    },
    // User login function
    login: async (req, res) => {
        const {password, email} = req.body;

        // Check if the user exists in the database
        const user = await userDb.findOne({email: email})
        if (!user) {
            return res.send({message: "user not found", success: false, data: null});
        }

        // Compare the provided password with the hashed password in the database
        const passValid = await bcrypt.compare(password, user.password)
        if (passValid) {
            const newUser = user.toObject();
            delete newUser.password;// Remove password from the user object for security

            // Generate a JWT token for authentication
            const token = jwt.sign({ _id: newUser._id, username: newUser.username }, process.env.JWT_SECRET);

            return res.send({ message: "Login success", success: true, token, data: newUser });
        } else {

            return res.send({message: "Bad credentials", success: false, data: null});
        }

    },
    // Auto-login function
    autoLogin: async (req, res) => {
        try {
            const  user  = req.user;// Extract user from token in middelware
            if (!user) {
                return res.send({ message: "User data missing", success: false });
            }

            // Find the user in the database without the password field
            const userInDb = await userDb.findOne({ _id: user._id }).select('-password');

            if (!userInDb) {
                return res.send({ message: "User not found", success: false, data: null });
            }

            // Generate a new token for the user
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
    // Function to delete a saved place from a user's history
    deletePlace:async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        try {
            // Remove the selected place from the most viewed places list
            const updatedUser = await userDb.findOneAndUpdate(
                {_id: user._id},
                { $pull: { mostViewed: { place_id: Number(id) } } },
                {new: true, projection: {password: 0}}// Exclude password from response
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
    // Function to save a search history entry for a user
    saveSearch:async (req, res) => {

        try {
            const { place } = req.body;
            const user = req.user;

            // Ensure that both user and place data are provided
            if (!user || !place) {
                return res.send({ message: "Missing Data", success: false });
            }

            // Find the user in the database
            const userInDb = await userDb.findOne({ _id: user._id }).select('-password');

            if (!userInDb) {
                return res.send({ message: "User not found", success: false, data: null });
            }

            // Add a timestamp to the place entry
            const placeWithTimestamp = { ...place, viewedAt: new Date() };

            // Remove the place if it already exists in the most viewed list (to avoid duplicates)
            userInDb.mostViewed = userInDb.mostViewed.filter(item => item.place_id !== place.place_id);

            // Add the new place to the beginning of the most viewed list
            userInDb.mostViewed.unshift(placeWithTimestamp);

            // Keep only the latest 5 places in the list
            userInDb.mostViewed = userInDb.mostViewed.slice(0, 5);

            // Save the updated user data
            await userInDb.save();

            res.send({ message: "Successfully added", success: true, data: userInDb });
        } catch (error) {
            console.error('save-search backend error:', error);
            res.status(500).send({ message: "Internal server error", success: false });
        }

    },
}