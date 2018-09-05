//new app, added pagination dependency, injecting a library of functions, also add ngMessages, another library of functions
var app = angular.module("equipmentApp", ['angularUtils.directives.dirPagination', 'ngMessages']);

app.controller("equipmentCtrl", function ($scope, $http, $location, $anchorScroll) {
    //debugger;

    //sorts the table by their heading, either ascending or descending
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //Dropdowns
    //Web API that gets all the Equipment data, mirroring MVC's action-method
    $scope.GetEquipment = function () {
        console.log("GetEquipment function reached");
        $http({
            method: "get",
            url: "/TSEquipment/GetEquipment"
        }).then(function (response) {
            $scope.tsequipment = JSON.parse(response.data);
            //change the header-text
            document.getElementById("equipmentEntriesHeader").innerHTML = "All Equipment";
        });
    };


    //Get the Data related to Button selected
    $scope.GetEquipmentByEquipmentNumber = function () {
        console.log("GetEquipmentByEquipmentNumber function reached");
        $scope.Equipment = {};
        $scope.Equipment.EquipmentNumber = $scope.EquipmentNumber;
        $http({
            method: "post",
            url: "/TSEquipment/GetEquipmentByEquipmentNumber",
            datatype: "json",
            data: JSON.stringify($scope.Equipment)
        })
            .then(function (response) {
                //if the data is empty/null, display a popup for the user to pick a different equipment id
                if (response.data != "[]") {
                    $scope.tsequipmentbyequipmentnumber = JSON.parse(response.data);
                    //change the header-text
                    document.getElementById("equipmentEntriesHeader").innerHTML = "Equipment By ID";
                }
                else if (response.data == "[]") {
                    alert("No Equipment for that ID. Select a different Equipment ID.");
                    //change the header-text
                    document.getElementById("equipmentEntriesHeader").innerHTML = "Equipment By ID";
                }
            })
    };


    //Dropdowns
    //Web API that gets all the Equipment data by Type (i.e. Equipment or Implement, mirroring MVC's action-method
    $scope.GetEquipmentByType = function () {
        console.log("GetEquipmentByType function reached");
        $http({
            method: "get",
            url: "/TSEquipment/GetEquipmentByType"
        }).then(function (response) {
            $scope.tsequipmentbytype = JSON.parse(response.data);
        });
    };






    //Create/Insert Function
    $scope.InsertEquipment = function () {
        console.log("InsertEquipment function reached");
        //gets a reference to the save button, and stores its value. This forms the basis of using one button to switch contextually from Submit to Update
        var Action = document.getElementById("btnSave").getAttribute("value");

        //if it's the Submit button, submit the data to the db
        if (Action === "Submit") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="EquipmentNumber" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.Equipment = {};
            $scope.Equipment.EquipmentNumber = $scope.EquipmentNumber;
            $scope.Equipment.TechID = $scope.TechID;
            $scope.Equipment.CostCenter = $scope.CostCenter;
            $scope.Equipment.EquipDescription = $scope.EquipDescription;
            $scope.Equipment.EquipType = $scope.EquipType;
            $scope.Equipment.UserStatus = $scope.UserStatus;
            $scope.Equipment.Active = $scope.Active;
            $scope.Equipment.FunctionalLocation = $scope.FunctionalLocation;
            $scope.Equipment.FuncLocDescription = $scope.FuncLocDescription;
            $scope.Equipment.EquipClass = $scope.EquipClass;
            $scope.Equipment.WorkCenter = $scope.WorkCenter;
            $scope.Equipment.ActivityType = $scope.ActivityType;
            $scope.Equipment.MeasurementPoint = $scope.MeasurementPoint;
            $scope.Equipment.EquipmentOrImplement = $scope.EquipmentOrImplement;
            //posts data to MVC Web API as JSON-format
            $http({
                method: "post",
                url: "/TSEquipment/InsertEquipment",
                datatype: "json",
                data: JSON.stringify($scope.Equipment)
            })
            //once posted, gives a response to the user/view
            .then(function (response) {
                //alert popup box, the message comes from the response message it gets from MVC
                alert(response.data);
                //calls the method to refresh the data
                $scope.GetEquipment();
                //sets the fields to blank/emptyy strings
                $scope.EquipmentNumber = "";
                $scope.TechID = "";
                $scope.CostCenter = "";
                $scope.EquipDescription = "";
                $scope.EquipType = "";
                $scope.UserStatus = "";
                $scope.Active = "";
                $scope.FunctionalLocation = "";
                $scope.FuncLocDescription = "";
                $scope.EquipClass = "";
                $scope.WorkCenter = "";
                $scope.ActivityType = "";
                $scope.MeasurementPoint = "";
                $scope.EquipmentOrImplement = "";
            })
        }

        //else if the button is update, bind the front-end and backend-fields together into an object,
        //pass that object to MVC's WebApi(ie "submit the data"), and give a response to the user/view which displays a popup and resets and restyles the form
        else if (Action == "Update") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="EquipmentNumber" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.Equipment = {};
            $scope.Equipment.EquipmentNumber = $scope.EquipmentNumber;
            $scope.Equipment.TechID = $scope.TechID;
            $scope.Equipment.CostCenter = $scope.CostCenter;
            $scope.Equipment.EquipDescription = $scope.EquipDescription;
            $scope.Equipment.EquipType = $scope.EquipType;
            $scope.Equipment.UserStatus = $scope.UserStatus;
            $scope.Equipment.Active = $scope.Active;
            $scope.Equipment.FunctionalLocation = $scope.FunctionalLocation;
            $scope.Equipment.FuncLocDescription = $scope.FuncLocDescription;
            $scope.Equipment.EquipClass = $scope.EquipClass;
            $scope.Equipment.WorkCenter = $scope.WorkCenter;
            $scope.Equipment.ActivityType = $scope.ActivityType;
            $scope.Equipment.MeasurementPoint = $scope.MeasurementPoint;
            $scope.Equipment.EquipmentOrImplement = $scope.EquipmentOrImplement;
            //posts data to MVC Web API as JSON-format
            $http({
                method: "post",
                url: "/TSEquipment/UpdateEquipment",
                datatype: "json",
                data: JSON.stringify($scope.Equipment)
            })
                //if the object is successfully posted, then
                .then(function (response) {
                    //post an alert saying everything has been added successfully.
                    alert(response.data);
                    //call methods to refresh the data
                    $scope.GetEquipment();
                    //sets the fields to blank/emptyy strings
                    $scope.EquipmentNumber = "";
                    $scope.TechID = "";
                    $scope.CostCenter = "";
                    $scope.EquipDescription = "";
                    $scope.EquipType = "";
                    $scope.UserStatus = "";
                    $scope.Active = "";
                    $scope.FunctionalLocation = "";
                    $scope.FuncLocDescription = "";
                    $scope.EquipClass = "";
                    $scope.WorkCenter = "";
                    $scope.ActivityType = "";
                    $scope.MeasurementPoint = "";
                    $scope.EquipmentOrImplement = "";

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
                    document.getElementById("AddNewEquipment").style.backgroundColor = "#eaeffa";
                    //header text back to Add
                    document.getElementById("AddUpdateNewEquipmentHeader").innerHTML = "Add Equipment";
                    //header text color back to light blue
                    document.getElementById("AddUpdateNewEquipmentHeader").style.color = "#a7b1c6";
                    //border color back to light blue
                    document.getElementById("AddNewEquipment").style.borderColor = "#eaeffa";
                })
        }
    };



    //Update Equipment, passing in an Equipment object from the front-end/view. This is Part 1 of the Update logic. Part 2 is integrated into Insert Equipment's logic 
    $scope.UpdateEquipment = function (Equipment) {
        console.log("UpdateEquipment function reached");
        //onclick Update button, each value populates the fields of the Add form, now becoming the Update form
        //on left: variable-reference-location of the Add form fields, on-right: imported properties of the Equipment object that was passed in 
        //in essence, this is just copying the values from the table's selected row and throwing it up in the equivalent Add form fields/inputs
        $scope.EquipmentNumber = Equipment.EquipmentNumber;
        $scope.TechID = Equipment.TechID;
        $scope.CostCenter = Equipment.CostCenter;
        $scope.EquipDescription = Equipment.EquipDescription;
        $scope.EquipType = Equipment.EquipType; 
        $scope.UserStatus = Equipment.UserStatus;
        $scope.Active = Equipment.Active;
        $scope.FunctionalLocation = Equipment.FunctionalLocation;
        $scope.FuncLocDescription = Equipment.FuncLocDescription;
        $scope.EquipClass = Equipment.EquipClass;
        $scope.WorkCenter = Equipment.WorkCenter;
        $scope.ActivityType = Equipment.ActivityType;
        $scope.MeasurementPoint = Equipment.MeasurementPoint;
        $scope.EquipmentOrImplement = Equipment.EquipmentOrImplement; 

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
        document.getElementById("AddNewEquipment").style.backgroundColor = "#ffe7b3";
        document.getElementById("AddNewEquipment").style.borderColor = "#ffe7b3";
        document.getElementById("AddUpdateNewEquipmentHeader").innerHTML = "Update Equipment";
        document.getElementById("AddUpdateNewEquipmentHeader").style.color = "#c9bb9c";
    }


    //Delete object
    //javascript used to confirm delete. If confirm, post to MVC. if not confirm, just goes back to screen
    //posts the the object to the mvc api url as a JSON object
    //MVC controller then sends back data to db
    //then gives a response to the client, refreshing the data
    $scope.DeleteEquipment = function (Equipment) {
        console.log("DeleteEquipment function reached");
        if (confirm("Confirm Delete?")) {
            $http({
                method: "post",
                url: "/TSEquipment/DeleteEquipment",
                datatype: "json",
                data: JSON.stringify(Equipment)
            }).then(function (response) {
                $scope.GetEquipment();
            })
        }
        else {
            //goes back to screen
        }
    };


    //cancels the data submission, sets each state back to blank, reloads the data by date
    $scope.CancelEquipment = function () {
        //javascript just reloads the page again. This is the simplest option-solution, but has a clunky reload of the page
        //location.reload();
        console.log("CancelEquipment function reached");
        //calls the method to refresh the data
        $scope.GetEquipment();
        //resets the field-data in the Add form to blank/emptyy strings
        $scope.EquipmentNumber = "";
        $scope.TechID = "";
        $scope.CostCenter = "";
        $scope.EquipDescription = "";
        $scope.EquipType = "";
        $scope.UserStatus = "";
        $scope.Active = "";
        $scope.FunctionalLocation = "";
        $scope.FuncLocDescription = "";
        $scope.EquipClass = "";
        $scope.WorkCenter = "";
        $scope.ActivityType = "";
        $scope.MeasurementPoint = "";
        $scope.EquipmentOrImplement = "";

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
        document.getElementById("AddNewEquipment").style.backgroundColor = "#eaeffa";
        //border color back to light blue
        document.getElementById("AddNewEquipment").style.borderColor = "#eaeffa";
        //header text back to Add form
        document.getElementById("AddUpdateNewEquipmentHeader").innerHTML = "Add Equipment";
        //header text color back to light blue
        document.getElementById("AddUpdateNewEquipmentHeader").style.color = "#a7b1c6";
    };
});