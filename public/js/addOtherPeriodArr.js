let otherPeriodArr = [];

db.collection("year").doc("2021").collection("classes").get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        if (doc.data()["isOtherPeriod"] == true) {
            otherPeriodArr.push(String(doc.data()["classId"]));
            console.log(doc.data()["classId"] + "   " +  doc.data()["name"]);
        }
    });

    db.collection("year").doc("2021").set({
        otherPeriodArr: otherPeriodArr
    }, {merge: true})
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

})
.catch((error) => {
    console.log("Error getting documents: ", error);
});