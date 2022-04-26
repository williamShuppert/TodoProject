using Microsoft.Extensions.Configuration;
using System.Data;
using Dapper;
using System.Data.SqlClient;

namespace DataAccess
{
    public class DbContext : IDbContext
    {
        private readonly IConfiguration _config;

        public DbContext(IConfiguration config)
        {
            _config = config;
        }
        public async Task<U?> First<U>(string storedProcName, object parameters, string connectionId = "Default")
        {
            using System.Data.IDbConnection con = new SqlConnection(_config.GetConnectionString(connectionId));
            return (await con.QueryAsync<U>(storedProcName, parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        public async Task<IEnumerable<U>> Query<U, T>(string storedProcName, T parameters, string connectionId = "Default")
        {
            using System.Data.IDbConnection con = new SqlConnection(_config.GetConnectionString(connectionId));
            return await con.QueryAsync<U>(storedProcName, parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<U>> Query<U>(string storedProcName, string connectionId = "Default")
        {
            using System.Data.IDbConnection con = new SqlConnection(_config.GetConnectionString(connectionId));
            return await con.QueryAsync<U>(storedProcName, commandType: CommandType.StoredProcedure);
        }

        public async Task Execute<T>(string storedProcName, T parameters, string connectionId = "Default")
        {
            using System.Data.IDbConnection con = new SqlConnection(_config.GetConnectionString(connectionId));
            await con.ExecuteAsync(storedProcName, parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<Tuple<IEnumerable<RT1>, IEnumerable<RT2>>> QueryWithTwoReturns<RT1, RT2, P>(string storedProcName, P parameters, string connectionId = "Default")
        {
            using System.Data.IDbConnection con = new SqlConnection(_config.GetConnectionString(connectionId));
            var results = await con.QueryMultipleAsync(storedProcName, parameters, commandType: CommandType.StoredProcedure);
            return new (results.Read<RT1>(), results.Read<RT2>());
        }
    }
}