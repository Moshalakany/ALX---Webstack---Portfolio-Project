import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
			isRead: false,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get unread message counts for all conversations
export const getUnreadCounts = async (req, res) => {
	try {
		const userId = req.user._id;

		// Find all unread messages where current user is the receiver
		const unreadMessages = await Message.aggregate([
			{
				$match: {
					receiverId: userId,
					isRead: false,
					isDeleted: false,
				},
			},
			{
				$group: {
					_id: "$senderId",
					count: { $sum: 1 },
				},
			},
		]);

		// Convert to object { senderId: count }
		const unreadCounts = {};
		unreadMessages.forEach((item) => {
			unreadCounts[item._id.toString()] = item.count;
		});

		res.status(200).json(unreadCounts);
	} catch (error) {
		console.log("Error in getUnreadCounts controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Mark messages as read when opening a conversation
export const markMessagesAsRead = async (req, res) => {
	try {
		const { id: senderId } = req.params;
		const receiverId = req.user._id;

		// Mark all messages from senderId to receiverId as read
		await Message.updateMany(
			{
				senderId: senderId,
				receiverId: receiverId,
				isRead: false,
			},
			{
				$set: { isRead: true },
			}
		);

		// Notify the sender that their messages have been read
		const senderSocketId = getReceiverSocketId(senderId);
		if (senderSocketId) {
			io.to(senderSocketId).emit("messagesRead", { oderId: receiverId.toString() });
		}

		res.status(200).json({ message: "Messages marked as read" });
	} catch (error) {
		console.log("Error in markMessagesAsRead controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
