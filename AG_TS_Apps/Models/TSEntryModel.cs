using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using TimeSheetsDAL;
using TimeSheetsDAL.TimeSheetTracking;

namespace AG_TS_Apps.Models
{
    public class TSEntryModel
    {
        public int TSEntryID { get; set; }
        public DateTime Date { get; set; }
        public int EmployeeID { get; set; }
        public int ProdZoneID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int EquipmentMeterReading { get; set; }
        public int EquipmentNumber { get; set; }
        public int ImplementNumber { get; set; }
        public string Task_WO_ID { get; set; }
        public string FieldNumber { get; set; }

        //paramater less constructor to initialize all the values
        public TSEntryModel()
        {
        }
    }
}