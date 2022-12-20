// logout.js
// =================================================================
// logs the user out (if token cookie exists)
// calls /api/logout
// used by /dashboard

function getCookie(cn) {
    var name = cn+"=";
    var allCookie = decodeURIComponent(document.cookie).split(';');
    var cval = [];
    for(var i=0; i < allCookie.length; i++) {
        if (allCookie[i].trim().indexOf(name) == 0) {
            cval = allCookie[i].trim().split("=");
        }   
    }
    return (cval.length > 0) ? cval[1] : "";
}


function logout() {
    if (!!getCookie("token")) {
        const xhr = new window.XMLHttpRequest();
        const body = {token: getCookie("token")}
        xhr.open('POST', `/api/logout`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        // xhr.onload = function(e) {}
        xhr.send(body);
    }
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/"
    return true;
}

const graphql = "http://127.0.0.1:21727/graphql";