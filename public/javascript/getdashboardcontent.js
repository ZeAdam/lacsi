// getdashboardcontent.js
// =================================================================
// Gets the content displayed on the dashboard
// Calls /api/content
// Used by /dashboard

function getdashboardcontent() { // for fetching name, class
    const xhr = new window.XMLHttpRequest();
    const body = {token: getCookie("token"), for:["dashboard"]}
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

function loadTimetable(from,to) { // called by fullCalendar when new view is generated
    const xhr = new window.XMLHttpRequest();
    const body = {
        token: getCookie("token"), for: ["timetable", from, to]}
    xhr.open('POST', `/api/content`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
      console.log(xhr.response);
        const timetable =  JSON.parse(xhr.response).data.timetable.map((entry) => {
                return {
                  start: entry.from,
                  end: entry.to,
                  title: `${entry.subject}${entry.teacher!=null ? " - " + entry.teacher:""}`,
                  backgroundColor: entry.color,
                };
              });
        for (let i = 0; i < timetable.length; i++) {
          calendar.addEvent(timetable[i])
        }
    }
    xhr.send(JSON.stringify(body));
}
// 604800000