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
    public class TSEmployeeController : Controller
    {
        //variables
        //stores configuration reference (connection string, etc.)
        private ITimeSheetApplication itsApp;
        //variable to store DataView
        public DataView Employee { get; set; }
        public DataView EmployeeByEmployeeID { get; set; }
        public DataView EmployeesByEmployeeIDInactive { get; set; }

        

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
        public TSEmployeeController()
        {
            itsApp = AgTSConnect();
        }

        // GET: TSEmployee
        public ActionResult Index()
        {
            return View();
        }

        //gets/reads all employees, including active and inactive used for dropdown list and/or tables
        public ActionResult GetEmployeesAll()
        {
            //stores the first table
            Employee = itsApp.GetEmployees().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in Employee.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in Employee.Table.Columns)
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




        //gets/reads all active employees, used for dropdown list and/or tables
        public ActionResult GetEmployeesActive()
        {
            //stores the first table
            Employee = itsApp.GetEmployees().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in Employee.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in Employee.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that have Activity labeled as "true"
            var employeeTableFilteredByActiveTrue = from x in parentRow
                                                    where x.Keys.Contains("Active")
                                                    && x.Values.Contains(true)
                                                    select x;
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(employeeTableFilteredByActiveTrue);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }

        //gets/reads all inactive employees, used for dropdown list and/or tables
        //GET: /TSEmployee/GetEmployeesInactive
        public ActionResult GetEmployeesInactive()
        {
            //stores the first table
            Employee = itsApp.GetEmployees().Tables[0].DefaultView;
            //serializes/converts the DataView to JSON
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in Employee.Table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in Employee.Table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            //takes the List, and filters through to data using LINQ to SQL format, 
            //gets only the rows of data that have Activity labeled as "true"
            var employeeTableFilteredByActiveFalse = from x in parentRow
                                                    where x.Keys.Contains("Active")
                                                    && x.Values.Contains(false)
                                                    select x;
            //serialized the data into javascript
            string JsSerializer = JsonConvert.SerializeObject(employeeTableFilteredByActiveFalse);

            //this sets the Json data allowance to it's max value. Otherwise, Json will limit the Equipment data from displaying
            JsonResult json = Json(JsSerializer, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }

        //GET and POST: /TSEmployee/GetEmployeesByEmployeeID
        //gets/reads active employee by their employee id
        public ActionResult GetEmployeesByEmployeeID(TSEmployeeModel tsEmployee)
        {
            if (tsEmployee.EmployeeID != 0)
            {

                //gets entries as Dataview
                //stores the first table
                EmployeeByEmployeeID = itsApp.GetEmployeesByEmployeeID(tsEmployee.EmployeeID).Tables[0].DefaultView;

                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in EmployeeByEmployeeID.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in EmployeeByEmployeeID.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }



                //takes the List, and filters through to data using LINQ to SQL format, 
                //gets only the rows of data that have Activity labeled as "true"
                var employeeByIDFilteredByActiveTrue = from x in parentRow
                                                         where x.Keys.Contains("Active")
                                                         && x.Values.Contains(true)
                                                         select x;



                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                string JsSerializer = JsonConvert.SerializeObject(employeeByIDFilteredByActiveTrue);
                return Json(JsSerializer, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Content("[]");
            }
        }


        //GET and POST: /TSEmployee/GetEmployeesByEmployeeIDInactive
        //gets/reads inactive employee by their employee id
        public ActionResult GetEmployeesByEmployeeIDInactive(TSEmployeeModel tsEmployee)
        {
            if (tsEmployee.EmployeeID != 0)
            {
                //gets entries as Dataview
                //stores the first table
                EmployeesByEmployeeIDInactive = itsApp.GetEmployeesByEmployeeID(tsEmployee.EmployeeID).Tables[0].DefaultView;

                List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
                Dictionary<string, object> childRow;
                foreach (DataRow row in EmployeesByEmployeeIDInactive.Table.Rows)
                {
                    childRow = new Dictionary<string, object>();
                    foreach (DataColumn col in EmployeesByEmployeeIDInactive.Table.Columns)
                    {
                        childRow.Add(col.ColumnName, row[col]);
                    }
                    parentRow.Add(childRow);
                }


                //takes the List, and filters through to data using LINQ to SQL format, 
                //gets only the rows of data that have Activity labeled as "false"
                var employeeByIDFilteredByActiveFalse = from x in parentRow
                                                       where x.Keys.Contains("Active")
                                                       && x.Values.Contains(false)
                                                       select x;



                //serializes/converts the DataView to JSON
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();

                string JsSerializer = JsonConvert.SerializeObject(employeeByIDFilteredByActiveFalse);
                return Json(JsSerializer, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Content("[]");
            }
        }




        //inserts/creates an Employee object in the DAL->db
        public string InsertEmployee(TSEmployeeModel tsEmployee)
        {   //error checking. If any of the required values are null or 0, return a error message to AngularJS's backend, while will then create a pop-up rejection message
            //if the object has data, insert the data, else if there is no data just return a string
            if (tsEmployee != null && 
                tsEmployee.EmployeeID != 0 //&&
                //tsEmployee.EmployeeName != null && 
                //tsEmployee.CostCenter != null &&
                //tsEmployee.CostCtr != null &&
                //tsEmployee.OrganizationalUnit != null &&
                //tsEmployee.EmployeeSubGroup != null &&
                //tsEmployee.Job != null &&
                //tsEmployee.PSubArea != null &&
                //tsEmployee.PersonnelSubArea != null &&
                //tsEmployee.EmployeeGroup != null
                )
            {
                //create a new Employee-type object called oEmployee
                Employee oEmployee = new Employee();
                //populate the DAL-object with the MVC object data
                oEmployee.EmployeeID = tsEmployee.EmployeeID;
                oEmployee.ShortEmployeeID = tsEmployee.ShortEmployeeID;
                oEmployee.EmployeeName = tsEmployee.EmployeeName;
                oEmployee.CostCtr = tsEmployee.CostCtr;
                oEmployee.CostCenter = tsEmployee.CostCenter;
                oEmployee.OrganizationalUnit = tsEmployee.OrganizationalUnit;
                oEmployee.EmployeeSubGroup = tsEmployee.EmployeeSubGroup;
                oEmployee.Job = tsEmployee.Job;
                oEmployee.PSubArea = tsEmployee.PSubArea;
                oEmployee.PersonnelSubArea = tsEmployee.PersonnelSubArea;
                oEmployee.EmployeeGroup = tsEmployee.EmployeeGroup;
                oEmployee.ActivityType = tsEmployee.ActivityType;
                oEmployee.WorkCenter = tsEmployee.WorkCenter;
                oEmployee.Active = tsEmployee.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.InsertEmployee(oEmployee);
                return "Employee Added Successfully";
            }
            else
            {
                return "Employee Not Inserted! Try Again";
            }
        }

        //CRUD UPDATE
        //POST an update to the db
        //error checking
        public string UpdateEmployee(TSEmployeeModel tsEmployee)
        {
            if (tsEmployee != null)
            {
                //create a new Employee-type object called oEmployee
                Employee oEmployee = new Employee();
                //populate the DAL-object with the MVC object data
                oEmployee.EmployeeID = tsEmployee.EmployeeID;
                oEmployee.ShortEmployeeID = tsEmployee.ShortEmployeeID;
                oEmployee.EmployeeName = tsEmployee.EmployeeName;
                oEmployee.CostCtr = tsEmployee.CostCtr;
                oEmployee.CostCenter = tsEmployee.CostCenter;
                oEmployee.OrganizationalUnit = tsEmployee.OrganizationalUnit;
                oEmployee.EmployeeSubGroup = tsEmployee.EmployeeSubGroup;
                oEmployee.Job = tsEmployee.Job;
                oEmployee.PSubArea = tsEmployee.PSubArea;
                oEmployee.PersonnelSubArea = tsEmployee.PersonnelSubArea;
                oEmployee.EmployeeGroup = tsEmployee.EmployeeGroup;
                oEmployee.ActivityType = tsEmployee.ActivityType;
                oEmployee.WorkCenter = tsEmployee.WorkCenter;
                oEmployee.Active = tsEmployee.Active;

                //connect via interface to DAL App, and insert the object
                itsApp.UpdateEmployee(oEmployee);
                return "Employee Updated Successfully";
            }
            else
            {
                return "Employee Not Updated! Try Again";
            }
        }

        //Function DeleteEmployee(ByVal oEmployee As Employee)    ' - deletes employee record

        //CRUD DELETE
        //POST a deletion to the db
        //error checking
        public string DeleteEmployee(TSEmployeeModel tsEmployee)
        {
            if (tsEmployee != null)
            {
                //create a new Employee-type object called oEmployee
                Employee oEmployee = new Employee();
                //populate the DAL-object with the MVC object data
                oEmployee.EmployeeID = tsEmployee.EmployeeID;
                oEmployee.ShortEmployeeID = tsEmployee.ShortEmployeeID;
                oEmployee.EmployeeName = tsEmployee.EmployeeName;
                oEmployee.CostCtr = tsEmployee.CostCtr;
                oEmployee.CostCenter = tsEmployee.CostCenter;
                oEmployee.OrganizationalUnit = tsEmployee.OrganizationalUnit;
                oEmployee.EmployeeSubGroup = tsEmployee.EmployeeSubGroup;
                oEmployee.Job = tsEmployee.Job;
                oEmployee.PSubArea = tsEmployee.PSubArea;
                oEmployee.PersonnelSubArea = tsEmployee.PersonnelSubArea;
                oEmployee.EmployeeGroup = tsEmployee.EmployeeGroup;
                oEmployee.ActivityType = tsEmployee.ActivityType;
                oEmployee.WorkCenter = tsEmployee.WorkCenter;
                oEmployee.Active = tsEmployee.Active;

                //connect via interface to DAL App, and delete the object. The DAL parses out just the id, deleting the object with that id
                itsApp.DeleteEmployee(oEmployee);
                return "Employee Deleted Successfully";
            }
            else
            {
                return "Employee Not Deleted! Try Again";
            }
        }



    }
}