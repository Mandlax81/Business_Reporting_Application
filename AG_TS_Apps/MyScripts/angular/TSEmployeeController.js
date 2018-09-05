//new app, added pagination dependency, injecting a library of functions, also add ngMessages, another library of functions
var app = angular.module("employeeApp", ['angularUtils.directives.dirPagination', 'ngMessages']);

app.controller("employeeCtrl", function ($scope, $http, $location, $anchorScroll) {
    //debugger;

    //sorts the table by their heading, either ascending or descending
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //Tables    
    //Web API that gets all the Employee data, including active and inactive, mirroring MVC's action-method
    $scope.GetEmployeesAll = function () {
        console.log("GetEmployeesAll function reached");
        $http({
            method: "get",
            url: "/TSEmployee/GetEmployeesAll"
        }).then(function (response) {
            $scope.tsemployeesall = JSON.parse(response.data);
        });
    };

    //Web API that gets all the Active Employee data, mirroring MVC's action-method
    $scope.GetEmployeesActive = function () {
        console.log("GetEmployeesActive function reached");
        $http({
            method: "get",
            url: "/TSEmployee/GetEmployeesActive"
        }).then(function (response) {
            $scope.tsemployeesactive = JSON.parse(response.data);
            //change the header-text back to "Active Employees"
            document.getElementById("employeeHeader").innerHTML = "Active Employees";
        });
    };

    //Web API that gets all the Inactive Employee data, mirroring MVC's action-method
    $scope.GetEmployeesInactive = function () {
        console.log("GetEmployeesInactive function reached");
        $http({
            method: "get",
            url: "/TSEmployee/GetEmployeesInactive"
        }).then(function (response) {
            $scope.tsemployeesinactive = JSON.parse(response.data);
            //change the header-text back to "Inactive Employees"
            document.getElementById("employeeHeader").innerHTML = "Inactive Employees";
        });
    };


    
    //Get the Data related to Button selected
    $scope.GetEmployeesByEmployeeID = function () {
        console.log("GetEmployeesByEmployeeID function reached");
        $scope.Employee = {};
        $scope.Employee.EmployeeID = $scope.EmployeeID;
        $http({
            method: "post",
            url: "/TSEmployee/GetEmployeesByEmployeeID",
            datatype: "json",
            data: JSON.stringify($scope.Employee)
        })
            .then(function (response) {
                //if the data is empty/null (i.e. 0 length), display a popup for the user to pick a different id
                if (response.data.length != "0") {                    
                    $scope.tsemployeesbyemployeeid = JSON.parse(response.data);
                    //change the header-text back to "Employee by ID"
                    document.getElementById("employeeHeader").innerHTML = "Active Employee By ID";
                }
                else if (response.data.length == "0") {
                    alert("No Employee for that ID. Select a different Employee ID.");
                    //change the header-text back to "Employee by ID"
                    document.getElementById("employeeHeader").innerHTML = "Active Employee By ID";
                }
            })
    };



    //Get the Data related to Button selected
    $scope.GetEmployeesByEmployeeIDInactive = function () {
        console.log("GetEmployeesByEmployeeIDInactive function reached");
        $scope.Employee = {};
        $scope.Employee.EmployeeID = $scope.EmployeeID;
        $http({
            method: "post",
            url: "/TSEmployee/GetEmployeesByEmployeeIDInactive",
            datatype: "json",
            data: JSON.stringify($scope.Employee)
        })
            .then(function (response) {
                //if the data is empty/null (i.e. 0 length), display a popup for the user to pick a different id
                if (response.data.length != "0") {
                    $scope.tsemployeesbyemployeeidinactive = JSON.parse(response.data);
                    //change the header-text back to "Employee by ID"
                    document.getElementById("employeeHeader").innerHTML = "Inactive Employee By ID";
                }
                else if (response.data.length == "0") {
                    alert("No Employee for that ID. Select a different Employee ID.");
                    //change the header-text back to "Employee by ID"
                    document.getElementById("employeeHeader").innerHTML = "Inactive Employee By ID";
                }
            })
    };




        ////Get the Data related to Button selected
    //$scope.GetEmployeesByEmployeeID = function () {
    //    console.log("GetEmployeesByEmployeeID function reached");
    //    $scope.Employee = {};
    //    $scope.Employee.EmployeeID = $scope.EmployeeID;
    //    $http({
    //        method: "post",
    //        url: "/TSEmployee/GetEmployeesByEmployeeID",
    //        datatype: "json",
    //        data: JSON.stringify($scope.Employee)
    //    })
    //        .then(function (response) {
    //            //if there is data
    //            if (response.data != "[]") {

    //                //parses the Microsoft JSON data into ISO8601 JSON data
    //                var responseData = JSON.parse(response.data);
    //                //stores whether the employee is active (true) or inactive (false)
    //                var ActiveOrInactive = responseData[0].Active;  

    //                //if the employee in inactive (i.e. false) 
    //                if (ActiveOrInactive == false) {
    //                    //post the data plainly
    //                    $scope.tsemployeesbyemployeeid = JSON.parse(response.data);
    //                    document.getElementById("employeeHeader").innerHTML = "Inactive Employees";      
    //                }
    //                else if (ActiveOrInactive == true) {
    //                    //post the data plainly
    //                    $scope.tsemployeesbyemployeeid = JSON.parse(response.data);
    //                    document.getElementById("employeeHeader").innerHTML = "Active Employees";
    //                }
    //            }
    //            else if (response.data == "[]") {
    //                alert("No Employee for that ID. Select a different Employee ID.");
    //                //change the header-text back to "Employee by ID"
    //                document.getElementById("employeeHeader").innerHTML = "Employee By ID";
    //            }
    //        })
    //};


    //Create/Insert Function
    $scope.InsertEmployee = function () {
        console.log("InsertEmployee function reached");
        //gets a reference to the save button, and stores its value. This forms the basis of using one button to switch contextually from Submit to Update
        var Action = document.getElementById("btnSave").getAttribute("value");

        //if it's the Submit button, submit the data to the db
        if (Action === "Submit") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="Whatever" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.Employee = {};
            $scope.Employee.EmployeeID = $scope.EmployeeID;
            $scope.Employee.ShortEmployeeID = $scope.ShortEmployeeID;
            $scope.Employee.EmployeeName = $scope.EmployeeName;
            $scope.Employee.CostCtr = $scope.CostCtr;
            $scope.Employee.CostCenter = $scope.CostCenter;
            $scope.Employee.OrganizationalUnit = $scope.OrganizationalUnit;
            $scope.Employee.EmployeeSubGroup = $scope.EmployeeSubGroup;
            $scope.Employee.Job = $scope.Job;
            $scope.Employee.PSubArea = $scope.PSubArea;
            $scope.Employee.PersonnelSubArea = $scope.PersonnelSubArea;
            $scope.Employee.EmployeeGroup = $scope.EmployeeGroup;
            $scope.Employee.ActivityType = $scope.ActivityType;
            $scope.Employee.WorkCenter = $scope.WorkCenter;
            $scope.Employee.Active = $scope.Active;

            //posts data to MVC Web API as JSON-format
            $http({
                method: "post",
                url: "/TSEmployee/InsertEmployee",
                datatype: "json",
                data: JSON.stringify($scope.Employee)
            })
                //once posted, gives a response to the user/view
                .then(function (response) {
                    //alert popup box, the message comes from the response message it gets from MVC
                    alert(response.data);
                    //calls the method to refresh the data
                    $scope.GetEmployeesAll();
                    $scope.GetEmployeesActive();
                    //sets the fields to blank/emptyy strings
                    $scope.EmployeeID = "";
                    $scope.ShortEmployeeID = "";
                    $scope.EmployeeName = "";
                    $scope.CostCtr = "";
                    $scope.CostCenter = "";
                    $scope.OrganizationalUnit = "";
                    $scope.EmployeeSubGroup = "";
                    $scope.Job = "";
                    $scope.PSubArea = "";
                    $scope.PersonnelSubArea = "";
                    $scope.EmployeeGroup = "";
                    $scope.ActivityType = "";
                    $scope.WorkCenter = "";
                    $scope.Active = "";
                })
        }

        //else if the button is update, bind the front-end and backend-fields together into an object,
        //pass that object to MVC's WebApi(ie "submit the data"), and give a response to the user/view which displays a popup and resets and restyles the form
        else if (Action == "Update") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="EquipmentNumber" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.Employee = {};
            $scope.Employee.EmployeeID = $scope.EmployeeID;
            $scope.Employee.ShortEmployeeID = $scope.ShortEmployeeID;
            $scope.Employee.EmployeeName = $scope.EmployeeName;
            $scope.Employee.CostCtr = $scope.CostCtr;
            $scope.Employee.CostCenter = $scope.CostCenter;
            $scope.Employee.OrganizationalUnit = $scope.OrganizationalUnit;
            $scope.Employee.EmployeeSubGroup = $scope.EmployeeSubGroup;
            $scope.Employee.Job = $scope.Job;
            $scope.Employee.PSubArea = $scope.PSubArea;
            $scope.Employee.PersonnelSubArea = $scope.PersonnelSubArea;
            $scope.Employee.EmployeeGroup = $scope.EmployeeGroup;
            $scope.Employee.ActivityType = $scope.ActivityType;
            $scope.Employee.WorkCenter = $scope.WorkCenter;
            $scope.Employee.Active = $scope.Active;
            //posts data to MVC Web API as JSON-format
            $http({
                method: "post",
                url: "/TSEmployee/UpdateEmployee",
                datatype: "json",
                data: JSON.stringify($scope.Employee)
            })
                //if the object is successfully posted, then
                .then(function (response) {
                    //post an alert saying everything has been added successfully.
                    alert(response.data);
                    //call methods to refresh the data
                    $scope.GetEmployeesAll();
                    $scope.GetEmployeesActive();
                    $scope.GetEmployeesInactive();

                    //sets the fields to blank/emptyy strings
                    $scope.EmployeeID = "";
                    $scope.ShortEmployeeID = "";
                    $scope.EmployeeName = "";
                    $scope.CostCtr = "";
                    $scope.CostCenter = "";
                    $scope.OrganizationalUnit = "";
                    $scope.EmployeeSubGroup = "";
                    $scope.Job = "";
                    $scope.PSubArea = "";
                    $scope.PersonnelSubArea = "";
                    $scope.EmployeeGroup = "";
                    $scope.ActivityType = "";
                    $scope.WorkCenter = "";
                    $scope.Active = "";

                    //visually style everything to look and function as the Add form again.
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
                    //sets overall visual values of Add form
                    //div background back to light blue
                    document.getElementById("AddNewEmployee").style.backgroundColor = "#eaeffa";
                    //header text back to Add
                    document.getElementById("AddUpdateNewEmployeeHeader").innerHTML = "Add Employee";
                    //header text color back to light blue
                    document.getElementById("AddUpdateNewEmployeeHeader").style.color = "#a7b1c6";
                    //border color back to light blue
                    document.getElementById("AddNewEmployee").style.borderColor = "#eaeffa";
                })
        }
    };






    //Update Employee, passing in an Employee object from the front-end/view. This is Part 1 of the Update logic. Part 2 is integrated into Insert Employee's logic 
    $scope.UpdateEmployee = function (Employee) {
        console.log("UpdateEmployee function reached");
        //onclick Update button, each value populates the fields of the Add form, now becoming the Update form
        //on left: variable-reference-location of the Add form fields, on-right: imported properties of the object that was passed in 
        //in essence, this is just copying the values from the table's selected row and throwing it up in the equivalent Add form fields/inputs
        $scope.EmployeeID = Employee.EmployeeID;
        $scope.ShortEmployeeID = Employee.ShortEmployeeID;
        $scope.EmployeeName = Employee.EmployeeName;
        $scope.CostCtr = Employee.CostCtr;
        $scope.CostCenter = Employee.CostCenter;
        $scope.OrganizationalUnit = Employee.OrganizationalUnit;
        $scope.EmployeeSubGroup = Employee.EmployeeSubGroup;
        $scope.Job = Employee.Job;
        $scope.PSubArea = Employee.PSubArea;
        $scope.PersonnelSubArea = Employee.PersonnelSubArea;
        $scope.EmployeeGroup = Employee.EmployeeGroup;
        $scope.ActivityType = Employee.ActivityType;
        $scope.WorkCenter = Employee.WorkCenter;
        $scope.Active = Employee.Active;

        //when the user clicks on the save button, set the value to Update so that the Insert/Add function can use the same button for its internal Update function
        //sets the default Add visual state to the appearance of the Update state
        document.getElementById("btnSave").setAttribute("value", "Update");
        document.getElementById("btnSave").style.backgroundColor = "#8a93a8";
        document.getElementById("btnSave").style.color = "White";
        document.getElementById("btnSave").style.fontWeight = "900";
        //formats and adds an event listener the Save/Submit button. when a person either mouses over or leaves/outs a button, the related method is called
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
        //styles the other elements of the Add Equipment form-box
        document.getElementById("AddNewEmployee").style.backgroundColor = "#ffe7b3";
        document.getElementById("AddNewEmployee").style.borderColor = "#ffe7b3";
        document.getElementById("AddUpdateNewEmployeeHeader").innerHTML = "Update Equipment";
        document.getElementById("AddUpdateNewEmployeeHeader").style.color = "#c9bb9c";
    }


    //Delete object
    $scope.DeleteEmployee = function (Employee) {
        console.log("DeleteEmployee function reached");
        //javascript used to confirm delete. If confirm, post to MVC. if not confirm, just goes back to screen
        if (confirm("Confirm Delete?")) {
            $http({
                //posts the object to the mvc api url as a JSON object
                method: "post",
                url: "/TSEmployee/DeleteEmployee",
                datatype: "json",
                data: JSON.stringify(Employee)
                //MVC controller then sends back data to db
                //then gives a response to the client, refreshing the data
            }).then(function (response) {
                //call methods to refresh the data
                $scope.GetEmployeesAll();
                $scope.GetEmployeesActive();
                $scope.GetEmployeesInactive();
            })
        }
        else {
            //goes back to screen
        }
    };





    //cancels the data submission, sets each state back to blank, reloads the data by date
    $scope.CancelEmployee = function () {
        //javascript just reloads the page again. This is the simplest option-solution, but has a clunky reload of the page
        //location.reload();
        console.log("CancelEmployee function reached");
        //calls the method to refresh the data
        $scope.GetEmployeesAll();
        $scope.GetEmployeesActive();
        $scope.GetEmployeesInactive();

        //resets the field-data in the Add form to blank/emptyy strings
        $scope.EmployeeID = "";
        $scope.ShortEmployeeID = "";
        $scope.EmployeeName = "";
        $scope.CostCtr = "";
        $scope.CostCenter = "";
        $scope.OrganizationalUnit = "";
        $scope.EmployeeSubGroup = "";
        $scope.Job = "";
        $scope.PSubArea = "";
        $scope.PersonnelSubArea = "";
        $scope.EmployeeGroup = "";
        $scope.ActivityType = "";
        $scope.WorkCenter = "";
        $scope.Active = "";

        //visually style everything to look and function as the Add form again.
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

        //sets overall visual values of Add form
        //div background back to light blue
        document.getElementById("AddNewEmployee").style.backgroundColor = "#eaeffa";
        //border color back to light blue
        document.getElementById("AddNewEmployee").style.borderColor = "#eaeffa";
        //header text back to Add form
        document.getElementById("AddUpdateNewEmployeeHeader").innerHTML = "Add Equipment";
        //header text color back to light blue
        document.getElementById("AddUpdateNewEmployeeHeader").style.color = "#a7b1c6";
    };













});