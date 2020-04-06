function Message(user, roomId, messageText) {
    this.userData = user;
    this.roomId = roomId;
    this.messageText = messageText;
    this.creatingTime = (new Date).toString();
}

Message.prototype.getMessage = function () {
    return this.messageText;
};

module.exports = Message;