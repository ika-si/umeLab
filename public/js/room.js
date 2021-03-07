var urlClass;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    urlClass = value[2];
    console.log(urlClass);
}
getClasses();
