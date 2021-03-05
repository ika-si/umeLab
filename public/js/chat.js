//firestoreからデータ取得
var db = firebase.firestore();

function getAll() {
  let collection = db.collection("rooms").doc("Mon1").collection("classes").doc("english").collection("chat").orderBy('createdAt');
  collection.get().then((querySnapshot) => {
    $('#list').text('');
    querySnapshot.forEach((doc) => {
      if(doc.data()['name'] == userName) {
        $('#list').append('<li class="my">' + doc.data()['createdAt'].toDate() + '<br>' + doc.data()['name'] + '<br>' + doc.data()['msg'] + '</li>');
      } else {
        $('#list').append('<li class="your">' + doc.data()['createdAt'].toDate() + '<br>' + doc.data()['name'] + '<br>' + doc.data()['msg'] + '</li>');
      }
    })
  })
}
getAll();

// firestoreにデータを送信
function add(){
  // let nameAdd = $("#nameAdd").val();
  // if (nameAdd == "") return;

  let msgAdd = $("#msgAdd").val();
  if (msgAdd == "") return;

  db.collection("rooms").doc("Mon1").collection("classes").doc("english").collection("chat").add({
    createdAt: new Date(),
    msg: msgAdd,
    name: userName
  })
  .then(() => {
    getAll();
    $("#nameAdd").val('');
    $("#msgAdd").val('');
    console.log("Document written with ID: ");
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
  });
}

let msg_form = document.getElementById('msgAdd');
msg_form.addEventListener('keypress', test_ivent);

function test_ivent(e) {
  if (e.keyCode === 13) {
    add();
  }
  return false;
}
// ２秒に１回リロード
// setTimeout(function () {
//     location.reload();
// }, 2000);



//room.jsのコピペ
//スクロールする
(function () {
  var sendMessage = function () {
    var $messages = $('.messages');
    return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
  };

  setTimeout(function () {
    return sendMessage();
  }, 1000);

}.call(this));
