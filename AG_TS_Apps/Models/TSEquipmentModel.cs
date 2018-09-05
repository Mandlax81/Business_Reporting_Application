using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using TimeSheetsDAL;
using TimeSheetsDAL.TimeSheetTracking;

namespace AG_TS_Apps.Models
{
    public class TSEquipmentModel
    {
        public int EquipmentNumber { get; set; }
        public int TechID { get; set; }
        public int CostCenter { get; set; }
        public string EquipDescription { get; set; }
        public string EquipType { get; set; }
        public string UserStatus { get; set; }
        public bool Active { get; set; }
        public string FunctionalLocation { get; set; }
        public string FuncLocDescription { get; set; }
        public string EquipClass { get; set; }
        public string WorkCenter { get; set; }
        public string ActivityType { get; set; }
        public string MeasurementPoint { get; set; }
        public string EquipmentOrImplement { get; set; }
        public string EquipNumAndDesc { get; set; }

        //paramater less constructor to initialize all the values
        public TSEquipmentModel()
        {
        }
    }
}




//public int EquipmentNumber { get; set; } = 10002641;//change equipment numbers periodically to test the crud functionality
//public int TechID { get; set; } = 55555;
//public int CostCenter { get; set; } = 198100;
//public string EquipDesc { get; set; } = "Trailer:ChemicalMixStation,USSC";
//public string EquipType { get; set; } = "TRAILER";
//public string UserStatus { get; set; } = "ACTVOWND";
//public bool Active { get; set; } = true;
//public string FunctionalLocation { get; set; } = "USAG-04";
//public string FunctionalLocationDesc { get; set; } = "Management Area 04";
//public string EquipClass { get; set; } = "EquipClass";
//public string WorkCenter { get; set; } = "I19000";
//public string ActivityType { get; set; } = "TRAILR";
//public string MeasurementPoint { get; set; } = null;
//public string EorI { get; set; } = "I";
//public string EquipNumAndDesc { get; set; } = "10002637 - Trailer:ChemicalMixStation,USSC";
