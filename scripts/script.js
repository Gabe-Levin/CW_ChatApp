"use strict";

const messages = [];
let responseTimer;

class Message {
  constructor(getResponse, isMe) {
    this.authorId = isMe;
    this.content = getResponse.text;
    this.timeStamp = getResponse.received;
  }
}

function simulateIncomingMessages() {
  setTimeout(() => {
    $.get("https://cw-quotes.herokuapp.com/api/quotes/random", (data) => {
      const msg = new Message(data.result.text, false, Date.now());

      showMessage(msg);
      scrollToBottom();
    });
  }, genRandomMs());
}

function getMessage() {
  const url = "https://cw-quotes.herokuapp.com/api/quotes/random";
  $.get(url, function (data) {
    const result = data.result;
    result.received = new Date().getTime();
    const msg = new Message(result, false);
    messages.push(msg);
    console.table(messages);
    const newMessage = createMessage(msg);
    $("#messageBoard").append(newMessage);
    scrollDown();
  });
}

function handleClick() {
  const myText = $("#messageInput").val();
  $("#messageInput").val("");
  const myMessage = new Message(
    {
      text: myText,
      received: new Date().getTime(),
    },
    true
  );
  messages.push(myMessage);
  console.table(messages);
  const newMessage = createMessage(myMessage);
  $("#messageBoard").append(newMessage);
  scrollDown();
  clearTimeout(responseTimer);
  responseTimer = setTimeout(getMessage, 5000);
}

function createMessage(message) {
  const parentDiv = $("<div/>", {
    class: message.authorId ? "message isMe" : "message",
  });
  const msgDiv = $("<div/>", {
    text: message.content,
    class: "content",
  }).appendTo(parentDiv);

  const timeDiv = $("<div/>", {
    class: "timestamp",
    text: moment(message.received).calendar(),
  }).appendTo(parentDiv);

  return parentDiv;
}

function scrollDown() {
  const msgBoard = $("#messageBoard");
  msgBoard.scrollTop(msgBoard.prop("scrollHeight"));
}

function getMessages() {
  $.get("/messages", (data) => {
    data.forEach((msg) => showMessage(msg));
  });
}

$("#messageInput").keypress(function (event) {
  if (event.keyCode === 13) {
    handleClick();
  }
});

$(() => {
  // REMOVE-START
  getMessages();
  scrollDown();
});
