function Room(){
  this.id = "room_"+`f${(+new Date).toString(16)}`;
  this.users = [];
  this.messages = [];
}

Room.prototype.getRoomId = function () {
    return this.id;
};

Room.prototype.getCurrentUsers = function () {
    return this.users;
};

Room.prototype.addUser = function (user) {
    this.users.push(user);
};

Room.prototype.getUserById = function (userId) {
    let users = this.users;
    console.log("****:", users);
    for (const user of users){
        if (user.userId === userId){
            return user;
        }
    }
};

Room.prototype.removeUser = function (user) {
    let users = this.users;
    users.splice(users.indexOf(user), 1);
};

Room.prototype.addUser = function (user) {
    this.users.push(user);
};

Room.prototype.addMessage = function (message) {
    this.messages.push(message);
};

Room.prototype.getMessages = function () {
    return this.messages;
};

module.exports = Room;

