function User(name, roomId) {
    this.userId = "user_" + `f${(+new Date).toString(16)}`;
    this.name = name;
    this.roomId = roomId;
}

User.prototype.getName = function () {
    return this.name;
};

User.prototype.getUserId = function () {
    return this.userId;
};

User.prototype.setRoomId = function (roomId) {
    this.roomId = roomId;
};

module.exports = User;
