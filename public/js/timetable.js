function userSendChat() {
  window.location.href ='../chat.html?name=' + encodeURIComponent(uid);
}

function userSendRoom() {
  window.location.href ='../room.html?name=' + encodeURIComponent(uid);
}