var invalid = 0;

function Validation() {

    console.log("Validation function reached");
    //set invalid to 0    
    invalid = 0;
    //if the there's nothing in the datepicker
    if (document.getElementById("invalid_DatePicker").value == "") {
        //set tge
        document.getElementById("invalid_DatePicker").innerHTML = "You must select or enter a Date from the list in MM-DD-YYYY format Benjamin";
        invalid = invalid + 1;
    }
    else {
        document.getElementById("invalid_DatePicker").innerHTML = "";
    }

    if (invalid != 0) {
        return false;
    }
    else {
        return true;
    }


    





}

//<p id="invalid_DatePicker">You must select or enter a Date from the list in MM-DD-YYYY format</p>
//<p id="invalid_EmployeeID">You must select an Employee ID with 8 characters, in 12345678 format</p>
//<p id="invalid_StartTime">You must select or enter a Start Time, in HH:MM AM or HH:MM PM format</p>
//<p id="invalid_EndTime">You must select or enter an End Time, in HH:MM AM or HH:MM PM format</p>
//<p id="invalid_Task_WO_ID">You must select a Task WO ID from the list</p>
//<p id="invalid_ProdZoneID">You must select a Prod Zone ID from the list</p>