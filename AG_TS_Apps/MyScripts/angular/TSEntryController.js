//new app, added pagination dependency, injecting a library of functions, also add ngMessages, another library of functions
var app = angular.module("myApp", ['angularUtils.directives.dirPagination', 'ngMessages'] );



app.controller("myCtrl", function ($scope, $http, $location, $anchorScroll) {
    //debugger;





    //sorts the table by their heading, either ascending or descending
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //Dropdowns
    //gets all the Active Employees' data, mirroring MVC's action-method
    $scope.GetActiveEmployees = function () {
        console.log("GetActiveEmployees function reached");
        $http({
            method: "get",
            url: "/TSEntry/GetActiveEmployees"
        }).then(function (response) {
            $scope.tsactiveemployees = JSON.parse(response.data);
        })
    };    
    //gets all the TaskWONumbers data
    $scope.GetTaskWONumbers = function () {
        console.log("GetTaskWONumbers function reached");
        $http({
            method: "get",
            url: "/TSEntry/GetTaskWONumbers"
        }).then(function (response) {
            $scope.tstaskwonumbers = JSON.parse(response.data);
        })
    };
    //gets all the Production Zones' data, mirroring MVC's action-method
    $scope.GetProductionZones = function () {
        console.log("GetProductionZones function reached");
        $http({
            method: "get",
            url: "/TSEntry/GetProductionZones"
        }).then(function (response) {
            $scope.tsproductionzones = JSON.parse(response.data);
        })
    };
    //gets all the Fields' data, mirroring MVC's action-method
    $scope.GetFields = function () {
        console.log("GetFields function reached");
        $http({
            method: "get",
            url: "/TSEntry/GetFields"
        }).then(function (response) {
            $scope.tsfields = JSON.parse(response.data);
        })
    };
    //gets all the Equipment data, mirroring MVC's action-method
    $scope.GetEquipment = function () {
        console.log("GetEquipment function reached");
        $http({
            method: "get",
            url: "/TSEntry/GetEquipment"
        }).then(function (response) {
            $scope.tsequipment = JSON.parse(response.data);
        })
    };
    //gets all the Implement data, taken from same GetEquipment Action Method, mirroring MVC's action-method
    $scope.GetImplement = function () {
        console.log("GetImplement function reached");
        $http({
            method: "get",
            url: "/TSEntry/GetImplement"
        }).then(function (response) {
            $scope.tsimplement = JSON.parse(response.data);

        })
    };

    //gets all of the entries by TimeSheetEntriesByDate
    $scope.GetTimeSheetEntriesByPreviousDate = function () {
        console.log("GetTimeSheetEntriesByPreviousDate function reached");
        //new TSEntry object
        $scope.TSEntry = {};
        //calls the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
        var formattedDate = setTimePreviousDay();

        //populates the TSEntry object with the date, sets the date to the previous date
        $scope.TSEntry.Date = formattedDate;
        //posts the previous date to the MVC action method
        $http({
            method: "post",
            url: "/TSEntry/GetTimeSheetEntriesByPreviousDate",
            datatype: "json",
            data: JSON.stringify($scope.TSEntry)
        })
            //gets the previous days' dates back from MVC, and sends it to the AngularJS frontend (Index.cshtml)   
            .then(function (response) {
                $scope.tsentriesbypreviousdate = JSON.parse(response.data);
            })
    };


    //TSEntries By Whatever Button Selectors
    //gets all of the entries by Employee ID
    //create an object to store the Time Sheet Entries
    //stores the EmployeeID data in an object-variable
    //posts this object-variable to the MVC controller->action method as a parameter
    //The MVC controller->action method takes over. It uses the object.property (i.e. employee id)
    //to pass in to the DAL method. The DAL Method returns the specific employees' object-data
    //This data is converted into Json, where it is returned as a response back to the caller,
    //the angular.js method. The angular.js method takes over again, creating an object-variable
    //that the view can use to loop through and display the data
    $scope.GetTSEntriesByEmployeeID = function () {
        console.log("GetTSEntriesByEmployeeID function reached");
        $scope.TSEntry = {};
        $scope.TSEntry.EmployeeID = $scope.EmployeeID;
        $http({
            method: "post",
            url: "/TSEntry/GetTSEntriesByEmployeeID",
            datatype: "json",
            data: JSON.stringify($scope.TSEntry)
        })
            .then(function (response) {
                //if the data is empty/null, display a popup for the user to pick a different employee id
                if (response.data != "[]") {
                    $scope.tsemployeesbyemployeeid = JSON.parse(response.data);
                }
                else if (response.data == "[]") {
                    alert("No Employees for that ID. Select a different Employee ID.");
                }
        })
    };








    //gets all of the entries by TimeSheetEntriesByDate
    $scope.GetTimeSheetEntriesByDate = function () {
        console.log("GetTimeSheetEntriesByDate function reached");
        $scope.TSEntry = {};

        //calls the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
        ///var formattedDate = setTimePreviousDay();
        //if (angular.isUndefined($scope.Date)) {
        //    document.getElementById("DatePicker").value = formattedDate;
        //    $scope.TSEntry.Date = formattedDate;
        //}
        //else {
        //    $scope.TSEntry.Date = $scope.Date;
        //}

        $scope.TSEntry.Date = $scope.Date



        $http({
            method: "post",
            url: "/TSEntry/GetTimeSheetEntriesByDate",
            datatype: "json",
            data: JSON.stringify($scope.TSEntry)
        })
            .then(function (response) {
                if (response.data != "[]") {
                    $scope.tsentriesbydate = JSON.parse(response.data);
                }
                else if (response.data == "[]") {
                    alert("No Entries for that date. Select a different date.");
                }
            })
    };





    //gets all of the entries by TimeSheetEntriesByDateandEmpID, gets both date and empID
    $scope.GetTimeSheetEntriesByDateandEmpID = function () {
        console.log("GetTimeSheetEntriesByDateandEmpID function reached");
        $scope.TSEntry = {};

        //calls the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
        var formattedDate = setTimePreviousDay();
        if (angular.isUndefined($scope.Date)) {
            document.getElementById("DatePicker").value = formattedDate;
            $scope.TSEntry.Date = formattedDate;
        }
        else {
            $scope.TSEntry.Date = $scope.Date;
        }

        $scope.TSEntry.EmployeeID = $scope.EmployeeID;
        //sends date and empID to MVC Controller->Action Method
        $http({
            method: "post",
            url: "/TSEntry/GetTimeSheetEntriesByDateandEmpID",
            datatype: "json",
            data: JSON.stringify($scope.TSEntry)
        })
        //accepts data from MVC Controller->Action Method and sends to View/Index.html
            .then(function (response) {
                //if the data is empty/null, display a popup for the user to pick a different employee id and date
                if (response.data != "[]") {
                    $scope.tsentriesbydateandempid = JSON.parse(response.data);
                }
                else if (response.data == "[]") {
                    alert("No Employee Entries on that Date. Select a different Employee for that Date.");
                }
            })
    };

    //Create/Insert Function
    $scope.InsertTSEntry = function () {
        console.log("InsertTSEntry function reached");
        //gets an reference to the save button, and stores its value. This forms the basis of using one button to switch contextually from Submit to Update
        var Action = document.getElementById("btnSave").getAttribute("value");

        //if it's the Submit button, submit the data to the db
        if (Action == "Submit") {

            $scope.TSEntry = {};
            $scope.TSEntry.EmployeeID = $scope.EmployeeID;
            //calls the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
            var formattedDate = setTimePreviousDay();
            //if the Date value is undefined, which it would be if the user hasn't specifically selected a value, even if javascript is placing a value there on page initialization
            //if no Date value is specifically chosen by the user, which would imply the user decided to "go with" the default date value (i.e. yesterday's value)
            //use javascript-plain to get a reference to the Date input, and set it's value to yesterday's value (i.e. formattedDate). This is what the user in the Date input field
            //Then force AngularJS's backend variable to also be set to yesterday's date
            //else, if the Date value/variable is defined, the user had selected a specific data, do standard AngularJS, and set the front-end Date variable (i.e. $scope.Date)
            //to the backend Date Variable (i.e.  $scope.TSEntry.Date)
            if (angular.isUndefined($scope.Date)) {
                document.getElementById("DatePicker").value = formattedDate;
                $scope.TSEntry.Date = formattedDate;
            }
            else {
                $scope.TSEntry.Date = $scope.Date;
            }
            $scope.TSEntry.StartTime = $scope.StartTime;
            $scope.TSEntry.EndTime = $scope.EndTime;
            $scope.TSEntry.ProdZoneID = $scope.ProdZoneID;
            $scope.TSEntry.EquipmentMeterReading = $scope.EquipmentMeterReading;
            $scope.TSEntry.EquipmentNumber = $scope.EquipmentNumber;
            $scope.TSEntry.ImplementNumber = $scope.ImplementNumber;
            $scope.TSEntry.Task_WO_ID = $scope.Task_WO_ID;
            $scope.TSEntry.FieldNumber = $scope.FieldNumber;
            //posts data
            $http({
                method: "post",
                url: "/TSEntry/InsertTSEntry",
                datatype: "json",
                data: JSON.stringify($scope.TSEntry)
            })
                //give a response to the user, to the view
                .then(function (response) {//sets the angular side
                    alert(response.data);
                    $scope.GetTimeSheetEntriesByDate();
                    $scope.GetTimeSheetEntriesByPreviousDate();
                    //$scope.TSEntryID = "";
                    $scope.EmployeeID = "";
                    //calls the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
                    var formattedDate = setTimePreviousDay();
                    //sets the date to yesterday after each insert has been made
                    $scope.Date = formattedDate;
                    $scope.StartTime = "";
                    $scope.EndTime = "";
                    $scope.ProdZoneID = "";
                    $scope.EquipmentMeterReading = "";
                    $scope.EquipmentNumber = "";
                    $scope.ImplementNumber = "";
                    $scope.Task_WO_ID = "";
                    $scope.FieldNumber = "";
                })
        }//if statement end
        //else if the value is Update, which it is, as it was changed to "Update" by the main Update method. 
        //There are actually 2 Update Method-sections; the main update method populates the form with values, and visually styles everything so it appears that a new update form popped up
        //The secondary update captures the forms populated values, inserting them into a new object, and posts that object to the mvc controller-action method, it also styles it back to Add New Entry format
        else if (Action == "Update") {
            $scope.TSEntry = {};
            $scope.TSEntry.TSEntryID = $scope.TSEntryID;
            $scope.TSEntry.EmployeeID = $scope.EmployeeID;
            $scope.TSEntry.Date = $scope.Date;
            $scope.TSEntry.StartTime = $scope.StartTime;
            $scope.TSEntry.EndTime = $scope.EndTime;
            $scope.TSEntry.ProdZoneID = $scope.ProdZoneID;
            $scope.TSEntry.EquipmentMeterReading = $scope.EquipmentMeterReading;
            $scope.TSEntry.EquipmentNumber = $scope.EquipmentNumber;
            $scope.TSEntry.ImplementNumber = $scope.ImplementNumber;
            $scope.TSEntry.Task_WO_ID = $scope.Task_WO_ID;
            $scope.TSEntry.FieldNumber = $scope.FieldNumber;
            //posts object to MVC
            $http({
                method: "post",
                url: "/TSEntry/UpdateTSEntry",
                datatype: "json",
                data: JSON.stringify($scope.TSEntry)
            })
                //if the object is successfully posted
                .then(function (response) {
                    //post an alert saying everything has been added successfully.
                    alert(response.data);
                    //call methods to refresh the data
                    $scope.GetTimeSheetEntriesByDate();
                    $scope.GetTimeSheetEntriesByPreviousDate();
                    //set the form fields to empty strings
                    $scope.EmployeeID = "";
                    //call the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
                    var formattedDate = setTimePreviousDay();
                    $scope.Date = formattedDate;
                    $scope.StartTime = "";
                    $scope.EndTime = "";
                    $scope.ProdZoneID = "";
                    $scope.EquipmentMeterReading = "";
                    $scope.EquipmentNumber = "";
                    $scope.ImplementNumber = "";
                    $scope.Task_WO_ID = "";
                    $scope.FieldNumber = "";

                    //visually style everything to look and function as the Add Entry form again.
                    //formats and adds an event listener to the Save/Submit button. When a person either mouses over or leaves/"outs" a button, the related method is called
                    document.getElementById("btnSave").onmouseover = function () { mouseOverUpdateButton() };
                    document.getElementById("btnSave").onmouseout = function () { mouseOutUpdateButton() };
                    function mouseOverUpdateButton() {
                        document.getElementById("btnSave").style.backgroundColor = "#ffcf66";
                        document.getElementById("btnSave").style.fontWeight = "100";
                    }
                    function mouseOutUpdateButton() {
                        document.getElementById("btnSave").style.backgroundColor = "#ffdf99";
                        document.getElementById("btnSave").style.fontWeight = "100";
                    }
                    //sets the values of Save button back to default Add Entry section.
                    document.getElementById("btnSave").setAttribute("value", "Submit");
                    //visually styles everything
                    //button background back to light orange
                    document.getElementById("btnSave").style.backgroundColor = "#ffdf99";
                    //text color back to dark grey
                    document.getElementById("btnSave").style.color = "darkslategrey";
                    //font weight back to ordinary
                    document.getElementById("btnSave").style.fontWeight = "100";

                    //formats and adds an event listener to the Cancel button. When a person either mouses over or leaves/"outs" a button, the related method is called
                    document.getElementById("btnCancel").onmouseover = function () { mouseOverCancelButton() };
                    document.getElementById("btnCancel").onmouseout = function () { mouseOutCancelButton() };
                    function mouseOverCancelButton() {
                        document.getElementById("btnCancel").style.backgroundColor = "#ffcf66";
                        document.getElementById("btnCancel").style.fontWeight = "100";
                    }
                    function mouseOutCancelButton() {
                        document.getElementById("btnCancel").style.backgroundColor = "#ffdf99";
                        document.getElementById("btnCancel").style.fontWeight = "100";
                    }
                    //visually styles everything
                    //button background back to light orange
                    document.getElementById("btnCancel").style.backgroundColor = "#ffdf99";
                    //text color back to dark grey
                    document.getElementById("btnCancel").style.color = "darkslategrey";
                    document.getElementById("btnCancel").style.fontWeight = "100";

                    //sets overall visual values of AddNewEntry form
                    //div background back to light blue
                    document.getElementById("AddNewEntry").style.backgroundColor = "#eaeffa";
                    //header text back to Add Entry
                    document.getElementById("AddUpdateNewEntryHeader").innerHTML = "Add Entry";
                    //header text color back to light blue
                    document.getElementById("AddUpdateNewEntryHeader").style.color = "#a7b1c6";
                    //border color back to light blue
                    document.getElementById("AddNewEntry").style.borderColor = "#eaeffa";
                })
        }
    };


    //Update TSEntry
    //passing in already-existing employee object
    $scope.UpdateTSEntry = function (TSEntry) {
        console.log("UpdateTSEntry function reached");

        //onclick Update button, each value populates the fields of the Add New Entry form, now becoming the Update Entry form
        $scope.TSEntryID = TSEntry.TSEntryID;
        $scope.EmployeeID = TSEntry.EmployeeID;       

        var EmpDateInJSObj = new Date(TSEntry.Date);
        var entryDateMonth = EmpDateInJSObj.getMonth() + 1;
        var entryDateDay = EmpDateInJSObj.getDate();
        var entryDateYear = EmpDateInJSObj.getFullYear();

        //adds a leading 0 to any month-date or day-date under or equal to 9
        if (entryDateMonth <= 9) {
            entryDateMonth = "0" + entryDateMonth;
        }
        else {
            entryDateMonth = entryDateMonth;
        }
        if (entryDateDay <= 9) {
            entryDateDay = "0" + entryDateDay;
        }
        else {
            entryDateDay = entryDateDay;
        }

        
        var formattedUpdateEntryDate = entryDateMonth + "-" + entryDateDay + "-" + entryDateYear;
        $scope.Date = formattedUpdateEntryDate;

        //$scope.Date = TSEntry.Date;







        //formats start time, within TSEntry object, from Miicrosoft-JSON to standard and customized JSON, and displays it in the Update form
        // determines if the Start Time Hour is in AM or PM
        //changes morning of 0 or 00 to standard of 12 
        //adds a leading 0 to any hour under or equal to 9
        //adds a leading 0 to any minute under or equal to 9
        //formats the AM and PM onto the startTime
        var EmpStartTimeInJSObj = new Date(TSEntry.StartTime);
        var startTmHr = EmpStartTimeInJSObj.getHours();
        var startAmPm = (startTmHr >= 12) ? "PM" : "AM";
        if (startTmHr == "0" || startTmHr == "00") {
            startTmHr = "12";
        }
        else if (startTmHr == "13") {
            startTmHr = "1";
        }
        else if (startTmHr == "14") {
            startTmHr = "2";
        }
        else if (startTmHr == "15") {
            startTmHr = "3";
        }
        else if (startTmHr == "16") {
            startTmHr = "4";
        }
        else if (startTmHr == "17") {
            startTmHr = "5";
        }
        else if (startTmHr == "18") {
            startTmHr = "6";
        }
        else if (startTmHr == "19") {
            startTmHr = "7";
        }
        else if (startTmHr == "20") {
            startTmHr = "8";
        }
        else if (startTmHr == "21") {
            startTmHr = "9";
        }
        else if (startTmHr == "22") {
            startTmHr = "10";
        }
        else if (startTmHr == "23") {
            startTmHr = "11";
        }
        var startTmMin = EmpStartTimeInJSObj.getMinutes();
        var startTmSec = EmpStartTimeInJSObj.getSeconds();
        if (startTmHr <= 9) {
            startTmHr = "0" + startTmHr;
        }
        else {
            startTmHr = startTmHr;
        }
        if (startTmMin <= 9) {
            startTmMin = "0" + startTmMin;
        }
        else {
            startTmMin = startTmMin;
        }
        var formattedStartTime = startTmHr + ":" + startTmMin + " " + startAmPm;
        $scope.StartTime = formattedStartTime;

        //formats end time, within TSEntry object, from Miicrosoft-JSON to standard and customized JSON, and displays it in the Update form        
        //uses same logic as EmpStartTime
        var EmpEndTimeInJSObj = new Date(TSEntry.EndTime);
        var endTmHr = EmpEndTimeInJSObj.getHours();
        var endAmPm = (endTmHr >= 12) ? "PM" : "AM";
        if (endTmHr == "0" || endTmHr == "00") {
            endTmHr = "12";
        }
        else if (endTmHr == "13") {
            endTmHr = "1";
        }
        else if (endTmHr == "14") {
            endTmHr = "2";
        }
        else if (endTmHr == "15") {
            endTmHr = "3";
        }
        else if (endTmHr == "16") {
            endTmHr = "4";
        }
        else if (endTmHr == "17") {
            endTmHr = "5";
        }
        else if (endTmHr == "18") {
            endTmHr = "6";
        }
        else if (endTmHr == "19") {
            endTmHr = "7";
        }
        else if (endTmHr == "20") {
            endTmHr = "8";
        }
        else if (endTmHr == "21") {
            endTmHr = "9";
        }
        else if (endTmHr == "22") {
            endTmHr = "10";
        }
        else if (endTmHr == "23") {
            endTmHr = "11";
        }
        var endTmMin = EmpEndTimeInJSObj.getMinutes();
        var endTmSec = EmpEndTimeInJSObj.getSeconds();
        if (endTmHr <= 9) {//adds a leading 0 to any hour under or equal to 9
            endTmHr = "0" + endTmHr;
        }
        else {
            endTmHr = endTmHr;
        }
        if (endTmMin <= 9) {//adds a leading 0 to any minute under or equal to 9
            endTmMin = "0" + endTmMin;
        }
        else {
            endTmMin = endTmMin;
        }
        var formattedEndTime = endTmHr + ":" + endTmMin + " " + endAmPm;
        $scope.EndTime = formattedEndTime;

        $scope.ProdZoneID = TSEntry.ProdZoneID;
        $scope.EquipmentMeterReading = TSEntry.EquipmentMeterReading;
        $scope.EquipmentNumber = TSEntry.EquipmentNumber;
        $scope.ImplementNumber = TSEntry.ImplementNumber;
        $scope.Task_WO_ID = TSEntry.Task_WO_ID;
        $scope.FieldNumber = TSEntry.FieldNumber;

        //when the user clicks on the save button, set the value to Update so that the InserNewEntry function can use the same button for its internal Update New Entry function,
        //sets the default visual state of the Update button
        document.getElementById("btnSave").setAttribute("value", "Update");
        document.getElementById("btnSave").style.backgroundColor = "#8a93a8";
        document.getElementById("btnSave").style.color = "White";     
        document.getElementById("btnSave").style.fontWeight = "900";
        //formats and adds an event listener the Save/Submit button, when a person either mouses over or leaves/outs a button, the related method is called
        document.getElementById("btnSave").onmouseover = function () { mouseOverUpdateButton() };
        document.getElementById("btnSave").onmouseout = function () { mouseOutUpdateButton() }; 
        function mouseOverUpdateButton() {
            document.getElementById("btnSave").style.backgroundColor = "#576075";
            document.getElementById("btnSave").style.fontWeight = "900";
        }
        function mouseOutUpdateButton() {
            document.getElementById("btnSave").style.backgroundColor = "#8a93a8";
            document.getElementById("btnSave").style.fontWeight = "900";
        }
        //sets the default visual state of the Cancel button
        document.getElementById("btnCancel").style.backgroundColor = "#8a93a8";
        document.getElementById("btnCancel").style.color = "White";
        document.getElementById("btnCancel").style.fontWeight = "900";
        //formats and adds an event listener the Cancel button, when a person either mouses over or leaves/outs a button, the related method is called
        document.getElementById("btnCancel").onmouseover = function () { mouseOverCancelButton() };
        document.getElementById("btnCancel").onmouseout = function () { mouseOutCancelButton() };
        function mouseOverCancelButton() {
            document.getElementById("btnCancel").style.backgroundColor = "#576075";
            document.getElementById("btnCancel").style.fontWeight = "900";
        }
        function mouseOutCancelButton() {
            document.getElementById("btnCancel").style.backgroundColor = "#8a93a8";
            document.getElementById("btnCancel").style.fontWeight = "900";
        }
        //styles the other elements of the AddNewEntry box
        document.getElementById("AddNewEntry").style.backgroundColor = "#ffe7b3";
        document.getElementById("AddNewEntry").style.borderColor = "#ffe7b3";
        document.getElementById("AddUpdateNewEntryHeader").innerHTML = "Update Entry";
        document.getElementById("AddUpdateNewEntryHeader").style.color = "#c9bb9c";
    }


    //delete data, based on whole object
    //javascript used to confirm delete. If confirm, post to MVC. if not confirm, just goes back to screen
    //posts the the object to the mvc api url as a JSON object
    //MVC controller then sends back data to db
    //then gives a response to the client, refreshing the data
    $scope.DeleteTSEntry = function (TSEntry) {
        console.log("DeleteTSEntry function reached");
        if (confirm("Confirm Delete?")) {
            $http({
                method: "post",
                url: "/TSEntry/DeleteTSEntry",
                datatype: "json",
                data: JSON.stringify(TSEntry)
            }).then(function (response) {
                 $scope.GetTimeSheetEntriesByDate();
            })
        }
        else {
            //goes back to screen
        }
    };


    //cancels the data submission, sets each state back to blank, reloads the data by date
    $scope.CancelTSEntry = function () {
        //javascript just reloads the page again
        //location.reload();

        //var Action = document.getElementById("btnCancel");//gets the cancel button reference
        //resets the data in the Add New Entry area
        //$scope.GetAllTSEntry();
        console.log("CancelTSEntry function reached");
        $scope.TSEntryID = "";
        $scope.EmployeeID = "";
        //calls the setTimePreviousDay() function, saving the previous day's value in the formattedDate variable
        var formattedDate = setTimePreviousDay();
        $scope.Date = formattedDate;
        $scope.StartTime = "";
        $scope.EndTime = "";
        $scope.ProdZoneID = "";
        $scope.EquipmentMeterReading = "";
        $scope.EquipmentNumber = "";
        $scope.ImplementNumber = "";
        $scope.Task_WO_ID = "";
        $scope.FieldNumber = "";

        //visually style everything to look and function as the Add Entry form again.
        //formats and adds an event listener to the Save/Submit button. When a person either mouses over or leaves/"outs" a button, the related method is called
        document.getElementById("btnSave").onmouseover = function () { mouseOverUpdateButton() };
        document.getElementById("btnSave").onmouseout = function () { mouseOutUpdateButton() };
        function mouseOverUpdateButton() {
            document.getElementById("btnSave").style.backgroundColor = "#ffcf66";
            document.getElementById("btnSave").style.fontWeight = "100";
        }
        function mouseOutUpdateButton() {
            document.getElementById("btnSave").style.backgroundColor = "#ffdf99";
            document.getElementById("btnSave").style.fontWeight = "100";
        }
        //sets the values of Save button back to default Add Entry section.
        document.getElementById("btnSave").setAttribute("value", "Submit");
        //visually styles everything
        //button background back to light orange
        document.getElementById("btnSave").style.backgroundColor = "#ffdf99";
        //text color back to dark grey
        document.getElementById("btnSave").style.color = "darkslategrey";
        //font weight back to ordinary
        document.getElementById("btnSave").style.fontWeight = "100";

        //formats and adds an event listener to the Cancel button. When a person either mouses over or leaves/"outs" a button, the related method is called
        document.getElementById("btnCancel").onmouseover = function () { mouseOverCancelButton() };
        document.getElementById("btnCancel").onmouseout = function () { mouseOutCancelButton() };
        function mouseOverCancelButton() {
            document.getElementById("btnCancel").style.backgroundColor = "#ffcf66";
            document.getElementById("btnCancel").style.fontWeight = "100";
        }
        function mouseOutCancelButton() {
            document.getElementById("btnCancel").style.backgroundColor = "#ffdf99";
            document.getElementById("btnCancel").style.fontWeight = "100";
        }
        //visually styles everything
        //button background back to light orange
        document.getElementById("btnCancel").style.backgroundColor = "#ffdf99";
        //text color back to dark grey
        document.getElementById("btnCancel").style.color = "darkslategrey";
        document.getElementById("btnCancel").style.fontWeight = "100";

        //sets overall visual values of AddNewEntry form
        //div background back to light blue
        document.getElementById("AddNewEntry").style.backgroundColor = "#eaeffa";
        //header text back to Add Entry
        document.getElementById("AddUpdateNewEntryHeader").innerHTML = "Add Entry";
        //header text color back to light blue
        document.getElementById("AddUpdateNewEntryHeader").style.color = "#a7b1c6";
        //border color back to light blue
        document.getElementById("AddNewEntry").style.borderColor = "#eaeffa";

        //reloads the data again
        $scope.GetTimeSheetEntriesByDate();
    };
})