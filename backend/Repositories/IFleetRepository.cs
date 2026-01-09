using FleetManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FleetManagement.Repositories
{
    public interface IFleetRepository
    {
        Task<IEnumerable<AssetType>> GetAssetTypesAsync();
        Task<IEnumerable<ServiceCenter>> GetServiceCentersAsync();
        Task<IEnumerable<ServiceAppointment>> GetAppointmentsAsync();
        Task<ServiceAppointment> AddAppointmentAsync(ServiceAppointment appointment);
        Task<ServiceAppointment?> UpdateAppointmentAsync(ServiceAppointment appointment);
        Task<bool> DeleteAppointmentAsync(int id);
    }
}
