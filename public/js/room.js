let urlClass, period;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    urlClass = value[2];
    console.log(urlClass);
}
getClasses();

const db = firebase.firestore();
// let room; // ->periodに変更 // Mon1とか。履修していないとroom.htmlにはこれないため、showRoomTitle() 内で必ず値が入る
// let chatRef; // ->messageRefに変更 // chat機能の実装で使うかもしれないから一応定義してみる要らなければ消す getStudents() でコレクションが入る
let messagesRef;
let usersRef; // getStudents() でコレクションが入る


function showRoomTitle() {
    // userの履修クラスmyClassesからドキュメントid が一致するものを探し、フィールドを取得して表示内容を更新
    db.collection('account')
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                db.collection('acount').doc(doc.id).collection('myClasses')
                .get().then((querySnapshot2) => {
                    querySnapshot2.forEach((doc2) => {
                        if(doc2.id == urlClass) {
                            document.getElementById("roomname").textContent = doc2.data()['period'] +" - "+ doc2.data()['name'] +" - ";
                            document.getElementById("teachername").textContent = doc2.data()['teacher'];
                            // room = doc2.data()['room'];
                            period = doc2.data()['room'];
                        }
                    });
                });
            }
        });
    });
}
showRoomTitle();

function getStudents() {
    // chatRef = db.collection("rooms").doc(room).collection("classes").doc(urlClass).collection("chat");
    // usersRef = db.collection('rooms').doc(room).collection('classes').doc(urlClass).collection('users');
    messagesRef = db.collection("rooms").doc(period).collection("classes").doc(urlClass).collection("chat");
    usersRef = db.collection('rooms').doc(period).collection('classes').doc(urlClass).collection('users');

    // TODo: 配列とかオブジェクトとかにユーザー一覧を格納する処理を書く。
    //      studentごとのuidとnameのセットが必要。　かつ、自分がどれかを明確にさせる
    //      uid , userNameにすでに自分の情報が入っているみたい
}