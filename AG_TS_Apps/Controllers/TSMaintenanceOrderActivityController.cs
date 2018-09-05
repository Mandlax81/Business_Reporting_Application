using AG_TS_Apps.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
//uses the separate DAL
using TimeSheetsDAL;
using TimeSheetsDAL.TimeSheetTracking;

namespace AG_TS_Apps.Controllers
{
    public class TSMaintenanceOrderActivityController : Controller
    {
        //variables
        //stores configuration reference (connection string, etc.)
        private ITimeSheetApplication itsApp;

        public DataView MaintOrdActivity { get; set; }
        public DataView MaintOrdActivityByTA_RecID { get; set; }
        public DataView MaintOrdActivityByTask { get; set; }


        //create a new JSonNetResult converter object, which converts Microsoft JSON to ISO8601 JSON
        //JsonNetResult jsonNetResult = new JsonNetResult();

        //Configuration of connection to database
        //new interface-connection 
        private ITimeSheetApplication AgTSConnect()
        {
            //gets the connection strings of the DAL db and the password to get into the DAL db
            string configStringDalDB = System.Configuration.ConfigurationManager.AppSettings["Grower_User"];
            string configStringPassword = System.Configuration.ConfigurationManager.AppSettings["DB_CANE_PW"];
            //sets the connection string and gets the value back so I can access the DAL db
            DBHelper.setConnectionString(configStringDalDB, configStringPassword);
            //returns a timesheet back to me
            return new TimeSheet();
        }
        //constructor stores the configuration connection
        public TSMaintenanceOrderActivityController()
        {
            itsApp = AgTSConnect();
        }

        // GET:  /TSMaintenanceOrderActivity/Index
        public ActionResult Index()
        {
            return View();
        }



        //gets/reads only active=true maintenance order activities, used for tables
        //GET: /TSMaintenanceOrderActivity/GetMaintOrdActivity
        public ActionResult GetMaintOrdActivity()
        {
            //stores the first table
            MaintOrdActivity = itsApp.GetMaintOrdActivity().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in MaintOrdActivity.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in MaintOrdActivity.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }


            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that have Activity labeled as "true"
            var maintOrdActivityTableFilteredByActiveTrue = from x in parentRow
                                                            where x.Keys.Contains("Active")
                                                            && x.Values.Contains(true)
                                                            select x;

            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(maintOrdActivityTableFilteredByActiveTrue);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }












        //gets/reads Maintenance Order Activities by their id, used for tables
        //POST and GET: /TSMaintenanceOrderActivity/GetMaintOrdActivityByTA_RecID
        public ActionResult GetMaintOrdActivityByTA_RecID(TSMaintenanceOrderActivityModel tsMaintenanceOrderActivity)
        {
            //error handling
            //and it returns a value to the AngularJS method (after being processed by the DAL method)
            try
            {
                //gets entries as Dataview
                //stores the first table
                MaintOrdActivityByTA_RecID = itsApp.GetMaintOrdActivityByTA_RecID(tsMaintenanceOrderActivity.TA_RecID).Tables[0].DefaultView;

                //converts/serializes the DataView/Dataset data into List data
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in MaintOrdActivityByTA_RecID.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in MaintOrdActivityByTA_RecID.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }

                //converts/serializes the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                string JsSerializer = JsonConvert.SerializeObject(parentRow);
                return Json(JsSerializer, JsonRequestBehavior.AllowGet);
            }
            //error handling, else it returns no value/null to the AngularJS method, 
            //The AngularJS method then finishes off the error handling,
            //and gives the user either the data or an error message.
            catch
            {
                return null;
            }
        }



        //gets/reads only active=true maintenance order activities, used for tables
        //POST and GET: /TSMaintenanceOrderActivity/GetMaintOrdActivityByTask
        public ActionResult GetMaintOrdActivityByTask(TSMaintenanceOrderActivityModel tsMaintenanceOrderActivity)
        {
            try
            {
                //stores the first table
                MaintOrdActivityByTask = itsApp.GetMaintOrdActivity().Tables[0].DefaultView;
                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in MaintOrdActivityByTask.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in MaintOrdActivityByTask.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }


                //takes the List, and filters through to data using LINQ to SQL format, 
                //gets only the rows of data that have Task labeled as the user's choice (i.e. tsMaintenanceOrderActivity.Task 
                var maintOrdActivityFilteredByTask = from x in parentRow
                                                     where x.Keys.Contains("Task")
                                                     && x.Values.Contains(tsMaintenanceOrderActivity.Task)
                                                     select x;

                //serialized the data into javascript
                string JsSerializer = JsonConvert.SerializeObject(maintOrdActivityFilteredByTask);

                //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
                JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;
            }
            catch
            {
                return null;
            }
        }





        //dropdown to get the TA_Code and task grouped together
        //POST and GET: /TSMaintenanceOrderActivity/GetMaintOrdActivityByTA_Code
        public ActionResult GetMaintOrdActivityByTA_Code(TSMaintenanceOrderActivityModel tsMaintenanceOrderActivity)
        {
            try
            {
                //stores the first table
                MaintOrdActivityByTask = itsApp.GetMaintOrdActivity().Tables[0].DefaultView;
                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in MaintOrdActivityByTask.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in MaintOrdActivityByTask.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }


                //takes the List, and filters through to data using LINQ to SQL format, 
                //gets only the rows of data that have Task labeled as the user's choice (i.e. tsMaintenanceOrderActivity.Task 
                var maintOrdActivityFilteredByTA_Code = from x in parentRow
                                                        where x.Keys.Contains("TA_Code")
                                                        && x.Values.Contains(tsMaintenanceOrderActivity.TA_Code)
                                                        select x;


                //serialized the data into javascript
                string JsSerializer = JsonConvert.SerializeObject(maintOrdActivityFilteredByTA_Code);

                //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
                JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;

            }
            catch
            {
                return null;
            }
        }








        //gets/reads only distinct tasks, used for dropdowns
        //GET: /TSMaintenanceOrderActivity/GetMaintOrdActivityTaskDistinct
        public ActionResult GetMaintOrdActivityTaskDistinct()
        {
            try
            {
                //stores the first table
                MaintOrdActivity = itsApp.GetMaintOrdActivity().Tables[0].DefaultView;

                //uses Datatable format, filters by the Task column,
                //only returning the rows with values that are distinct/unique in relation to each other,
                //Then encapsulates the distinct/unique values back into DataView format
                DataTable distinctTask = MaintOrdActivity.ToTable(true, "Task");
                DataView formatDistinctTask = distinctTask.DefaultView;

                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in formatDistinctTask.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in formatDistinctTask.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }

                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                //serialized the data into javascript
                string JsSerializer = JsonConvert.SerializeObject(parentRow);

                //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
                JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;

            }
            catch
            {
                return null;
            }

        }




        //gets/reads only distinct ta codes and their "description"(i.e. task), used for dropdowns
        //GET: /TSMaintenanceOrderActivity/GetMaintOrdActivityTA_CodeDistinct
        public ActionResult GetMaintOrdActivityTA_CodeDistinct()
        {
            //error checking
            try
            {
                //stores the first table
                MaintOrdActivity = itsApp.GetMaintOrdActivity().Tables[0].DefaultView;

                //uses Datatable format, filters by the TA_Code column,
                //only returning the rows with values that are distinct/unique in relation to each other,
                //Then encapsulates the distinct/unique values back into DataView format
                DataTable distinctTA_Codes = MaintOrdActivity.ToTable(true, "TA_Code", "Task");

                DataView formatDistinctTA_Codes = distinctTA_Codes.DefaultView;

                //formatDistinctTA_Codes.Sort = "TA_Code";
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in formatDistinctTA_Codes.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in formatDistinctTA_Codes.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }

                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                //serialized the data into javascript
                string JsSerializer = JsonConvert.SerializeObject(parentRow);

                //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
                JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = int.MaxValue;
                return json;

            }
            catch
            {
                return null;
            }

        }











        //inserts/creates a Maintenance Order Activity object in the DAL->db
        //POST: /TSMaintenanceOrderActivity/InsertMaintOrdActivity
        public string InsertMaintOrdActivity(TSMaintenanceOrderActivityModel tsMaintenanceOrderActivity)
        {
            //error checking 
            try 
            {
                //create a new DAL-based MaintOrdActivity-type object called oMainOrdActivity
                MaintOrdActivity oMainOrdActivity = new MaintOrdActivity();

                //populate the DAL-object with the MVC object data
                //do not send back the ta_recid. The id is auto-incremented and assigned an id when on object is passed to the db/
                //oMainOrdActivity.TA_RecID = tsMaintenanceOrderActivity.TA_RecID;
                oMainOrdActivity.Task = tsMaintenanceOrderActivity.Task;
                oMainOrdActivity.CombinedActivites = tsMaintenanceOrderActivity.CombinedActivities;
                oMainOrdActivity.TA_Code = tsMaintenanceOrderActivity.TA_Code;
                oMainOrdActivity.Active = tsMaintenanceOrderActivity.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.InsertMaintOrdActivity(oMainOrdActivity);
                return "Added";
            }
            catch
            {
                return "Not Added";
            }
        }




        //CRUD UPDATE
        //POST an update to the db
        //error checking
        //POST: /TSMaintenanceOrderActivity/UpdateMaintOrdActivity
        public string UpdateMaintOrdActivity(TSMaintenanceOrderActivityModel tsMaintenanceOrderActivity)
        {
            //error checking
            try
            {
                //create a new DAL-based MaintOrdActivity-type object called oMainOrdActivity
                MaintOrdActivity oMainOrdActivity = new MaintOrdActivity();

                //populate the DAL-object with the MVC object data
                //for update, make sure to send back the ta_recid. 
                //That id is how the db knows which data row to update
                
                oMainOrdActivity.TA_RecID = tsMaintenanceOrderActivity.TA_RecID;
                oMainOrdActivity.Task = tsMaintenanceOrderActivity.Task;
                oMainOrdActivity.CombinedActivites = tsMaintenanceOrderActivity.CombinedActivities;
                oMainOrdActivity.TA_Code = tsMaintenanceOrderActivity.TA_Code;
                oMainOrdActivity.Active = tsMaintenanceOrderActivity.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.UpdateMaintOrdActivity(oMainOrdActivity);
                return "Updated";
            }
            catch
            {
                return "Not Updated";
            }
        }


        //CRUD DELETE
        //POST a deletion/deactivation to the db
        //error checking
        //POST: /TSMaintenanceOrderActivity/DeleteMaintOrdActivity
        public string DeleteMaintOrdActivity(TSMaintenanceOrderActivityModel tsMaintenanceOrderActivity)
        {
            //error checking
            try 
            {
                //create a new MaintOrdActivity-type object called oMainOrdActivity
                MaintOrdActivity oMainOrdActivity = new MaintOrdActivity();

                //populate the DAL-object with the MVC object data
                oMainOrdActivity.TA_RecID = tsMaintenanceOrderActivity.TA_RecID;
                oMainOrdActivity.Task = tsMaintenanceOrderActivity.Task;
                oMainOrdActivity.CombinedActivites = tsMaintenanceOrderActivity.CombinedActivities;
                oMainOrdActivity.TA_Code = tsMaintenanceOrderActivity.TA_Code;
                //set the object property to false. When you load the table in, with the
                //GetMaintOrdGroup() method called and filering in only active=true objects,
                //you'll only get the objects labelled as true (i.e. not "deleted")
                oMainOrdActivity.Active = false;

                //connect via interface to DAL App, and delete the object. The DAL parses out just the equipment number, deleting the object with that number
                itsApp.DeleteMaintOrdActivity(oMainOrdActivity);
                return "Deleted";
            }
            catch
            {
                return "Not Deleted";
            }
        }





    }
}


