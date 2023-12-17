const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");
prevDays = document.querySelectorAll(".prevDays");
nextMonthDays = document.querySelectorAll(".nextMonthDays");

let events = [];

// Fetch events from a JSON file
fetch('events.json')
  .then(response => response.json())
  .then(data => {
    // Convert date strings to Date objects and store them in the events array
    events = data.map(event => {
      let date = new Date(event.date);
      return { date: date, name: event.name, org: event.org, link: event.link }; // Assuming 'org' is the property in your JSON data that holds the organization name
    });

    // Render the calendar after the events are loaded
    renderCalendar();
  })
  .catch(error => console.error('Error:', error));

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const attachDayEvents = () => {
    let prevDays = document.querySelectorAll('.prevDays');
    let nextMonthDays = document.querySelectorAll('.nextMonthDays');

    prevDays.forEach(day => {
        day.addEventListener('click', () => {
            currMonth--;
            updateDateAndRenderCalendar();
        });
    });

    nextMonthDays.forEach(day => {
        day.addEventListener('click', () => {
            currMonth++;
            updateDateAndRenderCalendar();
        });
    });

    let day = document.querySelectorAll('.dayOfMonth:not(.event-day)');
    let eventDays = document.querySelectorAll('.event-day');
    let calendarContainer = document.querySelector('.calendar-container');
    let sidebar = document.getElementById('sidebar');

    eventDays.forEach(day => {
        day.addEventListener('click', function() {
          // Get the day for the clicked day
          let dayNumber = parseInt(day.getAttribute('data-day'));
  
          // Get the events for this day
          let dayEvents = events.filter(event => event.date.getDate() === dayNumber && event.date.getMonth() === currMonth);
  
          // Get the event list and clear its current content
          let eventList = document.getElementById('event-list');
          eventList.innerHTML = '';

          // Update the sidebar title
          let sidebarTitle = document.getElementById('sidebar-title');
          sidebarTitle.textContent = `Events (${months[currMonth]} ${dayNumber}, ${currYear})`;
  
          // Create a new list item for each event and append it to the event list
          dayEvents.forEach(event => {
            let eventLi = document.createElement('li');
            let eventName = document.createElement('a');
            let eventOrg = document.createElement('p');

            eventName.textContent = event.name;
            eventName.href = event.link;
            eventName.target = '_blank';
            eventOrg.textContent = event.org; // Assuming 'org' is the property in your JSON data that holds the organization name

            eventLi.appendChild(eventName);
            eventLi.appendChild(eventOrg);
          
            // Show the tooltip when hovering over the list item
            eventLi.addEventListener('mousemove', function(e) {
                let tooltip = document.getElementById('tooltip');
                let tooltipImg = document.getElementById('tooltip-img');
                let tooltipText = document.getElementById('tooltip-text');
              
                if (sidebar.classList.contains('open')) {
                  tooltipImg.src = "gdg.png";
                  tooltipText.textContent = `Sample text for ${event.name}`;
              
                  const containerRect = document.querySelector('.calendar-container').getBoundingClientRect();
              
                  // Check if the cursor is near the right edge of the calendar container
                  if (e.clientX + tooltip.offsetWidth > containerRect.right) {
                    // If it is, position the tooltip to the left of the cursor
                    tooltip.style.left = 'auto';
                    tooltip.style.right = (window.innerWidth - e.clientX + 10) + 'px'; // 10 is for a little space between the tooltip and the cursor
                  } else {
                    // If it's not, position the tooltip to the right of the cursor
                    tooltip.style.right = 'auto';
                    tooltip.style.left = (e.clientX + 10) + 'px'; // 10 is for a little space between the tooltip and the cursor
                  }
              
                  tooltip.style.display = 'block';
                  tooltip.style.top = (e.clientY + 10) + 'px'; // 10 is for a little space between the tooltip and the cursor
                }
            });
              
            eventLi.addEventListener('mouseout', function() {
                let tooltip = document.getElementById('tooltip');
            
                // Only hide the tooltip if the sidebar is open
                if (sidebar.classList.contains('open')) {
                    tooltip.style.display = 'none';
                }
            });
          
            eventList.appendChild(eventLi);
          });
          
          sidebar.classList.add('open');
          calendarContainer.classList.add('sidebar-open');
        });
    });

    day.forEach(day => {
      day.addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('open');
        calendarContainer.classList.remove('sidebar-open'); // add class to calendar-container
      });
    });

}

const updateDateAndRenderCalendar = () => {
    if(currMonth < 0 || currMonth > 11) {
        date = new Date(currYear, currMonth, new Date().getDate());
        currYear = date.getFullYear();
        currMonth = date.getMonth();
    } else {
        date = new Date();
    }
    renderCalendar();
}

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive prevDays">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        let isEventDay = events.some(event => event.date.getDate() === i && event.date.getMonth() === currMonth) ? "event-day" : "";
        liTag += `<li class="dayOfMonth ${isToday} ${isEventDay}" data-day="${i}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive nextMonthDays">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
    attachDayEvents();
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});