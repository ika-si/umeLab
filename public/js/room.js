var url;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    url = value[2];
    console.log(url);
}
getClasses();
