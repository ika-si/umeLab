// 注意：下記3つは各々独立したコードのため、1つのみコメントアウトを外して実行する

// -----------------------------------------------------------------------------------------------------------
// 登録ユーザー数をconsoleに出力する処理

// let countAccount = 0;
// db.collection("account").get().then((querySnapshot) => {
// querySnapshot.forEach((doc) => {
//     if (doc.data()["email"].substring(0,4) == "g189") {
//         console.log(doc.id, "  ", doc.data()["email"]);
//     }
//     countAccount++;
// });
//     console.log(countAccount);
// });

// -----------------------------------------------------------------------------------------------------------
// NumberOfChatObject の　更新
// NumberObChatObject: {} はもう定義済みとする

// let thisNumberOfChat = 0;
// let nocObjResult = {};
// countUp(20210001);

// function countUp(i) {
//     if (!(i == 20210030 || i == 20210105 || i == 20210114 || i == 20210238 || i == 20210269 
//         || i == 20210315 || i == 20210488 || i == 20211420 || i == 20210810 || i == 20210812)) { // 欠番

//         thisNumberOfChat = 0; // リセット

//         db.collection("year").doc("2021").collection("classes").doc(String(i)).collection("chat").get()
//         .then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 thisNumberOfChat++;
//             });

//             if (thisNumberOfChat != 0) {
//                 console.log(i, " : ", thisNumberOfChat);
//             }

//             nocObjResult[`chat${i}`] = thisNumberOfChat; // nocObjResultに新たにkey-valueが加わる
            
//             if (i + 1 < 20212267) {
//                 countUp(i + 1);
//             } else {
//                 db.collection("year").doc("2021").set({
//                     NumberOfChatObject: nocObjResult
//                 }, {merge: true})
//                 .then(() => {
//                     console.log("end");
//                     console.log("Document successfully written!");
//                 })
//                 .catch((error) => {
//                     console.error("Error writing document: ", error);
//                 });
//             }

//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//         });

//     } else {
//         if (i + 1 < 20212267) {
//             countUp(i + 1);
//         } else {
//             db.collection("year").doc("2021").set({
//                 NumberOfChatObject: nocObjResult
//             }, {merge: true})
//             .then(() => {
//                 console.log("end");
//                 console.log("Document successfully written!");
//             })
//             .catch((error) => {
//                 console.error("Error writing document: ", error);
//             });
//         }
//     }
// }

// -----------------------------------------------------------------------------------------------------------
// 何かしら履修登録しているユーザーにフィールドy2021MyNumberOfChatObjectを追加

// let nocObjAll = {};
// db.collection("year").doc("2021").get().then((doc) => {
//     if (doc.exists) {
//         nocObjAll = doc.data()["NumberOfChatObject"];
//         createUserChatObj();
//     } else {
//         console.log("No such document!");
//     }
// }).catch((error) => {
//     console.log("Error getting document:", error);
// });

// let thisUserNocObj = {};

// function createUserChatObj() {
//     db.collection("account").get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {

//             if (typeof doc.data()["y2021MyClasses"] !== 'undefined') {
//                 thisUserNocObj = {}; // リセット

//                     let addChatObjClassArr = doc.data()["y2021MyClasses"];

//                     for (let i=0; i<addChatObjClassArr.length; i++) {
//                         thisUserNocObj[`chat${addChatObjClassArr[i]}`] = nocObjAll[`chat${addChatObjClassArr[i]}`];
//                     }

//                     db.collection("account").doc(doc.id).set({
//                         y2021MyNumberOfChatObject: thisUserNocObj
//                     }, {merge: true})
//                     .then(() => {
//                         console.log("Document successfully written!");
//                     })
//                     .catch((error) => {
//                         console.error("Error writing document: ", error);
//                     });

//             }

//         })
//     })
//     .catch((error) => {
//         console.log("Error getting documents: ", error);
//     });
// }

// -----------------------------------------------------------------------------------------------------------