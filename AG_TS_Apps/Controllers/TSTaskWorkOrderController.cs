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
    public class TSTaskWorkOrderController : Controller
    {
        //variables
        //stores configuration reference (connection string, etc.)
        private ITimeSheetApplication itsApp;

        //variable to store DataView
        public DataView TaskWO { get; set; }
        public DataView TaskWOByTaskID { get; set; }
        public DataView TaskType { get; set; }
        public DataView ExpenseType { get; set; }


        //create a new JSonNetResult converter object, which converts Microsoft JSON to ISO8601 JSON
        JsonNetResult jsonNetResult = new JsonNetResult();

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
        public TSTaskWorkOrderController()
        {
            itsApp = AgTSConnect();
        }

        // GET: TSTaskWorkOrder
        public ActionResult Index()
        {
            return View();
        }


        //gets/reads all task/work orders, used for tables
        //GET: /TSTaskWorkOrder/GetTaskWO
        public ActionResult GetTaskWO()
        {
            //stores the first table
            TaskWO = itsApp.GetTaskWO().Tables[0].DefaultView;

            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in TaskWO.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in TaskWO.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }


            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that have Activity labeled as "true"
            var taskTableFilteredByActiveTrue = from x in parentRow
                                                    where x.Keys.Contains("Active")
                                                    && x.Values.Contains(true)
                                                    select x;


            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(taskTableFilteredByActiveTrue);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }

        //gets/reads tasks/work order by their id, used for tables
        //POST and GET: /TSTaskWorkOrder/GetTaskWOByTaskID
        public ActionResult GetTaskWOByTaskID(TSTaskWorkOrderModel tsTaskWorkOrder)
        {
            //error handling
            try
            {
                //gets entries as Dataview
                //stores the first table
                TaskWOByTaskID = itsApp.GetTaskWOByTaskID(tsTaskWorkOrder.Task_WO_ID).Tables[0].DefaultView;
                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in TaskWOByTaskID.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in TaskWOByTaskID.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }
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

        //gets/reads all distinct task types, used for dropdown
        //GET: /TSTaskWorkOrder/GetTaskType
        public ActionResult GetTaskType()
        {
            try
            {
                //stores the first table
                TaskType = itsApp.GetTaskWO().Tables[0].DefaultView;

                //uses Datatable format, filters by the TaskType column,
                //only returning the rows with values that are distinct/unique in relation to each other,
                //Then encapsulates the distinct/unique values back into DataView format
                DataTable distinctTaskTypes = TaskType.ToTable(true, "TaskType");
                DataView formatDistinctTaskTypes = distinctTaskTypes.DefaultView;

                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in formatDistinctTaskTypes.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in formatDistinctTaskTypes.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }

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

        //gets/reads all distinct expense types, used for dropdown
        //GET: /TSTaskWorkOrder/GetExpenseType
        public ActionResult GetExpenseType()
        {
            try
            {
                //stores the first table
                ExpenseType = itsApp.GetTaskWO().Tables[0].DefaultView;

                //uses Datatable format, filters by the ExpenseType column,
                //only returning the rows with values that are distinct/unique in relation to each other,
                //Then encapsulates the distinct/unique values back into DataView format
                DataTable distinctExpenseTypes = ExpenseType.ToTable(true, "ExpenseType");
                DataView formatDistinctExpenseTypes = distinctExpenseTypes.DefaultView;

                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in formatDistinctExpenseTypes.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in formatDistinctExpenseTypes.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }

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


        //inserts/creates a Task/Work Order object in the DAL->db
        //POST: /TSTaskWorkOrder/InsertTaskWO
        public string InsertTaskWO(TSTaskWorkOrderModel tsTaskWorkOrder)
        {
            //if the object has data, insert the data, else if there is no data just return a string
            try
            {
                //create a new DAL-based TaskWO-type object called oTaskWO
                TaskWO oTaskWO = new TaskWO();

                //populate the DAL-object with the MVC object data
                oTaskWO.Task_WO_ID = tsTaskWorkOrder.Task_WO_ID;
                oTaskWO.TaskType = tsTaskWorkOrder.TaskType;
                oTaskWO.ExpenseType = tsTaskWorkOrder.ExpenseType;
                oTaskWO.TaskDescription = tsTaskWorkOrder.TaskDescription;
                oTaskWO.TaskPurpose = tsTaskWorkOrder.TaskPurpose;
                oTaskWO.Active = tsTaskWorkOrder.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.InsertTaskWO(oTaskWO);
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
        //POST: /TSTaskWorkOrder/UpdateTaskWO
        public string UpdateTaskWO(TSTaskWorkOrderModel tsTaskWorkOrder)
        {
            try
            {
                //create a new TaskWO-type object called oTaskWO
                TaskWO oTaskWO = new TaskWO();
                //populate the DAL-object with the MVC object data

                //populate the DAL-object with the MVC object data
                oTaskWO.Task_WO_ID = tsTaskWorkOrder.Task_WO_ID;
                oTaskWO.TaskType = tsTaskWorkOrder.TaskType;
                oTaskWO.ExpenseType = tsTaskWorkOrder.ExpenseType;
                oTaskWO.TaskDescription = tsTaskWorkOrder.TaskDescription;
                oTaskWO.TaskPurpose = tsTaskWorkOrder.TaskPurpose;
                oTaskWO.Active = tsTaskWorkOrder.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.UpdateTaskWO(oTaskWO);
                return "Updated";
            }
            catch
            {
                return "Not Updated";
            }
        }

        //CRUD DELETE
        //POST a deletion to the db
        //error checking
        //POST: /TSTaskWorkOrder/DeleteTaskWO
        public string DeleteTaskWO(TSTaskWorkOrderModel tsTaskWorkOrder)
        {
            try
            {
                //create a new TaskWO-type object called oTaskWO
                TaskWO oTaskWO = new TaskWO();

                //populate the DAL-object with the MVC object data
                oTaskWO.Task_WO_ID = tsTaskWorkOrder.Task_WO_ID;
                oTaskWO.TaskType = tsTaskWorkOrder.TaskType;
                oTaskWO.ExpenseType = tsTaskWorkOrder.ExpenseType;
                oTaskWO.TaskDescription = tsTaskWorkOrder.TaskDescription;
                oTaskWO.TaskPurpose = tsTaskWorkOrder.TaskPurpose;
                oTaskWO.Active = tsTaskWorkOrder.Active;

                //connect via interface to DAL App, and delete the object. The DAL parses out just the equipment number, deleting the object with that number
                itsApp.DeleteTaskWO(oTaskWO);
                return "Deleted";
            }
            catch
            {
                return "Not Deleted";
            }
        }






    }
}