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
    public class TSEntryController : Controller
    {
        //variables
        //stores configuration reference (connection string, etc.)
        private ITimeSheetApplication itsApp;
        //variable to store DataView (or this can be changed to List<TimeSheetEntry> types) etc of ActiveEmployees, EmployeesByEmployeeID, etc
        public DataView ActiveEmployees { get; set; }
        public DataView TaskOrIdNumbers { get; set; }
        public DataView ProductionZones { get; set; }
        public DataView FieldNumbers { get; set; }
        public DataView EquipmentNumbers { get; set; }
        public DataView ImplementNumbers { get; set; }
        public DataView EmployeesByEmployeeID { get; set; }
        public DataView EntriesByByEmployeeID { get; set; }
        public DataView EntriesByDate { get; set; }
        public DataView EntriesByDateAndEmployeeID { get; set; }

        //create a new JSonNetResult converter object, which converts Microsoft JSON to ISO8601 JSON
        JsonNetResult jsonNetResult = new JsonNetResult();

        //Configuration of connection to database
        //new interface-connection 
        private ITimeSheetApplication AgTSConnect()
        {
            //gets the connection strings of the DAL db and of the password to get into the DAL db
            string configStringDalDB = System.Configuration.ConfigurationManager.AppSettings["Grower_User"];
            string configStringPassword = System.Configuration.ConfigurationManager.AppSettings["DB_CANE_PW"];
            //sets the connection string and gets the value back so I can access the DAL db
            DBHelper.setConnectionString(configStringDalDB, configStringPassword);
            //returns a timesheet back to me
            return new TimeSheet();
        }
        public TSEntryController() /*DataView EntriesByDate*///constructor stores the configuration connection
        {
            itsApp = AgTSConnect();
        }

        // GET: Time Sheet Entry of Employee
        public ActionResult Index()
        {
            return View();
        }
        //gets/reads all active employees, used for dropdown list
        public ActionResult GetActiveEmployees()
        {
            //stores the first table of all active employees
            ActiveEmployees = itsApp.GetEmployees().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in ActiveEmployees.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in ActiveEmployees.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(parentRow).Replace(@"\", "");
            //returns the data as JSON, which can now be used with AngularJS
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }        
        //gets/reads all task WO id numbers, used for dropdown list
        public ActionResult GetTaskWONumbers()
        {
            //stores the first table
            TaskOrIdNumbers = itsApp.GetTaskWO().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in TaskOrIdNumbers.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in TaskOrIdNumbers.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            //returns the data as JSON, which can now be used with AngularJS
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }
        //gets/reads all production zones, used for dropdown list
        public ActionResult GetProductionZones()
        {
            //stores the first table
            ProductionZones = itsApp.GetProductionZones().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in ProductionZones.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in ProductionZones.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            //returns the data as JSON, which can now be used with AngularJS
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }
        //gets/reads all field numbers, used for dropdown list
        public ActionResult GetFields()
        {
            //stores the first table
            FieldNumbers = itsApp.GetFields().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in FieldNumbers.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in FieldNumbers.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            //returns the data as JSON, which can now be used with AngularJS
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }
        //gets/reads all equipment from GetEquipment method, filtered by 'E' used for dropdown list
        public ActionResult GetEquipment()
        {
            //stores the first table
            EquipmentNumbers = itsApp.GetEquipment().Tables[0].DefaultView;

            //variable to serialize/convert the List to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();

            //serializes the data of the DataView into a List of key-value pairs
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EquipmentNumbers.Table.Rows)//foreach row in the table
            {
                childRow = new Dictionary<string, object>();//creates a new dictionary of childrow
                foreach (DataColumn col in EquipmentNumbers.Table.Columns)//foreach childrow, add it to the parent master object
                {
                    childRow.Add(col.ColumnName, row[col]);
                }

                parentRow.Add(childRow);
            }

            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that are labeled as being an Equipment i.e. "E" type
            var equipmentTableFilteredByE  = from x in parentRow
                          where x.Keys.Contains("EquipmentOrImplement")
                          && x.Values.Contains("E") 
                          select x;

            //serialized the data into javascript, replaces the "\" escape character
            string JsSerializer = JsonConvert.SerializeObject(equipmentTableFilteredByE);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;

            return json;
        }
        //gets/reads all equipment from GetEquipment method, but filtered by 'I' used for dropdown list
        public ActionResult GetImplement()
        {
            //stores the first table
            EquipmentNumbers = itsApp.GetEquipment().Tables[0].DefaultView;

            //variable to serialize/convert the List to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();

            //serializes the data of the DataView into a List of key-value pairs
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EquipmentNumbers.Table.Rows)//foreach row in the table
            {
                childRow = new Dictionary<string, object>();//creates a new dictionary of childrow
                foreach (DataColumn col in EquipmentNumbers.Table.Columns)//foreach childrow, add it to the parent master object
                {
                    childRow.Add(col.ColumnName, row[col]);
                }

                parentRow.Add(childRow);
            }

            //takes the List, and filters through to data using LINQ to SQL format,
            //gets only the rows of data that are labeled as being an Equipment i.e. "E" type
            var implementTableFilteredByI = from x in parentRow
                                            where x.Keys.Contains("EquipmentOrImplement")
                                            && x.Values.Contains("I")
                                            select x;


            //serialized the data into javascript, replaces the "\" escape character
            string JsSerializer = JsonConvert.SerializeObject(implementTableFilteredByI);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;

            return json;
        }
        //gets/reads all an employees timesheet entries by their id
        public ActionResult GetTSEntriesByEmployeeID(TSEntryModel tsEntry)
        {
            //gets entries as Dataview
            itsApp.GetTimeSheetEntriesByEmpID(tsEntry.EmployeeID);
            EntriesByByEmployeeID = itsApp.dvTimeSheetEntriesByEmpID();
            
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EntriesByByEmployeeID.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in EntriesByByEmployeeID.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }

            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }


        //gets/reads all an employees timesheet entries by the previous date
        public ActionResult GetTimeSheetEntriesByPreviousDate(TSEntryModel tsEntry)
        {
            //gets entries as Dataview
            itsApp.GetTimeSheetEntriesByDate(tsEntry.Date);
            EntriesByDate = itsApp.dvTimeSheetEntriesByDate();

            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EntriesByDate.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in EntriesByDate.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }

            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }


        //gets/reads all an employees timesheet entries by their date
        public ActionResult GetTimeSheetEntriesByDate(TSEntryModel tsEntry)
        {
            //gets entries as Dataview
            itsApp.GetTimeSheetEntriesByDate(tsEntry.Date);
            EntriesByDate = itsApp.dvTimeSheetEntriesByDate();

            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EntriesByDate.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in EntriesByDate.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }

            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }








        //gets/reads all an employees timesheet entries by their date and id
        public ActionResult GetTimeSheetEntriesByDateandEmpID(TSEntryModel tsEntry)
        {
            itsApp.GetTimeSheetEntriesByDateandEmpID(tsEntry.Date, tsEntry.EmployeeID);
            EntriesByDateAndEmployeeID = itsApp.dvTimeSheetEntriesByDateandEmpID();

            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EntriesByDateAndEmployeeID.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in EntriesByDateAndEmployeeID.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }

            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }


        //CRUD CREATE
        //inserts/creates a TSEntry, as an object type of TimeSheetEntry
        public string InsertTSEntry (TSEntryModel tsEntry)
        {
            //if the object has data, insert the data, else if there is no data just return a string
            if (tsEntry != null)
            {
                //create a new oTSEntry object 
                TimeSheetEntry oTSEntry = new TimeSheetEntry();
                //populate the object with the object data from tsEntry
                oTSEntry.EntryDate = tsEntry.Date;
                oTSEntry.EmployeeID = tsEntry.EmployeeID;
                oTSEntry.ProdZoneID = tsEntry.ProdZoneID;
                oTSEntry.StartTime = tsEntry.StartTime;
                oTSEntry.EndTime = tsEntry.EndTime;
                oTSEntry.EquipmentMeterReading = tsEntry.EquipmentMeterReading;
                oTSEntry.EquipmentNumber = tsEntry.EquipmentNumber;
                oTSEntry.ImplementNumber = tsEntry.ImplementNumber;
                oTSEntry.TaskWOID = tsEntry.Task_WO_ID;
                oTSEntry.FieldNumber = tsEntry.FieldNumber;
                //connect via interface to DAL App, and insert the ts entry as an object
                itsApp.InsertTSEntry(oTSEntry);
                return "Entry Added Successfully";
            }
            else
            {
                return "Entry Not Inserted! Try Again";
            }
        }
        //CRUD UPDATE
        //POST an update to the db
        //error checking
        public string UpdateTSEntry(TSEntryModel tsEntry)
        {
            if (tsEntry != null)
            {
                //create a new oTSEntry object 
                TimeSheetEntry oTSEntry = new TimeSheetEntry();
                //populate the object with the object data from tsEntry
                oTSEntry.TSEntryID = tsEntry.TSEntryID;
                oTSEntry.EntryDate = tsEntry.Date;
                oTSEntry.EmployeeID = tsEntry.EmployeeID;
                oTSEntry.ProdZoneID = tsEntry.ProdZoneID;
                oTSEntry.StartTime = tsEntry.StartTime;
                oTSEntry.EndTime = tsEntry.EndTime;
                oTSEntry.EquipmentMeterReading = tsEntry.EquipmentMeterReading;
                oTSEntry.EquipmentNumber = tsEntry.EquipmentNumber;
                oTSEntry.ImplementNumber = tsEntry.ImplementNumber;
                oTSEntry.TaskWOID = tsEntry.Task_WO_ID;
                oTSEntry.FieldNumber = tsEntry.FieldNumber;
                //connect via interface to DAL App, and update the ts entry as an object
                itsApp.UpdateTSEntry(oTSEntry);
                return "Entry Updated Successfully";
            }
            else
            {
                return "Entry Not Updated! Try Again";
            }
        }
        //CRUD DELETE
        //POST a deletion to the db
        //error checking
        public string DeleteTSEntry(TSEntryModel tsEntry)
        {
            if (tsEntry != null)
            {
                //create a new oTSEntry object 
                TimeSheetEntry oTSEntry = new TimeSheetEntry();
                //populate the object with the object data from tsEntry
                oTSEntry.TSEntryID = tsEntry.TSEntryID;
                oTSEntry.EntryDate = tsEntry.Date;
                oTSEntry.EmployeeID = tsEntry.EmployeeID;
                oTSEntry.ProdZoneID = tsEntry.ProdZoneID;
                oTSEntry.StartTime = tsEntry.StartTime;
                oTSEntry.EndTime = tsEntry.EndTime;
                oTSEntry.EquipmentMeterReading = tsEntry.EquipmentMeterReading;
                oTSEntry.EquipmentNumber = tsEntry.EquipmentNumber;
                oTSEntry.ImplementNumber = tsEntry.ImplementNumber;
                oTSEntry.TaskWOID = tsEntry.Task_WO_ID;
                oTSEntry.FieldNumber = tsEntry.FieldNumber;
                //connect via interface to DAL App, and delete the ts entry as an object. The DAL parses out just the tsEntry.TSEntryID, and removed the entry by it's particular id/insertion order
                itsApp.DeleteTSEntry(oTSEntry);
                return "Entry Deleted Successfully";
            }
            else
            {
                return "Entry Not Deleted! Try Again";
            }
        }


    }
}