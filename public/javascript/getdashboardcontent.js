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
        dashboardcontent = JSON.parse(xhr.response);
        document.getElementById("eleve-btn").innerHTML = `${dashboardcontent.data.user.name} - ${dashboardcontent.data.user.studentClass.name}`
        periodsArray = dashboardcontent.data.params.periods.map(period => period.name);
    }
    xhr.send(JSON.stringify(body));
}
getdashboardcontent();

function getmarks(period="current") {
    const xhr = new window.XMLHttpRequest();
    const body = {token: getCookie("token"), for:["marks", period]};
    xhr.open('POST', `/api/content`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) { 
        let data = JSON.parse(xhr.response);
        const subjects = data.data.marks.subjects;
        // Create the table element
        const table = document.getElementById('marks-table');
        table.innerHTML = '';
        // Iterate over the subjects array
        for (const subject of subjects) {
        // Create the thead element
        const thead = document.createElement('thead');
        // Create the tr element
        const tr = document.createElement('tr');

        // Create the th element for the subject name
        const thSubject = document.createElement('th');
        thSubject.innerHTML = subject.name;

        // Create the th element for the averages
        const thAverages = document.createElement('th');
        thAverages.innerHTML = `${subject.averages.student} (class avg: ${subject.averages.studentClass})`;

        // Append the th elements to the tr element
        tr.appendChild(thSubject);
        tr.appendChild(thAverages);

        // Append the tr element to the thead element
        thead.appendChild(tr);

        // Create the tbody element
        const tbody = document.createElement('tbody');

        // Iterate over the marks array
        for (const mark of subject.marks) {
            // Create the tr element
            const tr = document.createElement('tr');

            // Create the td element for the mark title
            const tdTitle = document.createElement('td');
            tdTitle.innerHTML = mark.title;

            // Create the td element for the mark value and scale
            const tdValue = document.createElement('td');
            tdValue.innerHTML = `${mark.value}/${mark.scale} (coeff. ${mark.coefficient})`;

            // Append the td elements to the tr element
            tr.appendChild(tdTitle);
            tr.appendChild(tdValue);

            // Append the tr element to the tbody element
            tbody.appendChild(tr);
        }

        // Append the thead and tbody elements to the table element
        table.appendChild(thead);
        table.appendChild(tbody);
        thead.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.lineHeight!== "0px") {
                content.style.lineHeight = "0px";
                content.style.display = "none";
            } else {
              content.style.lineHeight = "normal";
              content.style.display = "";
            }
          });
        }
    }
xhr.send(JSON.stringify(body));

}
getmarks();

function gethomeworks() {
    const xhr = new window.XMLHttpRequest();
    const body = {token: getCookie("token"), for:["homeworks", new Date(), new Date(1677081771)]}
    xhr.open('POST', `/api/content`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
        homeworks = JSON.parse(xhr.response);
        document.getElementById("homeworkcontainer").innerHTML = `${xhr.responseText}`
    }
    xhr.send(JSON.stringify(body));
}
gethomeworks();


document.addEventListener('DOMContentLoaded', () => {
  const btnPrev = document.getElementById("btn-period-prv");
  const btnNext = document.getElementById("btn-period-nxt");
  const btnPeriodName = document.getElementById("btn-period-name");
  btnPrev.addEventListener("click", () => {
    let currentPeriod = btnPeriodName.innerHTML;
    let previousPeriodIndex = periodsArray.indexOf(currentPeriod) - 1;
    let previousPeriod = periodsArray[previousPeriodIndex] || periodsArray[0];
    getmarks(previousPeriod);
    btnPeriodName.innerHTML = previousPeriod;
  });

  btnNext.addEventListener("click", () => {
    let currentPeriod = btnPeriodName.innerHTML;
    let nextPeriodIndex = periodsArray.indexOf(currentPeriod) + 1;
    let nextPeriod = periodsArray[nextPeriodIndex] || periodsArray[0];
    getmarks(nextPeriod);
    btnPeriodName.innerHTML = nextPeriod;
  });
});
