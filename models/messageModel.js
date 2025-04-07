// server/models/messageModel.js

class Message {
  constructor(content) {
    this.content = content;
    this.timestamp = new Date();
  }
}

module.exports = Message;
