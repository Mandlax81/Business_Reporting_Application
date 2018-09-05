using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AG_TS_Apps.Models
{
    public class TSMaintenanceOrderActivityModel
    {
        public int TA_RecID { get; set; }
        public string Task { get; set; }
        public string CombinedActivities { get; set; }
        public int TA_Code { get; set; }

        //set Active to true on default in the constructor. 
        //Only display the active items in the front-end
        //The user should not have the ability to set it as inactive.
        //it gives the user the illusion of a deletion, 
        //but really we keep all of the data
        //Only the db admin can really delete the data
        public bool Active { get; set; } = true;

        //paramater less constructor to initialize all the values
        public TSMaintenanceOrderActivityModel()
        {
        }
    }
}