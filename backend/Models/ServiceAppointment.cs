using System;

namespace FleetManagement.Models
{
    public class ServiceAppointment
    {
        public int Id { get; set; }
        public int AssetTypeId { get; set; }
        public int ServiceCenterId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}
