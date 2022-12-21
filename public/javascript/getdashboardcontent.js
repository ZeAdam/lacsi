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

function getmarks() { //we'll temporarily work with the current trimester
    const xhr = new window.XMLHttpRequest();
    const body = {token: getCookie("token"), for:["marks", "current"]};
    xhr.open('POST', `/api/content`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) { 
        let data = JSON.parse(xhr.response);
        const subjects = data.data.marks.subjects;
        // Create the table element
        const table = document.getElementById('marks-table');

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
        }

        // Append the table element to the desired location in the DOM
        document.body.appendChild(table);

    }
xhr.send(JSON.stringify(body));

}
getmarks();