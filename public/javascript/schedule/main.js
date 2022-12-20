document.addEventListener('DOMContentLoaded', function() {
	let calendarEl = document.getElementById('calendar');
	calendar = new FullCalendar.Calendar(calendarEl, {
	  locale: 'fr',
	  initialView: 'timeGridWeek',
	  allDaySlot: false,
	  slotMinTime: "08:00:00",
	  slotMaxTime: "18:00:00",
	  slotDuration: "01:00:00",
	  slotLabelInterval: "01:00:00",
	  height: "80vh",
	  eventBorderColor: "rgba(0,0,0,0)",
	  expandRows: true,
	  nowIndicator: true,
	  weekends: false,
	  events: function(info, successCallback, failureCallback) {
		const xhr = new window.XMLHttpRequest();
		const body = {
			token: getCookie("token"), for: ["timetable",new Date(info.start).toLocaleDateString('en-CA'),new Date(info.end).toLocaleDateString('en-CA')]}
		xhr.onreadystatechange = (e) => {
		if (xhr.readyState !== 4) {
		  return;
		}

		if (xhr.status === 200) {
		  timetable = JSON.parse(xhr.response).data.timetable.map((entry) => {
					return {
					  start: entry.from,
					  end: entry.to,
					  title: `${entry.subject}${entry.teacher!=null ? " - " + entry.teacher:""}`,
					  backgroundColor: entry.color,
					};
				  });
		  successCallback(timetable);
		} else {
		  failureCallback('request_error');
		}
	  };
		xhr.open('POST', `/api/content`, true);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify(body));
	  }
	})
	calendar.setOption('locale', 'fr');
	view = calendar.view;
	calendar.render();
  });