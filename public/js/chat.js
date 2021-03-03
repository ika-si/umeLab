var db = firebase.firestore();

function getAll() {
  let collection = db.collection("users").orderBy('createdAt');
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


function add(){
  // let nameAdd = $("#nameAdd").val();
  // if (nameAdd == "") return;

  let msgAdd = $("#msgAdd").val();
  if (msgAdd == "") return;

  db.collection("users").add({
    createdAt: new Date(),
    msg: msgAdd,
    name: userName
  }).then(function(docRef) {
    getAll();
    $("#nameAdd").val('');
    $("#msgAdd").val('');
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
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
