// getdashboardcontent.js
// =================================================================
// Gets the content displayed on the dashboard
// Calls /api/content
// Used by /dashboard

function getdashboardcontent() {
    const xhr = new window.XMLHttpRequest();
        const body = {token: getCookie("token"), for:"dashboard"}
        xhr.open('POST', `/api/content`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function(e) {
            // here take place all the mods of the page.. as of right now (it'll be cluttered, sowwy)
            dat = JSON.parse(xhr.response);
            document.getElementById("eleve-btn").innerHTML = `${dat.data.user.name} - ${dat.data.user.studentClass.name}`
        }
        xhr.send(JSON.stringify(body));
}
getdashboardcontent();