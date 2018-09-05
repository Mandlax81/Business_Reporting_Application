//new app, added pagination dependency, injecting a library of functions, also add ngMessages, another library of functions
var app = angular.module("taskWorkOrderApp", ['angularUtils.directives.dirPagination', 'ngMessages']);

app.controller("taskWorkOrderCtrl", function ($scope, $http, $location, $anchorScroll) {
    //debugger;


    //sorts the table by their heading, either ascending or descending
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


    //Tables for Searches
    //Web API that gets all the TaskWO data, mirroring MVC's action-method
    $scope.GetTaskWO = function () {
        console.log("GetTaskWO function reached");
        $http({
            method: "get",
            url: "/TSTaskWorkOrder/GetTaskWO"
        }).then(function (response) {
            $scope.tstaskwo = JSON.parse(response.data);
            //change the header-text
            document.getElementById("taskWOHeader").innerHTML = "Tasks/Work Orders";
        });
    };









    //Get the Data related to Button selected
    $scope.GetTaskWOByTaskID = function () {
        console.log("GetTaskWOByTaskID function reached");
        $scope.TaskWO = {};
        $scope.TaskWO.Task_WO_ID = $scope.Task_WO_ID;

        //error handling
        //get JSON data
        $http({
            method: "get",
            url: "/TSTaskWorkOrder/GetTaskWO"
        }).then(function (response) {
            $scope.tstaskwo = JSON.parse(response.data);
            //change the header-text
            document.getElementById("taskWOHeader").innerHTML = "Tasks/Work Orders";
        });

        //error handling for blank form, variables
        var refToMessage = document.getElementById("GetTaskWOInput_Error");
        refToMessage.innerHTML = ""; //sets the text to blank
        var TaskWO_User_Value = document.getElementById("GetTaskWOInput").value;//gets the user's selected value
        var TaskWO_Same_TrueFalse = false;
        //error handling, search for existing value
        for (var i = 0; i < $scope.tstaskwo.length; i++) {
            //if the objects ta code value is equal to the user's selected value...
            if ($scope.tstaskwo[i].Task_WO_ID == TaskWO_User_Value) {
                //...set the var as true, and break out of the loop
                TaskWO_Same_TrueFalse = true;
                break;
            }
            //else, set the var to false
            else {
                TaskWO_Same_TrueFalse = false;
            }
        }
        //if the user's Task WO is blank 
        if (TaskWO_User_Value == "") {
            refToMessage.innerHTML = "No blank entries. Select from list";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("GetTaskWOInput_Error").innerHTML = "";
            }, 2000);
        }
        //if the user's new Task is already in the db
        else if (TaskWO_Same_TrueFalse == false) {
            refToMessage.innerHTML = "Select from list";
            //times out the confirmation message
            setTimeout(function () {
                document.getElementById("GetTaskWOInput_Error").innerHTML = "";
            }, 2000);
        }
        else {
            $http({
                method: "post",
                url: "/TSTaskWorkOrder/GetTaskWOByTaskID",
                datatype: "json",
                data: JSON.stringify($scope.TaskWO)
            })
                .then(function (response) {
                    $scope.tstaskwobytaskid = JSON.parse(response.data);
                    //change the header-text
                    document.getElementById("taskWOHeader").innerHTML = "Task/Work Order By ID";
                })

        }







    };
    

    //Dropdowns for Inputs
    //Web API that gets all the Task Type data, mirroring MVC's action-method
    $scope.GetTaskType = function () {
        console.log("GetTaskType function reached");
        $http({
            method: "get",
            url: "/TSTaskWorkOrder/GetTaskType"
        }).then(function (response) {
            $scope.tstasktype = JSON.parse(response.data);
            //change the header-text
            //document.getElementById("equipmentEntriesHeader").innerHTML = "All Equipment";
        });
    };
    //Web API that gets all the Expense Type data, mirroring MVC's action-method
    $scope.GetExpenseType = function () {
        console.log("GetExpenseType function reached");
        $http({
            method: "get",
            url: "/TSTaskWorkOrder/GetExpenseType"
        }).then(function (response) {
            $scope.tsexpensetype = JSON.parse(response.data);
            //change the header-text
            //document.getElementById("equipmentEntriesHeader").innerHTML = "All Equipment";
        });
    };




    //Create/Insert Function
    $scope.InsertTaskWO = function () {
        console.log("InsertTaskWO function reached");
        //gets a reference to the save button, and stores its value. This forms the basis of using one button to switch contextually from Submit to Update
        var Action = document.getElementById("btnSave").getAttribute("value");

        //if it's the Submit button, submit the data to the db
        if (Action === "Submit") {
            //binds fields/variables/inputs in front-end to this back-end's field's/variables
            //create an object to encapsulate all of the fields. This object-name/model will be referenced by AngularJS in the front-end page/view by the ng-model indicator. 
            //Since ng-model="Whatever" is an attribute within the input field, it will bind/capture whatever is placed in that input
            $scope.TaskWO = {};
            $scope.TaskWO.Task_WO_ID = $scope.Task_WO_ID;
            $scope.TaskWO.TaskType = $scope.TaskType;
            $scope.TaskWO.ExpenseType = $scope.ExpenseType;
            $scope.TaskWO.TaskDescription = $scope.TaskDescription;
            $scope.TaskWO.TaskPurpose = $scope.TaskPurpose;
            $scope.TaskWO.Active = $scope.Active;

            //backend error handling
            //gets the JSON data for error handling
            $http({
                method: "get",
                url: "/TSTaskWorkOrder/GetTaskType"
            }).then(function (response) {
                $scope.tstasktype = JSON.parse(response.data);
                //change the header-text
                //document.getElementById("equipmentEntriesHeader").innerHTML = "All Equipment";
                });
            $http({
                method: "get",
                url: "/TSTaskWorkOrder/GetExpenseType"
            }).then(function (response) {
                $scope.tsexpensetype = JSON.parse(response.data);
                //change the header-text
                //document.getElementById("equipmentEntriesHeader").innerHTML = "All Equipment";
            });

            //variables
            //Task_WO_ID
            var refToMessageTask_WO_ID_Error = document.getElementById("Task_WO_ID_Error");
            refToMessageTask_WO_ID_Error.innerHTML = "";
            var Task_WO_ID_User_Value = document.getElementById("Task_WO_ID").value;

            //TaskType
            var refToMessageTaskType_Error = document.getElementById("TaskType_Error");
            refToMessageTaskType_Error.innerHTML = "";
            var TaskType_User_Value = document.getElementById("TaskType").value;
            var TaskType_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tstasktype.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tstasktype[i].TaskType == TaskType_User_Value) {
                    //...set the var as true, and break out of the loop
                    TaskType_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    TaskType_Same_TrueFalse = false;
                }
            }

            //ExpenseType
            var refToMessageExpenseType_Error = document.getElementById("ExpenseType_Error");
            refToMessageExpenseType_Error.innerHTML = "";
            var ExpenseType_User_Value = document.getElementById("ExpenseType").value;
            var ExpenseType_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tsexpensetype.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsexpensetype[i].ExpenseType == ExpenseType_User_Value) {
                    //...set the var as true, and break out of the loop
                    ExpenseType_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    ExpenseType_Same_TrueFalse = false;
                }
            }

            //TaskDescription
            var refToMessageTaskDescription_Error = document.getElementById("TaskDescription_Error");
            refToMessageTaskDescription_Error.innerHTML = "";
            var TaskDescription_User_Value = document.getElementById("TaskDescription").value;

            //TaskPurpose
            var refToMessageTaskPurpose_Error = document.getElementById("TaskPurpose_Error");
            refToMessageTaskPurpose_Error.innerHTML = "";
            var TaskPurpose_User_Value = document.getElementById("TaskPurpose").value;

            //error handling
            //if the user doesn't put in any value
            if (Task_WO_ID_User_Value == "") {
                refToMessageTask_WO_ID_Error.innerHTML = "Enter a New Task/WO ID";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_WO_ID_Error").innerHTML = "";
                }, 2000);
            }
            //if the user's value is longer than 10 characters
            else if (Task_WO_ID_User_Value.length > 10) {
                refToMessageTask_WO_ID_Error.innerHTML = "Maximum length is 10 characters: 01234567890";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_WO_ID_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (TaskType_Same_TrueFalse == false) {
                refToMessageTaskType_Error.innerHTML = "Select from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TaskType_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (ExpenseType_Same_TrueFalse == false) {
                refToMessageExpenseType_Error.innerHTML = "Select from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("ExpenseType_Error").innerHTML = "";
                }, 2000);
            }
            //if the user doesn't put in any value
            else if (TaskDescription_User_Value == "") {
                refToMessageTaskDescription_Error.innerHTML = "Enter a New Task Description";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TaskDescription_Error").innerHTML = "";
                }, 2000);
            }
            //if the user doesn't put in any value
            else if (TaskPurpose_User_Value == "") {
                refToMessageTaskPurpose_Error.innerHTML = "Enter a New Task Purpose";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TaskPurpose_Error").innerHTML = "";
                }, 2000);
            }






            else {
                //posts data to MVC Web API as JSON-format
                $http({
                    method: "post",
                    url: "/TSTaskWorkOrder/InsertTaskWO",
                    datatype: "json",
                    data: JSON.stringify($scope.TaskWO)
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
                            $scope.GetTaskWO();
                            //sets the fields to blank/emptyy strings
                            $scope.Task_WO_ID = "";
                            $scope.TaskType = "";
                            $scope.ExpenseType = "";
                            $scope.TaskDescription = "";
                            $scope.TaskPurpose = "";
                            $scope.Active = "";

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
            $scope.TaskWO = {};
            $scope.TaskWO.Task_WO_ID = $scope.Task_WO_ID;
            $scope.TaskWO.TaskType = $scope.TaskType;
            $scope.TaskWO.ExpenseType = $scope.ExpenseType;
            $scope.TaskWO.TaskDescription = $scope.TaskDescription;
            $scope.TaskWO.TaskPurpose = $scope.TaskPurpose;
            $scope.TaskWO.Active = $scope.Active;

            //gets the JSON data for error handling
            $http({
                method: "get",
                url: "/TSTaskWorkOrder/GetTaskType"
            }).then(function (response) {
                $scope.tstasktype = JSON.parse(response.data);
            });
            $http({
                method: "get",
                url: "/TSTaskWorkOrder/GetExpenseType"
            }).then(function (response) {
                $scope.tsexpensetype = JSON.parse(response.data);
            });

            //variables
            //Task_WO_ID
            var refToMessageTask_WO_ID_Error = document.getElementById("Task_WO_ID_Error");
            refToMessageTask_WO_ID_Error.innerHTML = "";
            var Task_WO_ID_User_Value = document.getElementById("Task_WO_ID").value;
            //TaskType
            var refToMessageTaskType_Error = document.getElementById("TaskType_Error");
            refToMessageTaskType_Error.innerHTML = "";
            var TaskType_User_Value = document.getElementById("TaskType").value;
            var TaskType_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tstasktype.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tstasktype[i].TaskType == TaskType_User_Value) {
                    //...set the var as true, and break out of the loop
                    TaskType_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    TaskType_Same_TrueFalse = false;
                }
            }
            //ExpenseType
            var refToMessageExpenseType_Error = document.getElementById("ExpenseType_Error");
            refToMessageExpenseType_Error.innerHTML = "";
            var ExpenseType_User_Value = document.getElementById("ExpenseType").value;
            var ExpenseType_Same_TrueFalse = false;
            //loop through JSON Data, comparing the user's task value with each JSON sub-objects' value
            for (var i = 0; i < $scope.tsexpensetype.length; i++) {
                //if the objects ta code value is equal to the user's selected value...
                if ($scope.tsexpensetype[i].ExpenseType == ExpenseType_User_Value) {
                    //...set the var as true, and break out of the loop
                    ExpenseType_Same_TrueFalse = true;
                    break;
                }
                //else, set the var to false
                else {
                    ExpenseType_Same_TrueFalse = false;
                }
            }
            //TaskDescription
            var refToMessageTaskDescription_Error = document.getElementById("TaskDescription_Error");
            refToMessageTaskDescription_Error.innerHTML = "";
            var TaskDescription_User_Value = document.getElementById("TaskDescription").value;
            //TaskPurpose
            var refToMessageTaskPurpose_Error = document.getElementById("TaskPurpose_Error");
            refToMessageTaskPurpose_Error.innerHTML = "";
            var TaskPurpose_User_Value = document.getElementById("TaskPurpose").value;



            //error handling
            //if the user doesn't put in any value
            if (Task_WO_ID_User_Value == "") {
                refToMessageTask_WO_ID_Error.innerHTML = "Enter a New Task/WO ID";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_WO_ID_Error").innerHTML = "";
                }, 2000);
            }
            //if the user's value is longer than 10 characters
            else if (Task_WO_ID_User_Value.length > 10) {
                refToMessageTask_WO_ID_Error.innerHTML = "Maximum length is 10 characters: 01234567890";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("Task_WO_ID_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (TaskType_Same_TrueFalse == false) {
                refToMessageTaskType_Error.innerHTML = "Select from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TaskType_Error").innerHTML = "";
                }, 2000);
            }
            //else if the user's value is already in the db
            else if (ExpenseType_Same_TrueFalse == false) {
                refToMessageExpenseType_Error.innerHTML = "Select from the List.";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("ExpenseType_Error").innerHTML = "";
                }, 2000);
            }
            //if the user doesn't put in any value
            else if (TaskDescription_User_Value == "") {
                refToMessageTaskDescription_Error.innerHTML = "Enter a New Task Description";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TaskDescription_Error").innerHTML = "";
                }, 2000);
            }
            //if the user doesn't put in any value
            else if (TaskPurpose_User_Value == "") {
                refToMessageTaskPurpose_Error.innerHTML = "Enter a New Task Purpose";
                //times out the confirmation message
                setTimeout(function () {
                    document.getElementById("TaskPurpose_Error").innerHTML = "";
                }, 2000);
            }


            else {
                //posts data to MVC Web API as JSON-format
                $http({
                    method: "post",
                    url: "/TSTaskWorkOrder/UpdateTaskWO",
                    datatype: "json",
                    data: JSON.stringify($scope.TaskWO)
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
                            $scope.GetTaskWO();

                            //sets the fields to blank/emptyy strings
                            $scope.Task_WO_ID = "";
                            $scope.TaskType = "";
                            $scope.ExpenseType = "";
                            $scope.TaskDescription = "";
                            $scope.TaskPurpose = "";
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
                            document.getElementById("AddNewTaskWO").style.backgroundColor = "#eaeffa";
                            //header text back to Add
                            document.getElementById("AddUpdateNewTaskWOHeader").innerHTML = "Add Task/WO";
                            //header text color back to light blue
                            document.getElementById("AddUpdateNewTaskWOHeader").style.color = "#a7b1c6";
                            //border color back to light blue
                            document.getElementById("AddNewTaskWO").style.borderColor = "#eaeffa";

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
                            $scope.GetTaskWO();
                        }
                    })


            }



        }
    };




    //Update TaskWO, passing in an TaskWO object from the front-end/view. This is Part 1 of the Update logic. Part 2 is integrated into Insert TaskWO's logic
    $scope.UpdateTaskWO = function (TaskWO) {
        console.log("UpdateTaskWO function reached");
        //onclick Update button, each value populates the fields of the Add form, now becoming the Update form
        //on left: variable-reference-location of the Add form fields, on-right: imported properties of the object that was passed in 
        //in essence, this is just copying the values from the table's selected row and throwing it up in the equivalent Add form fields/inputs
        $scope.Task_WO_ID = TaskWO.Task_WO_ID;
        $scope.TaskType = TaskWO.TaskType;
        $scope.ExpenseType = TaskWO.ExpenseType;
        $scope.TaskDescription = TaskWO.TaskDescription;
        $scope.TaskPurpose = TaskWO.TaskPurpose;
        $scope.Active = TaskWO.Active;

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
        document.getElementById("AddNewTaskWO").style.backgroundColor = "#ffe7b3";
        document.getElementById("AddNewTaskWO").style.borderColor = "#ffe7b3";
        document.getElementById("AddUpdateNewTaskWOHeader").innerHTML = "Update Task/WO";
        document.getElementById("AddUpdateNewTaskWOHeader").style.color = "#c9bb9c";
    }




    //Delete object
    $scope.DeleteTaskWO = function (TaskWO) {
        console.log("DeleteTaskWO function reached");
        //javascript used to confirm delete. If confirm, post to MVC. if not confirm, just goes back to screen
        if (confirm("Confirm Delete?")) {
            $http({
                //posts the object to the mvc api url as a JSON object
                method: "post",
                url: "/TSTaskWorkOrder/DeleteTaskWO",
                datatype: "json",
                data: JSON.stringify(TaskWO)
                //MVC controller then sends back data to db
                //then gives a response to the client, refreshing the data
            }).then(function (response) {
                //call methods to refresh the data
                $scope.GetTaskWO();
            })
        }
        else {
            //goes back to screen
        }
    };





    //cancels the data submission, sets each state back to blank, reloads the data by date
    $scope.CancelTaskWO = function () {
        //javascript just reloads the page again. This is the simplest option-solution, but has a clunky reload of the page
        //location.reload();
        console.log("CancelTaskWO function reached");
        //calls the method to refresh the data
        $scope.GetTaskWO();

        //resets the field-data in the Add form to blank/emptyy strings
        $scope.Task_WO_ID = "";
        $scope.TaskType = "";
        $scope.ExpenseType = "";
        $scope.TaskDescription = "";
        $scope.TaskPurpose = "";
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
        document.getElementById("AddNewTaskWO").style.backgroundColor = "#eaeffa";
        //border color back to light blue
        document.getElementById("AddNewTaskWO").style.borderColor = "#eaeffa";
        //header text back to Add form
        document.getElementById("AddUpdateNewTaskWOHeader").innerHTML = "Add Task/WO";
        //header text color back to light blue
        document.getElementById("AddUpdateNewTaskWOHeader").style.color = "#a7b1c6";
    };







});