const userDb = require("../schemas/userSchema")
const conversationsDb = require("../schemas/conversation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');


module.exports = {
    register: async (req, res) => {
        const {password, name, email} = req.body;
        console.log(password, name, email);
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

            const newUser = {
                _id: user._id,
                username: user.username,
            }

            const token = jwt.sign(newUser, process.env.JWT_SECRET)

            newUser.image = user.image
            newUser.email = user.email

            return res.send({message: "Login success", success: true, token, data: newUser});
        } else {

            return res.send({message: "Bad credentials", success: false, data: null});
        }

    },
    updatePhoto: async (req, res) => {
        const {url, user} = req.body
        let updatedUser = await userDb.findOneAndUpdate(
            {_id: user._id},
            {image: url},
            {new: true, projection: {password: 0}}
        );
        if (!updatedUser) {
            return res.status(404).send({message: "User not found", success: false});
        }

        await conversationsDb.updateMany(
            {"members._id": updatedUser._id},
            {$set: {"members.$.image": url}}
        );

        res.send({message: "Photo updated", success: true, data: updatedUser});
    },
    updateUserName: async (req, res) => {
        try {
            const {name, user} = req.body;


            const userExist = await userDb.findOne({username: name});

            if (userExist) {
                return res.send({message: `Username ${name} already taken`, success: false, data: null});
            }


            const updatedUser = await userDb.findOneAndUpdate(
                {_id: user._id},
                {username: name},
                {new: true, projection: {password: 0}}
            );

            if (!updatedUser) {
                return res.status(404).send({message: "User not found", success: false});
            }

            await conversationsDb.updateMany(
                {"members._id": updatedUser._id},
                {$set: {"members.$.username": name}}
            );

            res.send({message: "Username updated", success: true, data: updatedUser});
        } catch (error) {
            console.error("Error updating username:", error);
            res.status(500).send({message: "Internal server error", success: false});
        }
    },

    updatePassword: async (req, res) => {
        const {oldPassword, newPassword, user} = req.body
        const userInDb = await userDb.findById(user._id)
        if (!userInDb) {
            return res.send({message: "User not found", success: false, data: null});
        }
        const passValid = await bcrypt.compare(oldPassword, userInDb.password)

        if (passValid) {

            const salt = await bcrypt.genSalt(10)
            userInDb.password = await bcrypt.hash(newPassword, salt)
            await userInDb.save()

            return res.send({message: "Password changed success", success: true, data: null});
        } else {

            return res.send({message: "Old Passwords do not match", success: false, data: null});
        }

    },

    autoLogin: async (req, res) => {
        try {
            const { user } = req.body;
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
    allUsers: async (req, res) => {
        const users = await userDb.find()
        return res.send({message: "Users fetched", success: true, data: users});
    },
    singleUser: async (req, res) => {
        const {username} = req.params
        const user = await userDb.findOne({username}, {password: 0});
        if (!user) {
            return res.send({message: "User not found", success: false, data: null});
        }
        return res.send({message: "User fetched", success: true, data: user});
    },

    createConversation: async (req, res) => {
        const {id, user} = req.body;
        const members = await userDb.find({
            _id: {$in: [id, user._id]}
        }).select('-password');
        try {

            const conversation = new conversationsDb({
                members
            });
            await conversation.save();

            const updateUser = await userDb.findOneAndUpdate(
                {_id: user._id},
                {$push: {conversations: conversation._id}},
                {new: true, upsert: true, projection: {password: 0}}
            );

            await userDb.findOneAndUpdate(
                {_id: id},
                {$push: {conversations: conversation._id}},
                {new: true, upsert: true}
            );

            return res.send({
                message: "Conversation created successfully",
                success: true,
                data: {conversation, updateUser}
            });
        } catch (error) {
            console.error("Error creating conversation:", error);
            return res.status(500).send({message: "Server error", success: false});
        }
    },
    allConversations: async (req, res) => {
        try {
            const {id} = req.params;
            const objectId = new mongoose.Types.ObjectId(id);

            const conversations = await conversationsDb.find({
                "members._id": objectId
            });

            if (!conversations || conversations.length === 0) {
                return res.send({message: "Conversations not found", success: false, data: null});
            }

            return res.send({success: true, data: conversations});
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return res.status(500).send({success: false, message: "Server error"});
        }
    },
    singleConversation: async (req, res) => {

        try {
            const {conversationsId, user} = req.body;

            const conversation = await conversationsDb.findById(conversationsId);

            if (!conversation) {
                return res.status(404).send({message: "Conversation not found"});
            }

            return res.send({success: true, conversation});
        } catch (error) {
            console.error("Error fetching conversation:", error);
            return res.status(500).send({message: "Internal server error"});
        }

    },

    newMessage: async (req, res) => {
        const {conversationsId, text, sender, recipient} = req.body;

        const message = {
            _id: new mongoose.Types.ObjectId(),
            text,
            sender,
            recipient,
            date: Date.now()
        };

        try {
            const updateConv = await conversationsDb.findByIdAndUpdate(
                conversationsId,
                {$push: {messages: message}},
                {new: true, upsert: true}
            );

            if (!updateConv) {
                return res.status(404).send({message: "Conversation not found"});
            }

            return res.send({success: true, data: updateConv, message});

        } catch (error) {
            return res.status(500).send({message: "Internal server error", error});
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const {id, user} = req.body;

            const conversationId = new mongoose.Types.ObjectId(id);

            const deletedConversation = await conversationsDb.findByIdAndDelete(conversationId);

            if (!deletedConversation) {
                return res.status(404).send({success: false, message: "Conversation not found"});
            }

            await userDb.updateMany(
                {conversations: conversationId},
                {$pull: {conversations: conversationId}}
            );
            await userDb.updateMany(
                {"notifications.conversationsId": id},
                {$pull: {notifications: {conversationsId: id}}}
            );


            const updatedUser = await userDb.findById(user._id, {password: 0});

            if (!updatedUser) {
                return res.status(404).send({success: false, message: "User not found"});
            }

            return res.send({success: true, message: "Conversation deleted", data: updatedUser});
        } catch (error) {
            console.error("Error deleting conversation:", error);
            return res.status(500).send({success: false, message: "Server error"});
        }
    },


    updateUser: async (req, res) => {
        const {id} = req.body
        const updatedUser = await userDb.findById(id, {password: 0});

        if (!updatedUser) {
            return res.status(404).send({success: false, message: "User not found"});
        }
        return res.send({success: true, message: "all good", data: updatedUser})

    },
    like: async (req, res) => {
        try {
            const {userId, msgId, conversationsId} = req.body;

            const conversation = await conversationsDb.findById(conversationsId);

            if (!conversation) {
                return res.status(404).send({message: "Conversation not found"});
            }

            const currentMsg = conversation.messages.find(msg => msg._id.toString() === msgId);
            if (!currentMsg) {
                return res.status(404).send({message: "Message not found"});
            }

            const hasLiked = currentMsg.likes.some(like => like.user.toString() === userId);
            if (!hasLiked) {

                currentMsg.likes.push({user: userId, date: Date.now()});
            } else {
                return
            }

            await conversation.save();

            return res.send({success: true, message: "Message liked successfully", data: currentMsg});
        } catch (error) {

            console.error('Error liking message:', error);
            return res.status(500).send({message: "Internal server error"});
        }

    },
    addNotification: async (req, res) => {
        const {sender, recipient, date, conversationsId,text} = req.body
        console.log("sis",req.body)
        const userSender = await userDb.findById(sender)
        if (!userSender) {
            return res.status(404).send({success: false, message: "User not found"});
        }
        const notification = {
            _id: new mongoose.Types.ObjectId(),
            sender: {name: userSender.username, id: userSender._id},
            date,
            conversationsId,
            type: text? "message": "like"
        }
        const userRecipient = await userDb.findByIdAndUpdate(
            recipient,
            {$push: {notifications: notification}},
            {new: true, upsert: true}
        ).select('-password');
        if (!userRecipient) {
            return res.status(404).send({success: false, message: "User not found"});
        }
        return res.send({success: true, message: "Notification added successfully", data: userRecipient});

    },

    deleteNotification: async (req, res) => {
        const {notificationId, user} = req.body;

        try {
            const id = new mongoose.Types.ObjectId(notificationId);
            const updatedUser = await userDb.findOneAndUpdate(
                {_id: user._id},
                {$pull: {notifications: {_id: id}}},
                {new: true, projection: {password: 0}}
            );

            if (!updatedUser) {
                return res.status(404).send({message: "User not found", success: false});
            }

            return res.send({success: true, message: "Notification deleted successfully", data: updatedUser});
        } catch (error) {
            console.error("Error deleting notification", error);
            return res.status(500).send({message: "Server error", success: false});
        }
    }

}