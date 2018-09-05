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
    public class TSEquipmentController : Controller
    {
        //variables
        //stores configuration reference (connection string, etc.)
        private ITimeSheetApplication itsApp;
        //variable to store DataView
        public DataView Equipment { get; set; }
        public DataView EquipmentByNumber { get; set; }
        public DataView EquipmentByType { get; set; }

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
        public TSEquipmentController() 
        {
            itsApp = AgTSConnect();
        }

        // GET: Equipment
        public ActionResult Index()
        {
            return View();
        }

        //gets/reads all equipment, used for dropdown list
        public ActionResult GetEquipment()
        {
            //stores the first table
            Equipment = itsApp.GetEquipment().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in Equipment.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in Equipment.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that have Activity labeled as "true"
            //var equipmentTableFilteredByActiveTrue = from x in parentRow
            //                                         where x.Keys.Contains("Active")
            //                                         && x.Values.Contains(true)
            //                                         select x;
            //serialized the data into javascript
            //string JsSerializer = JsonConvert.SerializeObject(equipmentTableFilteredByActiveTrue);
            string JsSerializer = JsonConvert.SerializeObject(parentRow);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }



        //gets/reads all equipment types (i.e. E or I), used for dropdown list
        //GET: /TSEquipment/GetEquipmentByType
        public ActionResult GetEquipmentByType()
        {
            //stores the first table
            EquipmentByType = itsApp.GetEquipment().Tables[0].DefaultView;

            //uses Datatable format, filters by the EquipmentOrImplement column,
            //only returning the rows with values that are distinct/unique in relation to each other,
            //Then encapsulates the distinct/unique values back into DataView format
            DataTable distinctTask = EquipmentByType.ToTable(true, "EquipmentOrImplement");
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
            //string JsSerializer = JsonConvert.SerializeObject(equipmentTableFilteredByActiveTrue);
            string JsSerializer = JsonConvert.SerializeObject(parentRow);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }




        //gets/reads equipment by their id/equipmentnumber
        public ActionResult GetEquipmentByEquipmentNumber(TSEquipmentModel tsEquipment)
        {
            //gets entries as Dataview
            //stores the first table
            EquipmentByNumber = itsApp.GetEquipmentByEquipmentNumber(tsEquipment.EquipmentNumber).Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in EquipmentByNumber.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in EquipmentByNumber.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            string JsSerializer = JsonConvert.SerializeObject(parentRow);
            return Json(JsSerializer, JsonRequestBehavior.AllowGet);
        }

        //inserts/creates an Equipment object in the DAL->db
        public string InsertEquipment(TSEquipmentModel tsEquipment)
        {
            //if the object has data, insert the data, else if there is no data just return a string
            if (tsEquipment != null)
            {
                //create a new Equipment-type object called oEquipment
                Equipment oEquipment = new Equipment();
                //populate the DAL-object with the MVC object data
                oEquipment.EquipmentNumber = tsEquipment.EquipmentNumber;
                oEquipment.TechID = tsEquipment.TechID;
                oEquipment.CostCenter = tsEquipment.CostCenter;
                oEquipment.EquipDesc = tsEquipment.EquipDescription;
                oEquipment.EquipmentNumber = tsEquipment.EquipmentNumber;
                oEquipment.EquipType = tsEquipment.EquipType;
                oEquipment.UserStatus = tsEquipment.UserStatus;
                oEquipment.Active = tsEquipment.Active;
                oEquipment.FunctionalLocation = tsEquipment.FunctionalLocation;
                oEquipment.FunctionalLocationDesc = tsEquipment.FuncLocDescription;
                oEquipment.EquipClass = tsEquipment.EquipClass;
                oEquipment.WorkCenter = tsEquipment.WorkCenter;
                oEquipment.ActivityType = tsEquipment.ActivityType;
                oEquipment.MeasurementPoint = tsEquipment.MeasurementPoint;
                oEquipment.EorI = tsEquipment.EquipmentOrImplement;
                //connect via interface to DAL App, and insert the object
                itsApp.InsertEquipment(oEquipment);
                return "Equipment Added Successfully";
            }
            else
            {
                return "Equipment Not Inserted! Try Again";
            }
        }

        //CRUD UPDATE
        //POST an update to the db
        //error checking
        public string UpdateEquipment(TSEquipmentModel tsEquipment)
        {
            if (tsEquipment != null)
            {
                //create a new Equipment-type object called oEquipment
                Equipment oEquipment = new Equipment();
                //populate the DAL-object with the MVC object data
                oEquipment.EquipmentNumber = tsEquipment.EquipmentNumber;
                oEquipment.TechID = tsEquipment.TechID;
                oEquipment.CostCenter = tsEquipment.CostCenter;
                oEquipment.EquipDesc = tsEquipment.EquipDescription;
                oEquipment.EquipmentNumber = tsEquipment.EquipmentNumber;
                oEquipment.EquipType = tsEquipment.EquipType;
                oEquipment.UserStatus = tsEquipment.UserStatus;
                oEquipment.Active = tsEquipment.Active;
                oEquipment.FunctionalLocation = tsEquipment.FunctionalLocation;
                oEquipment.FunctionalLocationDesc = tsEquipment.FuncLocDescription;
                oEquipment.EquipClass = tsEquipment.EquipClass;
                oEquipment.WorkCenter = tsEquipment.WorkCenter;
                oEquipment.ActivityType = tsEquipment.ActivityType;
                oEquipment.MeasurementPoint = tsEquipment.MeasurementPoint;
                oEquipment.EorI = tsEquipment.EquipmentOrImplement;
                //connect via interface to DAL App, and insert the object
                itsApp.UpdateEquipment(oEquipment);
                return "Equipment Updated Successfully";
            }
            else
            {
                return "Equipment Not Updated! Try Again";
            }
        }

        //CRUD DELETE
        //POST a deletion to the db
        //error checking
        public string DeleteEquipment(TSEquipmentModel tsEquipment)
        {
            if (tsEquipment != null)
            {
                //create a new Equipment-type object called oEquipment
                Equipment oEquipment = new Equipment();
                //populate the DAL-object with the MVC object data
                oEquipment.EquipmentNumber = tsEquipment.EquipmentNumber;
                oEquipment.TechID = tsEquipment.TechID;
                oEquipment.CostCenter = tsEquipment.CostCenter;
                oEquipment.EquipDesc = tsEquipment.EquipDescription;
                oEquipment.EquipmentNumber = tsEquipment.EquipmentNumber;
                oEquipment.EquipType = tsEquipment.EquipType;
                oEquipment.UserStatus = tsEquipment.UserStatus;
                oEquipment.Active = tsEquipment.Active;
                oEquipment.FunctionalLocation = tsEquipment.FunctionalLocation;
                oEquipment.FunctionalLocationDesc = tsEquipment.FuncLocDescription;
                oEquipment.EquipClass = tsEquipment.EquipClass;
                oEquipment.WorkCenter = tsEquipment.WorkCenter;
                oEquipment.ActivityType = tsEquipment.ActivityType;
                oEquipment.MeasurementPoint = tsEquipment.MeasurementPoint;
                oEquipment.EorI = tsEquipment.EquipmentOrImplement;
                //connect via interface to DAL App, and delete the object. The DAL parses out just the equipment number, deleting the object with that number
                itsApp.DeleteEquipment(oEquipment);
                return "Equipment Deleted Successfully";
            }
            else
            {
                return "Equipment Not Deleted! Try Again";
            }
        }

    }
}