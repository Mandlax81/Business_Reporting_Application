using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AG_TS_Apps.Models
{
    public class TSTaskWorkOrderModel
    {
        public string Task_WO_ID { get; set; }
        public string TaskType { get; set; }
        public string ExpenseType { get; set; }
        public string TaskDescription { get; set; }
        public string TaskPurpose { get; set; }
        //property TaskWO only used to display dropdown content to user
        public string TaskWO { get; set; }
        public bool Active { get; set; } = true;

        //public string Task_WO_ID { get; set; } = "SuperDuper";
        //public string TaskType { get; set; } = "RichManAtNight";
        //public string ExpenseType { get; set; } = "Expense";
        //public string TaskDescription { get; set; } = "Road Maintenance";
        //public string TaskPurpose { get; set; } = "Road Building, repairs and maintenance, 2 Ton, Rock Crusher, Grader, Loader";
        //public string TaskWO { get; set; } = "Roads - Road Maintenance";
        //public bool Active { get; set; } = true;

        //paramater less constructor to initialize all the values
        public TSTaskWorkOrderModel()
        {
        }
    }
}