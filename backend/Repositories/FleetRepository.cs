using FleetManagement.Data;
using FleetManagement.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FleetManagement.Repositories
{
    public class FleetRepository : IFleetRepository
    {
        private readonly FleetDbContext _ctx;
        public FleetRepository(FleetDbContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<AssetType>> GetAssetTypesAsync()
        {
            return await _ctx.AssetTypes!.ToListAsync();
        }

        public async Task<IEnumerable<ServiceCenter>> GetServiceCentersAsync()
        {
            return await _ctx.ServiceCenters!.ToListAsync();
        }

        public async Task<IEnumerable<ServiceAppointment>> GetAppointmentsAsync()
        {
            return await _ctx.ServiceAppointments!.ToListAsync();
        }

        public async Task<ServiceAppointment> AddAppointmentAsync(ServiceAppointment appointment)
        {
            _ctx.ServiceAppointments!.Add(appointment);
            await _ctx.SaveChangesAsync();
            return appointment;
        }

        public async Task<ServiceAppointment?> UpdateAppointmentAsync(ServiceAppointment appointment)
        {
            var existing = await _ctx.ServiceAppointments!.FindAsync(appointment.Id);
            if (existing == null) return null;

            existing.AssetTypeId = appointment.AssetTypeId;
            existing.ServiceCenterId = appointment.ServiceCenterId;
            existing.AppointmentDate = appointment.AppointmentDate;
            existing.AssetYear = appointment.AssetYear;
            existing.AssetMake = appointment.AssetMake;
            existing.Notes = appointment.Notes;

            await _ctx.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var existing = await _ctx.ServiceAppointments!.FindAsync(id);
            if (existing == null) return false;
            _ctx.ServiceAppointments!.Remove(existing);
            await _ctx.SaveChangesAsync();
            return true;
        }
    }
}
