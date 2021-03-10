function userSendChat() {
  window.location.href ='../chat.html?name=' + encodeURIComponent(uid);
}

function userSendRoom(url,period) {
  window.location.href ='../room.html?name=' + encodeURIComponent(uid) + "?classdocid=" + encodeURIComponent(url) + "?period=" + encodeURIComponent(period);
}

function userSendClasslist(period) {
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(period);
}

function userSendClasslistChange(period,url) {
  window.location.href ='../classlist.html?name=' + encodeURIComponent(uid) + "?period=" + encodeURIComponent(period) + "?classdocid=" + encodeURIComponent(url);
}

const db = firebase.firestore();
const weekArr = ["Mon", "Tue", "Wed", "Thu", "Fri"];
let mustCount=0, optionalCount=0, freeCount=0;

{/* <span id="openingClass">[開講曜日・時限]</span> */}

// 追加・roomのボタンを作成
for (let i=0; i<weekArr.length; i++) {
  for (let j=1; j<=6; j++) {
    let parent = document.getElementById(`${weekArr[i]}${j}`);
    // console.log(parent.id);
    let classname = document.createElement('span');
    classname.setAttribute('id', `${parent.id}name`);
    parent.appendChild(classname);
    let addBtn = document.createElement('button');
    addBtn.setAttribute('type', 'button');
    addBtn.setAttribute('id', `${parent.id}add`);
    addBtn.setAttribute('class', 'addRoom');
    addBtn.innerText = "追加";
    addBtn.setAttribute('onclick', `userSendClasslist('${parent.id}')`);
    parent.appendChild(addBtn);
    let roomBtn = document.createElement('button');
    roomBtn.setAttribute('type', 'button');
    roomBtn.setAttribute('id', `${parent.id}room`);
    roomBtn.setAttribute('class', 'classroom');
    roomBtn.innerText = "room";
    roomBtn.setAttribute('onclick', `sendRoom('${parent.id}')` );
    parent.appendChild(roomBtn);
    let changeBtn = document.createElement('button');
    changeBtn.setAttribute('type', 'button');
    changeBtn.setAttribute('id', `${parent.id}change`);
    changeBtn.setAttribute('class', 'changeroom');
    changeBtn.innerText = "変更";
    changeBtn.setAttribute('onclick', `sendClasslistChange('${parent.id}')` );
    parent.appendChild(changeBtn);

  }
}

//console.log(document.getElementById('Mon1'));
buttonShow();

for (let i=0; i<weekArr.length; i++) {
  for (let j=1; j<=6; j++) {
    document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
    document.getElementById(`${weekArr[i]}${j}add`).style.display = "none";
    document.getElementById(`${weekArr[i]}${j}change`).style.display = "none";
  }
}

let edit = false;

window.onload = function(){
  document.getElementById("btn2").style.display = "none";
  document.getElementById("btn1").addEventListener("click", function(){
    edit = true;
    document.getElementById("btn1").style.display = "none";
    document.getElementById("btn2").style.display = "block";
    buttonShow();
  });

  document.getElementById("btn2").addEventListener("click", function(){
    edit = false;
    document.getElementById("btn1").style.display = "block";
    document.getElementById("btn2").style.display = "none";
    buttonShow();
  });
}

let classDoacId = [
  {time:"Mon1"},
  {time:"Mon2"},
  {time:"Mon3"},
  {time:"Mon4"},
  {time:"Mon5"},
  {time:"Mon6"},

  {time:"Tue1"},
  {time:"Tue2"},
  {time:"Tue3"},
  {time:"Tue4"},
  {time:"Tue5"},
  {time:"Tue6"},

  {time:"Wed1"},
  {time:"Wed2"},
  {time:"Wed3"},
  {time:"Wed4"},
  {time:"Wed5"},
  {time:"Wed6"},

  {time:"Thu1"},
  {time:"Thu2"},
  {time:"Thu3"},
  {time:"Thu4"},
  {time:"Thu5"},
  {time:"Thu6"},

  {time:"Fri1"},
  {time:"Fri2"},
  {time:"Fri3"},
  {time:"Fri4"},
  {time:"Fri5"},
  {time:"Fri6"},
]

let sendurl;
let time;
let url;

function urlRegistration(sendurl,time){
  for(i=0; i < classDoacId.length; i++){
    if(classDoacId[i].time == time){
      classDoacId[i].sendurl = sendurl;
    }
  }
}

function sendRoom(time){
  for(i=0; i < classDoacId.length; i++){
    if(classDoacId[i].time == time){
      url = classDoacId[i].sendurl;
    }
  }
  userSendRoom(url,time);
}

function sendClasslistChange(time){
  for(i=0; i < classDoacId.length; i++){
    if(classDoacId[i].time == time){
      url = classDoacId[i].sendurl;
    }
  }
  userSendClasslistChange(time,url);
}

function buttonShow(){

  // 追加・roomボタンの表示/非表示を設定
  for (let i=0; i<weekArr.length; i++) {
    for (let j=1; j<=6; j++) {

      // 自分が（uidでFirestoreを検索) Mon1とかごとにクラスを履修していたら addClass にtrueが入る
      db.collection("account")
      .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              if(doc.data()['uid'] == uid) {
                db.collection("account").doc(doc.id).collection("myClasses")
                .get().then((querySnapshot2) => {
                  if (querySnapshot2.docs.length == 0) {
                    document.getElementById(`${weekArr[i]}${j}add`).style.display = "block";
                  }

                  for (var k in querySnapshot2.docs) {
                    const doc2 = querySnapshot2.docs[k];

                    if (doc2.data()["room"] == document.getElementById(`${weekArr[i]}${j}`).id) { //myClassesにこのroomのデータが登録されていたら　room ボタンを表示
                      //console.log("Find room : " + weekArr[i] + j + ", " + doc2.data()["name"]);
                      document.getElementById(`${weekArr[i]}${j}add`).style.display = "none";

                      if(edit==false){
                        document.getElementById(`${weekArr[i]}${j}room`).style.display = "block";
                        document.getElementById(`${weekArr[i]}${j}change`).style.display = "none";
                      } else {
                        document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
                        document.getElementById(`${weekArr[i]}${j}change`).style.display = "block";
                      }
                      
                      document.getElementById(`${document.getElementById(weekArr[i] + j).id}name`).textContent = doc2.data()["name"];
                      //console.log(`${weekArr[i]}${j} : "room" button`);
                      sendurl = doc2.id;
                      time = `${weekArr[i]}${j}`;
                      urlRegistration(sendurl,time);
                      break;
                    } else { //追加 ボタンを表示
                      document.getElementById(`${weekArr[i]}${j}add`).style.display = "block";
                      document.getElementById(`${weekArr[i]}${j}room`).style.display = "none";
                      document.getElementById(`${weekArr[i]}${j}change`).style.display = "none";
                      // console.log(`${weekArr[i]}${j} : "追加" button`);
                    }
                  }
                });
              }
          });
      });
    }
  }

}

