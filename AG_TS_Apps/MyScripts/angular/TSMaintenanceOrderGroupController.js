//new app, added pagination dependency, injecting a library of functions, also add ngMessages, another library of functions
var app = angular.module("maintenanceOrderGroupApp", ['angularUtils.directives.dirPagination', 'ngMessages']);

app.controller("maintenanceOrderGroupCtrl", function ($scope, $http, $location, $anchorScroll) {
    //debugger;

    //sorts the table by their heading, either ascending or descending
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //Tables for Searches
    //Web API that gets all the MaintOrdGroup data, mirroring MVC's action-method
    $scope.GetMaintOrdGroup = function () {
        console.log("GetMaintOrdGroup function reached");
        $http({
            method: "get",
            url: "/TSMaintenanceOrderGroup/GetMaintOrdGroup"
        }).then(function (response) {
            $scope.tsmaintenanceordergroup = JSON.parse(response.data);
            //change the header-text
            document.getElementById("maintOrdGroupHeader").innerHTML = "Maintenance Order Groups";
        });
    };


    //Get the Data related to Button selected
    $scope.GetMaintOrdGroupByTA_Code = function () {
        console.log("GetMaintOrdGroupByTA_Code function reached");
        $scope.MaintOrdGroupByTA_Code = {};
        $scope.MaintOrdGroupByTA_Code.TA_Code = $scope.TA_Code;

        //error handling for TA_Code search
        //error handling for blank form, variables
        var refToMessage = document.getElementById("TA_Code_Search_Error"); //reference to front-end span error message
        refToMessage.innerHTML = ""; //sets the text to blank
        var tA_Code_User_Value = document.getElementById("GetMaintOrdGroupByTA_CodeInput").value;//gets the user's selected value
        var TA_Code_Same_TrueFalse = false;

        //gets all of the json data, with its objects and encapsulates it into local angularjs object
        $http({
            method: "get",
            url: "/TSMaintenanceOrderGroup/GetMaintOrdGroup"
        }).then(function (response) {
            $scope.tsmaintenanceordergroup = JSON.parse(response.data);
        }); 

        //searches through the json data, comparing the user's value to all of the other values
        //when the values are the same, it stops, and says "hey, I found this same code, it's already in the db",
        //(i.e. it sets TA_Code_Same_TrueFalse to true when found, false when not found)
        for (var i = 0; i < $scope.tsmaintenanceordergroup.length; i++) {
            //if the objects ta code value is equal to the user's selected value...
            if ($scope.tsmaintenanceordergroup[i].TA_Code == tA_Code_User_Value) {
                //...set the var as true, and break out of the loop
                TA_Code_Same_TrueFalse = true;
                break;
            }
            //else, set the var to false
            else {
                TA_Code_Same_TrueFalse = false;
            }
        }

        //if-else statements used for error handling
        //if the user doesn't put in any value
        if (tA_Code_User_Value == "") {
            refToMessage.innerHTML = "Enter an existing TA Code/ID";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("TA_Code_Search_Error").innerHTML = "";
            }, 2000);
        }
        //else if the user's new TA_Code is already in the db
        else if (TA_Code_Same_TrueFalse == false) {
            refToMessage.innerHTML = "Select a TA Code/ID from the list. ";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("TA_Code_Search_Error").innerHTML = "";
            }, 2000);
        }

        //else, if everthing is all right, post the data to the db, and when you get the json object back, send it to the front-end
        else {
            $http({
                method: "post",
                url: "/TSMaintenanceOrderGroup/GetMaintOrdGroupByTA_Code",
                datatype: "json",
                data: JSON.stringify($scope.MaintOrdGroupByTA_Code)
            })
                .then(function (response) {
                    $scope.maintordgroupbyta_code = JSON.parse(response.data);
                    //change the header-text
                    document.getElementById("maintOrdGroupHeader").innerHTML = "Maintenance Order Group By ID/TA";
                })
        }
    };


    //Create/Insert Function
    $scope.InsertMaintOrdGroup = function () {
        console.log("InsertMaintOrdGroup function reached");
        //gets a reference to the save button, and stores its value. This forms the basis of using one button to switch contextually from Submit to Update
        var Action = document.getElementById("btnSave").getAttribute("value");

        //if it's the Submit button, submit the data to the db
        if (Action === "Submit") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="Whatever" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.MaintOrdGroup = {};
            $scope.MaintOrdGroup.TA_Code = $scope.TA_Code;
            $scope.MaintOrdGroup.MaintOrdGrp = $scope.MaintOrdGrp;

            //error handling for Task Assignment Code/ID input
            //stores the value of the reference-message
            var refToMessage;
            //stores the user's input value, just like binding with angularjs
            var tA_Code_User_Value;
            //stores the user's input value as an int
            var tA_Code_User_Value_Check_Int_Status;
            //get reference to message
            refToMessage = document.getElementById("TA_Code_Error");
            //sets the error message to blank initially
            refToMessage.innerHTML = "";
            tA_Code_User_Value = document.getElementById("TA_Code").value;
            //if user value is NaN (not a number, like "a5tad"), it will store true
            tA_Code_User_Value_Check_Int_Status = isNaN(tA_Code_User_Value);

            //error handling for Task Assignment Code/ID input, this searches to see whether the new TA_Code the user chooses isnt already inside the json object
            //gets all of the json data from the db, and encapsulates it into an object
            $http({
                method: "get",
                url: "/TSMaintenanceOrderGroup/GetMaintOrdGroup"
            }).then(function (response) {
                $scope.tsmaintenanceordergroup = JSON.parse(response.data);
            });
            //gets the user's choice
            var TA_Code_UserChoice = $scope.TA_Code;
            //sets the initial value of TA_Code_Same_TrueFalse to false. 
            //If the user's choice matches any of the objects sub-objects (i.e. 236 and 236),
            //then set the TA_Code_UserChoice to true
            //else, set it to false
            var TA_Code_Same_TrueFalse = false;
            //loop through the breadth of the data/json object
            for (var i = 0; i < $scope.tsmaintenanceordergroup.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsmaintenanceordergroup[i].TA_Code == TA_Code_UserChoice) {
                    //...set the var as true, and break out of the loop
                    TA_Code_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    TA_Code_Same_TrueFalse = false;
                }
            }

            //error handling for Maintenance Order Group input
            //stores the value of the reference-message
            var refToMessage_MaintOrdGroup;
            //stores the user's input value, just like binding with angularjs
            var maintOrdGroup_User_Value;
            //get reference to message
            refToMessage_MaintOrdGroup = document.getElementById("MaintOrdGrp_Error");
            //sets the error message to blank initially
            refToMessage_MaintOrdGroup.innerHTML = "";
            //gets the user's value
            maintOrdGroup_User_Value = document.getElementById("MaintOrdGrp").value;
            
            //error handling for all inputs integrated in this section
            //if the user doesn't put in any value
            if (tA_Code_User_Value == "") {
                refToMessage.innerHTML = "Enter a New TA Code/ID";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }
            else if (tA_Code_User_Value == 0) {
                refToMessage.innerHTML = "Do not enter 0 as a TA Code/ID";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }

            //else if the user's new TA_Code is already in the db
            else if (TA_Code_Same_TrueFalse == true) {
                refToMessage.innerHTML = "Enter a Unique TA Code/ID. That TA Code/ID already exists. ";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value isn't completely a number
            else if (tA_Code_User_Value_Check_Int_Status == true) {
                refToMessage.innerHTML = "Enter Numbers Only";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }

            //else if the user's value isn't blank
            else if (maintOrdGroup_User_Value == "") {
                refToMessage_MaintOrdGroup.innerHTML = "Enter a Maintenance Order Group";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("MaintOrdGrp_Error").innerHTML = "";
                }, 2000);
            }

            else {
                //posts data to MVC Web API as JSON-format
                $http({
                    method: "post",
                    url: "/TSMaintenanceOrderGroup/InsertMaintOrdGroup",
                    datatype: "json",
                    data: JSON.stringify($scope.MaintOrdGroup)
                })
                    //once posted, gives a response to the user/view
                    .then(function (response) {
                        if (response.data == "Added") {
                            //sets the users confirmation message with green text, next to the submit and cancel buttons
                            document.getElementById("submit_Confirm").innerHTML = response.data;
                            //set the text color to green
                            document.getElementById("submit_Confirm").style.color = "#00b300";
                            document.getElementById("submit_Confirm").style.backgroundColor = "#e6ffe6";
                            //times out the confirmation message
                            setTimeout(function () {
                                document.getElementById("submit_Confirm").innerHTML = "";
                            }, 2000);
                            //gives the user an alert popup
                            //alert(response.data);

                            //calls the method to refresh the data
                            $scope.GetMaintOrdGroup();
                            //sets the fields to blank/emptyy strings
                            $scope.TA_Code = "";
                            $scope.MaintOrdGrp = "";
                        }
                        else {
                            //sets the users confirmation message with red text, next to the submit and cancel buttons
                            document.getElementById("submit_Confirm").innerHTML = response.data;
                            //set the text color to red
                            document.getElementById("submit_Confirm").style.color = "#ff6666";
                            document.getElementById("submit_Confirm").style.backgroundColor = "#ffe6e6";

                            //times out the confirmation message
                            setTimeout(function () {
                                document.getElementById("submit_Confirm").innerHTML = "";
                            }, 2000);
                        }
                    })
            }

        }

        //else if the button is update, bind the front-end and backend-fields together into an object,
        //pass that object to MVC's WebApi(ie "submit the data"), and give a response to the user/view which displays a popup and resets and restyles the form
        else if (Action == "Update") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="Whatever" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.MaintOrdGroup = {};
            $scope.MaintOrdGroup.TA_Code = $scope.TA_Code;
            $scope.MaintOrdGroup.MaintOrdGrp = $scope.MaintOrdGrp;

            //get a reference to the message
            var refToMessage = document.getElementById("TA_Code_Error");

            //error handling for all inputs integrated in this section
            //if the user doesn't put in any value
            if ($scope.TA_Code == "" || $scope.TA_Code == 0) {
                refToMessage.innerHTML = "Re-enter existing TA Code/ID only to Update or Press Cancel. Do not enter 0 or leave blank.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }
            else {
                //posts data to MVC Web API as JSON-format
                $http({
                    method: "post",
                    url: "/TSMaintenanceOrderGroup/UpdateMaintOrdGroup",
                    datatype: "json",
                    data: JSON.stringify($scope.MaintOrdGroup)
                })

                    //if the object is successfully posted, then
                    .then(function (response) {

                        if (response.data == "Updated") {
                            //sets the users confirmation message with green text, next to the submit and cancel buttons
                            document.getElementById("submit_Confirm").innerHTML = response.data;
                            //set the text color to green
                            document.getElementById("submit_Confirm").style.color = "#00b300";
                            document.getElementById("submit_Confirm").style.backgroundColor = "#e6ffe6";
                            //times out the confirmation message
                            setTimeout(function () {
                                document.getElementById("submit_Confirm").innerHTML = "";
                            }, 2000);
                            //post an alert saying everything has been added successfully.
                            //alert(response.data);
                            //call methods to refresh the data
                            $scope.GetMaintOrdGroup();
                            //sets the fields to blank/emptyy strings
                            $scope.TA_Code = "";
                            $scope.MaintOrdGrp = "";
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
                            document.getElementById("AddNewMaintOrdGroup").style.backgroundColor = "#eaeffa";
                            //border color back to light blue
                            document.getElementById("AddNewMaintOrdGroup").style.borderColor = "#eaeffa";
                            //header text back to Add
                            document.getElementById("AddUpdateNewMaintOrdGroupHeader").innerHTML = "Add Maintenance Order Group";
                            //header text color back to light blue
                            document.getElementById("AddUpdateNewMaintOrdGroupHeader").style.color = "#a7b1c6";

                        }

                        else {
                            //sets the users confirmation message with red text, next to the submit and cancel buttons
                            document.getElementById("submit_Confirm").innerHTML = response.data;
                            //set the text color to red
                            document.getElementById("submit_Confirm").style.color = "#ff6666";
                            document.getElementById("submit_Confirm").style.backgroundColor = "#ffe6e6";

                            //times out the confirmation message
                            setTimeout(function () {
                                document.getElementById("submit_Confirm").innerHTML = "";
                            }, 2000);
                            //post an alert saying everything has been added successfully.
                            //alert(response.data);
                            //call methods to refresh the data
                            $scope.GetMaintOrdGroup();
                        }

                    })



            }







        }
    };






    //Update MaintOrdGroup, passing in an object from the front-end/view. This is Part 1 of the Update logic. Part 2 is integrated into Insert TaskWO's logic
    $scope.UpdateMaintOrdGroup = function (MaintOrdGroup) {
        console.log("UpdateMaintOrdGroup function reached");
        //onclick Update button, each value populates the fields of the Add form, now becoming the Update form
        //on left: variable-reference-location of the Add form fields, on-right: imported properties of the object that was passed in 
        //in essence, this is just copying the values from the table's selected row and throwing it up in the equivalent Add form fields/inputs
        $scope.TA_Code = MaintOrdGroup.TA_Code;
        $scope.MaintOrdGrp = MaintOrdGroup.MaintOrdGrp;

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
        document.getElementById("AddNewMaintOrdGroup").style.backgroundColor = "#ffe7b3";
        document.getElementById("AddNewMaintOrdGroup").style.borderColor = "#ffe7b3";
        document.getElementById("AddUpdateNewMaintOrdGroupHeader").innerHTML = "Update Maintenance Order Group";
        document.getElementById("AddUpdateNewMaintOrdGroupHeader").style.color = "#c9bb9c";
    }





    //Delete object
    $scope.DeleteMaintOrdGroup = function (MaintOrdGroup) {
        console.log("DeleteMaintOrdGroup function reached");
        //javascript used to confirm delete. If confirm, post to MVC. if not confirm, just goes back to screen
        if (confirm("Confirm Delete?")) {
            $http({
                //posts the object to the mvc api url as a JSON object
                method: "post",
                url: "/TSMaintenanceOrderGroup/DeleteMaintOrdGroup",
                datatype: "json",
                data: JSON.stringify(MaintOrdGroup)
                //MVC controller then sends back data to db
                //then gives a response to the client, refreshing the data
            }).then(function (response) {
                //call methods to refresh the data
                $scope.GetMaintOrdGroup();
            })
        }
        else {
            //goes back to screen
        }
    };


    //cancels the data submission, sets each state back to blank, reloads the data by date
    $scope.CancelMaintOrdGroup = function () {
        //javascript just reloads the page again. This is the simplest option-solution, but has a clunky reload of the page
        //location.reload();
        console.log("CancelMaintOrdGroup function reached");
        //calls the method to refresh the data
        $scope.GetMaintOrdGroup();

        //resets the field-data in the Add form to blank/emptyy strings
        $scope.TA_Code = "";
        $scope.MaintOrdGrp = "";

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
        document.getElementById("AddNewMaintOrdGroup").style.backgroundColor = "#eaeffa";
        //border color back to light blue
        document.getElementById("AddNewMaintOrdGroup").style.borderColor = "#eaeffa";
        //header text back to Add form
        document.getElementById("AddUpdateNewMaintOrdGroupHeader").innerHTML = "Add Maintenance Order Group";
        //header text color back to light blue
        document.getElementById("AddUpdateNewMaintOrdGroupHeader").style.color = "#a7b1c6";

        //resets the error handling text to blank
        var refToMessage = document.getElementById("TA_Code_Error");
        refToMessage.innerHTML = "";
        var refToMessage_MaintOrdGroup = document.getElementById("MaintOrdGrp_Error");
        refToMessage_MaintOrdGroup.innerHTML = "";
    };
});