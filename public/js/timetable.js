function userSendChat() {
  window.location.href ='../chat.html?name=' + encodeURIComponent(uid);
}

function userSendRoom() {
  window.location.href ='../room.html?name=' + encodeURIComponent(uid);
}

function userSendClasslist(period) {
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(period);
}
