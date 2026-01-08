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
    }
}
