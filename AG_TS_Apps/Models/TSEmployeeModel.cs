using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AG_TS_Apps.Models
{
    public class TSEmployeeModel
    {
        public int EmployeeID { get; set; }
        public int ShortEmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string CostCtr { get; set; }
        public string CostCenter { get; set; }
        public string OrganizationalUnit { get; set; }
        public string EmployeeSubGroup { get; set; }
        public string Job { get; set; }
        public string PSubArea { get; set; }
        public string PersonnelSubArea { get; set; }
        public string EmployeeGroup { get; set; }
        public string ActivityType { get; set; }
        public string WorkCenter { get; set; }
        public bool Active { get; set; }

        //paramater less constructor to initialize all the values
        public TSEmployeeModel()
        {
        }
    }
}