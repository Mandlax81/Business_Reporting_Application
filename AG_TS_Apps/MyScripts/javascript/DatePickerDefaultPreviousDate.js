//refines the datepicker input, setting the initial date to the previous date as default when the page loads
window.onload = setTimePreviousDay;
function setTimePreviousDay() {
    //error checking, making sure the two datetimes are only set to the previous day if the url-page is home (i.e. /) or /TSEntry
    var pathname = window.location.pathname
    if (pathname == "/" || pathname == "/TSEntry") {
        console.log("Default Previous Date added");
        //creates a today's date object
        var d = new Date();
        //sets the today's Date object to yesterday, one day previous
        d.setDate(d.getDate() - 1);
        //sets the month one month forward, as months start at index 0, gets the day-date, and gets the year
        var Month = d.getMonth() + 1;
        var prevDate = d.getDate();
        var Year = d.getFullYear();
        //adds a leading 0 to any month-date or day-date under or equal to 9
        if (Month <= 9) {
            Month = "0" + Month;
        }
        else {
            Month = Month;
        }
        if (prevDate <= 9) {
            prevDate = "0" + prevDate;
        }
        else {
            prevDate = prevDate;
        }
        //integrates the dates into one ISO8601 formatted string
        var formattedDate = Month + "-" + prevDate + "-" + Year;
        //gets location-value of the first and second datepickers, and sets it to a specific date
        document.getElementById("DatePicker").value = formattedDate;
        document.getElementById("DatePickerSearch").value = formattedDate;

        return formattedDate;
    }
    else {
        //do nothing
    }
}