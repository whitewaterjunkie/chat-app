const messageModel = require("../model/messageModel");
module.exports.addMessage = async (req, res, next) => {
	try {
		const { from, to, message } = req.body;
		const data = await messageModel.create({
			message: { text: message },
			users: [from, to],
			sender: from,
		});
		if (data) return res.json({ msg: "Message sent successfully" });
		return res.json({ msg: "Message not sent" });
	} catch (error) {
		next(error);
	}
};
module.exports.getAllMessages = async (req, res, next) => {
	try {
		const { from, to } = req.body;
		const messages = await messageModel
			.find({
				users: {
					$all: [from, to],
				},
			})
			.sort({ updatedAt: 1 });
		const projectMessages = messages.map((e) => {
			return {
				fromSelf: e.sender.toString() === from,
				message: e.message.text,
				time: e.createdAt,
			};
		});
		res.json(projectMessages);
	} catch (error) {
		next(error);
	}
};