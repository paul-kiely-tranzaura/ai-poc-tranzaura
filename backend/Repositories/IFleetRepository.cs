using FleetManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FleetManagement.Repositories
{
    public interface IFleetRepository
    {
        Task<IEnumerable<AssetType>> GetAssetTypesAsync();
        Task<IEnumerable<ServiceCenter>> GetServiceCentersAsync();
    }
}
