//new app, added pagination dependency, injecting a library of functions, also add ngMessages, another library of functions
var app = angular.module("maintenanceOrderActivityApp", ['angularUtils.directives.dirPagination', 'ngMessages']);

app.controller("maintenanceOrderActivityCtrl", function ($scope, $http, $location, $anchorScroll) {
    //debugger;

    //sorts the table by their heading, either ascending or descending
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


    //Tables for Searches
    //Web API that gets all the MaintOrdActivity data, mirroring MVC's action-method
    $scope.GetMaintOrdActivity = function () {
        console.log("GetMaintOrdActivity function reached");
        $http({
            method: "get",
            url: "/TSMaintenanceOrderActivity/GetMaintOrdActivity"
        }).then(function (response) {
            $scope.tsmaintenanceorderactivity = JSON.parse(response.data);
            //change the header-text
            document.getElementById("maintOrdActivityHeader").innerHTML = "Maintenance Order Activities";
        });
    };





    //tables for searches
    //Get the Data related to Button selected
    $scope.GetMaintOrdActivityByTA_RecID = function () {
        console.log("GetMaintOrdActivityByTA_RecID function reached");
        $scope.MaintOrdActivityByTA_RecID = {};
        $scope.MaintOrdActivityByTA_RecID.TA_RecID = $scope.TA_RecID;
        //errror handling, get the relevant JSON data (i.e. the data from the dropdown)
        $http({
            method: "get",
            url: "/TSMaintenanceOrderActivity/GetMaintOrdActivity"
        }).then(function (response) {
            $scope.tsmaintenanceorderactivity = JSON.parse(response.data);
            //change the header-text
            document.getElementById("maintOrdActivityHeader").innerHTML = "Maintenance Order Activities";
        });
        //error handling for blank form, variables
        var refToMessage = document.getElementById("GetMaintOrdActivityByTA_RecID_Error"); 
        refToMessage.innerHTML = ""; //sets the text to blank
        var TA_RecID_User_Value = document.getElementById("GetMaintOrdActivityByTA_RecIDInput").value;//gets the user's selected value
        var TA_RecID_Same_TrueFalse = false;
        //error handling, search for existing value
        for (var i = 0; i < $scope.tsmaintenanceorderactivity.length; i++) {
            //if the objects ta code value is equal to the user's selected value...
            if ($scope.tsmaintenanceorderactivity[i].TA_RecID == TA_RecID_User_Value) {
                //...set the var as true, and break out of the loop
                TA_RecID_Same_TrueFalse = true;
                break;
            }
            //else, set the var to false
            else {
                TA_RecID_Same_TrueFalse = false;
            }
        }
        //if the user's new TA_Code is already in the db
        if (TA_RecID_Same_TrueFalse == false) {
            refToMessage.innerHTML = "Select from list";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("GetMaintOrdActivityByTA_RecID_Error").innerHTML = "";
            }, 2000);
        }

        else {
            $http({
                method: "post",
                url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityByTA_RecID",
                datatype: "json",
                data: JSON.stringify($scope.MaintOrdActivityByTA_RecID)
            })
                .then(function (response) {
                    $scope.tsmaintordactivitybyta_recid = JSON.parse(response.data);
                    //change the header-text
                    document.getElementById("maintOrdActivityHeader").innerHTML = "Maintenance Order Activity By TA Rec ID";
                })
        }
    };





    //tables for searches
    //Get the Data related to dropdown selected
    $scope.GetMaintOrdActivityByTask = function () {
        console.log("GetMaintOrdActivityByTask function reached");
        $scope.MaintOrdActivityByTask = {};
        $scope.MaintOrdActivityByTask.Task = $scope.Task;

        //error handling
        //get JSON data
        $http({
            method: "get",
            url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityTaskDistinct"
        }).then(function (response) {
            $scope.tsmaintordactivitytaskdistinct = JSON.parse(response.data);
            });

        //error handling for blank form, variables
        var refToMessage = document.getElementById("GetMaintOrdActivityByTask_Error");
        refToMessage.innerHTML = ""; //sets the text to blank
        var Task_User_Value = document.getElementById("GetMaintOrdActivityByTaskInput").value;//gets the user's selected value
        var Task_Same_TrueFalse = false;
        //error handling, search for existing value
        for (var i = 0; i < $scope.tsmaintordactivitytaskdistinct.length; i++) {
            //if the objects ta code value is equal to the user's selected value...
            if ($scope.tsmaintordactivitytaskdistinct[i].Task == Task_User_Value) {
                //...set the var as true, and break out of the loop
                Task_Same_TrueFalse = true;
                break;
            }
            //else, set the var to false
            else {
                Task_Same_TrueFalse = false;
            }
        }
        //if the user's new Task is already in the db
        if (Task_Same_TrueFalse == false) {
            refToMessage.innerHTML = "Select from list";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("GetMaintOrdActivityByTask_Error").innerHTML = "";
            }, 2000);
        }
        else {
            $http({
                method: "post",
                url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityByTask",
                datatype: "json",
                data: JSON.stringify($scope.MaintOrdActivityByTask)
            })
                    .then(function (response) {
                    $scope.tsmaintordactivitybytask = JSON.parse(response.data);
                    //change the header-text
                    document.getElementById("maintOrdActivityHeader").innerHTML = "Maintenance Order Activity By Task";
                })

        }








    };


    //tables for searches
    //Get the Data related to dropdown selected
    $scope.GetMaintOrdActivityByTA_Code = function () {
        console.log("GetMaintOrdActivityByTA_Code function reached");
        $scope.MaintOrdActivityByTA_Code = {};
        $scope.MaintOrdActivityByTA_Code.TA_Code = $scope.TA_Code;



        //error handling
        //get JSON data
        $http({
            method: "get",
            url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityTA_CodeDistinct"
        }).then(function (response) {
            $scope.tsmaintordactivityta_codedistinct = JSON.parse(response.data);
            });



        //error handling for blank form, variables
        var refToMessage = document.getElementById("GetMaintOrdActivityByTA_Code_Error");
        refToMessage.innerHTML = ""; //sets the text to blank
        var TA_Code_User_Value = document.getElementById("GetMaintOrdActivityByTA_CodeInput").value;//gets the user's selected value
        var TA_Code_Same_TrueFalse = false;
        //error handling, search for existing value
        for (var i = 0; i < $scope.tsmaintordactivityta_codedistinct.length; i++) {
            //if the objects ta code value is equal to the user's selected value...
            if ($scope.tsmaintordactivityta_codedistinct[i].TA_Code == TA_Code_User_Value) {
                //...set the var as true, and break out of the loop
                TA_Code_Same_TrueFalse = true;
                break;
            }
            //else, set the var to false
            else {
                TA_Code_Same_TrueFalse = false;
            }
        }


        //if the user's new Task is already in the db
        if (TA_Code_User_Value == 0) {
            refToMessage.innerHTML = "Select from list";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("GetMaintOrdActivityByTA_Code_Error").innerHTML = "";
            }, 2000);
        }
        //if the user's new TA_Code is already in the db
        else if (TA_Code_Same_TrueFalse == false) {
            refToMessage.innerHTML = "Select from list";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("GetMaintOrdActivityByTA_Code_Error").innerHTML = "";
            }, 2000);
        }




        else {
            $http({
                method: "post",
                url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityByTA_Code",
                datatype: "json",
                data: JSON.stringify($scope.MaintOrdActivityByTA_Code)
            })
                .then(function (response) {
                    //save the jsob data for the front-ends use
                    $scope.tsmaintordactivitybyta_code = JSON.parse(response.data);
                    //change the header-text
                    document.getElementById("maintOrdActivityHeader").innerHTML = "Maintenance Order Activity By TA Code";
                })

        }

    };


    //Dropdowns
    //Web API that gets all the MaintOrdActivityTaskDistinct data, mirroring MVC's action-method
    $scope.GetMaintOrdActivityTaskDistinct = function () {
        console.log("GetMaintOrdActivityTaskDistinct function reached");
        $http({
            method: "get",
            url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityTaskDistinct"
        }).then(function (response) {
            $scope.tsmaintordactivitytaskdistinct = JSON.parse(response.data);
        });
    };

    //Dropdowns
    //Web API that gets all the MaintOrdActivityTA_CodeDistinct data, mirroring MVC's action-method
    $scope.GetMaintOrdActivityTA_CodeDistinct = function () {
        console.log("GetMaintOrdActivityTA_CodeDistinct function reached");
        $http({
            method: "get",
            url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityTA_CodeDistinct"
        }).then(function (response) {
            $scope.tsmaintordactivityta_codedistinct = JSON.parse(response.data);
        });
    };







    //Create/Insert Function
    $scope.InsertMaintOrdActivity = function () {
        console.log("InsertMaintOrdActivity function reached");
        //gets a reference to the save button, and stores its value. This forms the basis of using one button to switch contextually from Submit to Update
        var Action = document.getElementById("btnSave").getAttribute("value");

        //if it's the Submit button, submit the data to the db
        if (Action === "Submit") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="Whatever" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.MaintOrdActivity = {};
            $scope.MaintOrdActivity.Task = $scope.Task;
            $scope.MaintOrdActivity.CombinedActivities = $scope.CombinedActivities;
            $scope.MaintOrdActivity.TA_Code = $scope.TA_Code;

            //PART ERROR HANDLING
            //error handling for the user's inputs
            //gets the JSON data for error handling
            $http({
                method: "get",
                url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityTaskDistinct"
            }).then(function (response) {
                $scope.tsmaintordactivitytaskdistinct = JSON.parse(response.data);
            });



            //PART ERROR HANDLING
            //variables

            //stores the value of the reference-message, and sets it to null as default
            var refToMessage = document.getElementById("Task_Error");
            refToMessage.innerHTML = "";
            //stores a reference to the user's value, and the value itself
            var Task_User_Value = document.getElementById("Task").value;
            var Task_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tsmaintordactivitytaskdistinct.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsmaintordactivitytaskdistinct[i].Task == Task_User_Value) {
                    //...set the var as true, and break out of the loop
                    Task_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    Task_Same_TrueFalse = false;
                }
            }


            var refToMessageCombinedActivities_Error = document.getElementById("CombinedActivities_Error");
            refToMessageCombinedActivities_Error.innerHTML = "";
            var CombinedActivities_User_Value = document.getElementById("CombinedActivities").value;

            var refToMessageTA_Code_Error = document.getElementById("TA_Code_Error");
            refToMessageTA_Code_Error.innerHTML = "";
            var TA_Code_User_Value = document.getElementById("TA_Code").value;
            var TA_Code_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tsmaintordactivityta_codedistinct.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsmaintordactivityta_codedistinct[i].TA_Code == TA_Code_User_Value) {
                    //...set the var as true, and break out of the loop
                    TA_Code_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    TA_Code_Same_TrueFalse = false;
                }
            }




            //PART ERROR HANDLING
            //if the user doesn't put in any value
            if (Task_User_Value == "") {
                refToMessage.innerHTML = "Enter a Task from the List";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (Task_Same_TrueFalse == false) {
                refToMessage.innerHTML = "Select a Task from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_Error").innerHTML = "";
                }, 2000);
            }

            //else if the user doesn't put in any value
            else if (CombinedActivities_User_Value == "") {
                refToMessageCombinedActivities_Error.innerHTML = "Enter a Combined Activity";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("CombinedActivities_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user doesn't put in any value
            else if (TA_Code_User_Value == "") {
                refToMessageTA_Code_Error.innerHTML = "Enter a TA Code from the List";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (TA_Code_Same_TrueFalse == false) {
                refToMessageTA_Code_Error.innerHTML = "Select a TA Code from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }
            else {
                //posts data to MVC Web API as JSON-format
                $http({
                    method: "post",
                    url: "/TSMaintenanceOrderActivity/InsertMaintOrdActivity",
                    datatype: "json",
                    data: JSON.stringify($scope.MaintOrdActivity)
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

                            //alert popup box, the message comes from the response message it gets from MVC
                            //alert(response.data);
                            //calls the method to refresh the data
                            $scope.GetMaintOrdActivity();
                            //sets the fields to blank/emptyy strings
                            $scope.Task = "";
                            $scope.CombinedActivities = "";
                            $scope.TA_Code = "";
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
            $scope.MaintOrdActivity = {};
            $scope.MaintOrdActivity.TA_RecID = $scope.TA_RecID;
            $scope.MaintOrdActivity.Task = $scope.Task;
            $scope.MaintOrdActivity.CombinedActivities = $scope.CombinedActivities;
            $scope.MaintOrdActivity.TA_Code = $scope.TA_Code;



            //PART ERROR HANDLING
            //error handling for the user's inputs
            //gets the JSON data for error handling
            $http({
                method: "get",
                url: "/TSMaintenanceOrderActivity/GetMaintOrdActivityTaskDistinct"
            }).then(function (response) {
                $scope.tsmaintordactivitytaskdistinct = JSON.parse(response.data);
            });
            //PART ERROR HANDLING
            //variables
            //stores the value of the reference-message, and sets it to null as default
            var refToMessage = document.getElementById("Task_Error");
            refToMessage.innerHTML = "";
            //stores a reference to the user's value, and the value itself
            var Task_User_Value = document.getElementById("Task").value;
            var Task_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tsmaintordactivitytaskdistinct.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsmaintordactivitytaskdistinct[i].Task == Task_User_Value) {
                    //...set the var as true, and break out of the loop
                    Task_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    Task_Same_TrueFalse = false;
                }
            }

            var refToMessageCombinedActivities_Error = document.getElementById("CombinedActivities_Error");
            refToMessageCombinedActivities_Error.innerHTML = "";
            var CombinedActivities_User_Value = document.getElementById("CombinedActivities").value;

            var refToMessageTA_Code_Error = document.getElementById("TA_Code_Error");
            refToMessageTA_Code_Error.innerHTML = "";
            var TA_Code_User_Value = document.getElementById("TA_Code").value;
            var TA_Code_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tsmaintordactivityta_codedistinct.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsmaintordactivityta_codedistinct[i].TA_Code == TA_Code_User_Value) {
                    //...set the var as true, and break out of the loop
                    TA_Code_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    TA_Code_Same_TrueFalse = false;
                }
            }







            //if the user doesn't put in any value
            if (Task_User_Value == "") {
                refToMessage.innerHTML = "Enter a Task from the List";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (Task_Same_TrueFalse == false) {
                refToMessage.innerHTML = "Select a Task from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user doesn't put in any value
            else if (CombinedActivities_User_Value == "") {
                refToMessageCombinedActivities_Error.innerHTML = "Enter a Combined Activity";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("CombinedActivities_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user doesn't put in any value
            else if (TA_Code_User_Value == "") {
                refToMessageTA_Code_Error.innerHTML = "Enter a TA Code from the List";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (TA_Code_Same_TrueFalse == false) {
                refToMessageTA_Code_Error.innerHTML = "Select a TA Code from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TA_Code_Error").innerHTML = "";
                }, 2000);
            }

            else {

                //posts data to MVC Web API as JSON-format
                $http({
                    method: "post",
                    url: "/TSMaintenanceOrderActivity/UpdateMaintOrdActivity",
                    datatype: "json",
                    data: JSON.stringify($scope.MaintOrdActivity)
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
                            $scope.GetMaintOrdActivity();

                            //sets the fields to blank/emptyy strings
                            $scope.Task = "";
                            $scope.CombinedActivities = "";
                            $scope.TA_Code = "";

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
                            document.getElementById("AddNewMaintOrdActivity").style.backgroundColor = "#eaeffa";
                            //border color back to light blue
                            document.getElementById("AddNewMaintOrdActivity").style.borderColor = "#eaeffa";
                            //header text back to Add
                            document.getElementById("AddUpdateNewMaintOrdActivityHeader").innerHTML = "Add Maintenance Order Activity";
                            //header text color back to light blue
                            document.getElementById("AddUpdateNewMaintOrdActivityHeader").style.color = "#a7b1c6";
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
                            //call methods to refresh the data
                            $scope.GetMaintOrdActivity();
                        }
                    })

            }






            



        }
    };


    //Update MaintOrdActivity, passing in an object from the front-end/view. This is Part 1 of the Update logic. Part 2 is integrated into Insert Whatever's logic
    $scope.UpdateMaintOrdActivity = function (MaintOrdActivity) {
        console.log("UpdateMaintOrdActivity function reached");
        //onclick Update button, each value populates the fields of the Add form, now becoming the Update form
        //on left: variable-reference-location of the Add form fields, on-right: imported properties of the object that was passed in 
        //in essence, this is just copying the values from the table's selected row and throwing it up in the equivalent Add form fields/inputs
        $scope.TA_RecID = MaintOrdActivity.TA_RecID;
        $scope.Task = MaintOrdActivity.Task;
        $scope.CombinedActivities = MaintOrdActivity.CombinedActivities;
        $scope.TA_Code = MaintOrdActivity.TA_Code;

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
        document.getElementById("AddNewMaintOrdActivity").style.backgroundColor = "#ffe7b3";
        document.getElementById("AddNewMaintOrdActivity").style.borderColor = "#ffe7b3";
        document.getElementById("AddUpdateNewMaintOrdActivityHeader").innerHTML = "Update Maintenance Order Activity";
        document.getElementById("AddUpdateNewMaintOrdActivityHeader").style.color = "#c9bb9c";
    }



    //Delete object
    $scope.DeleteMaintOrdActivity = function (MaintOrdActivity) {
        console.log("DeleteMaintOrdActivity function reached");
        //javascript used to confirm delete. If confirm, post to MVC. if not confirm, just goes back to screen
        if (confirm("Confirm Delete?")) {
            $http({
                //posts the object to the mvc api url as a JSON object
                method: "post",
                url: "/TSMaintenanceOrderActivity/DeleteMaintOrdActivity",
                datatype: "json",
                data: JSON.stringify(MaintOrdActivity)
                //MVC controller then sends back data to db
                //then gives a response to the client, refreshing the data
            }).then(function (response) {
                //call methods to refresh the data
                $scope.GetMaintOrdActivity();
            })
        }
        else {
            //goes back to screen
        }
    };






    //cancels the data submission, sets each state back to blank, reloads the data
    $scope.CancelMaintOrdActivity = function () {
        //javascript just reloads the page again. This is the simplest option-solution, but has a clunky reload of the page
        //location.reload();
        console.log("CancelMaintOrdGroup function reached");
        //calls the method to refresh the data
        $scope.GetMaintOrdActivity();

        //resets the field-data in the Add form to blank/emptyy strings
        $scope.Task = "";
        $scope.CombinedActivities = "";
        $scope.TA_Code = "";

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
        document.getElementById("AddNewMaintOrdActivity").style.backgroundColor = "#eaeffa";
        //border color back to light blue
        document.getElementById("AddNewMaintOrdActivity").style.borderColor = "#eaeffa";
        //header text back to Add form
        document.getElementById("AddUpdateNewMaintOrdActivityHeader").innerHTML = "Add Maintenance Order Activity";
        //header text color back to light blue
        document.getElementById("AddUpdateNewMaintOrdActivityHeader").style.color = "#a7b1c6";
    };














    












});