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
    public class TSMaintenanceOrderGroupController : Controller
    {
        //variables
        //stores configuration reference (connection string, etc.)
        private ITimeSheetApplication itsApp;

        //variable to store DataView
        public DataView MaintOrdGroup { get; set; }
        public DataView MaintOrdGroupByTA_Code { get; set; }

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
        public TSMaintenanceOrderGroupController()
        {
            itsApp = AgTSConnect();
        }

        // GET: /TSMaintenanceOrderGroup/Index
        public ActionResult Index()
        {
            return View();
        }

        //gets/reads only active=true maintenance order groups, used for tables
        //GET: /TSMaintenanceOrderGroup/GetMaintOrdGroup
        public ActionResult GetMaintOrdGroup()
        {
            //stores the first table
            MaintOrdGroup = itsApp.GetMaintOrdGroup().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in MaintOrdGroup.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in MaintOrdGroup.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }


            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that have Activity labeled as "true"
            var maintOrdGroupTableFilteredByActiveTrue = from x in parentRow
                                                         where x.Keys.Contains("Active")
                                                         && x.Values.Contains(true)
                                                         select x;

            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(maintOrdGroupTableFilteredByActiveTrue);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }


        //gets/reads Maintenance Orders by their id, used for tables
        //POST and GET: /TSMaintenanceOrderGroup/GetMaintOrdGroupByTA_Code
        public ActionResult GetMaintOrdGroupByTA_Code(TSMaintenanceOrderGroupModel tsMaintenanceOrder)
        {
            try
            {
                //gets entries as Dataview
                //stores the first table
                MaintOrdGroupByTA_Code = itsApp.GetMaintOrdGroupByTA_Code(tsMaintenanceOrder.TA_Code).Tables[0].DefaultView;
                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in MaintOrdGroupByTA_Code.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in MaintOrdGroupByTA_Code.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }
                string JsSerializer = JsonConvert.SerializeObject(parentRow);
                return Json(JsSerializer, JsonRequestBehavior.AllowGet);
            }
            //error handling, else it returns no value/null to the AngularJS method, 
            catch
            {
                return null;
            }
        }



        //inserts/creates a Maintenance Order Group object in the DAL->db
        //POST: /TSMaintenanceOrderGroup/InsertMaintOrdGroup
        public string InsertMaintOrdGroup(TSMaintenanceOrderGroupModel tsMaintenanceOrder)
        {
            try {
                //create a new DAL-based TaskWO-type object called oTaskWO
                MaintOrdGroup oMaintOrdGroup = new MaintOrdGroup();

                //populate the DAL-object with the MVC object data
                oMaintOrdGroup.TA_Code = tsMaintenanceOrder.TA_Code;
                oMaintOrdGroup.MaintOrdGroup = tsMaintenanceOrder.MaintOrdGrp;
                oMaintOrdGroup.Active = tsMaintenanceOrder.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.InsertMaintOrdGroup(oMaintOrdGroup);
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
        //POST: /TSMaintenanceOrderGroup/UpdateMaintOrdGroup
        public string UpdateMaintOrdGroup(TSMaintenanceOrderGroupModel tsMaintenanceOrder)
        {
            try
            {
                //create a new MaintOrdGroup-type object called oMaintOrdGroup
                MaintOrdGroup oMaintOrdGroup = new MaintOrdGroup();
                //populate the DAL-object with the MVC object data

                //populate the DAL-object with the MVC object data
                oMaintOrdGroup.TA_Code = tsMaintenanceOrder.TA_Code;
                oMaintOrdGroup.MaintOrdGroup = tsMaintenanceOrder.MaintOrdGrp;
                oMaintOrdGroup.Active = tsMaintenanceOrder.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.UpdateMaintOrdGroup(oMaintOrdGroup);
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
        //POST: /TSMaintenanceOrderGroup/DeleteMaintOrdGroup
        public string DeleteMaintOrdGroup(TSMaintenanceOrderGroupModel tsMaintenanceOrder)
        {
            try
            {
                //if the object has data, insert the data, else if there is no data just return a string

                //create a new MaintOrdGroup-type object called oMaintOrdGroup
                MaintOrdGroup oMaintOrdGroup = new MaintOrdGroup();

                //populate the DAL-object with the MVC object data
                oMaintOrdGroup.TA_Code = tsMaintenanceOrder.TA_Code;
                oMaintOrdGroup.MaintOrdGroup = tsMaintenanceOrder.MaintOrdGrp;
                //set the object property to false. When you load the table in, with the
                //GetMaintOrdGroup() method called and filering in only active=true objects,
                //you'll only get the objects labelled as true (i.e. not "deleted")
                oMaintOrdGroup.Active = false;

                //connect via interface to DAL App, and delete the object. The DAL parses out just the equipment number, deleting the object with that number
                itsApp.DeleteMaintOrdGroup(oMaintOrdGroup);
                return "Deleted";
            }
            catch
            {
                return "Not Deleted";
            }

        }

    }
}


