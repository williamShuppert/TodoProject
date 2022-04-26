namespace DataAccess
{
    public interface IDbContext
    {
        Task<U?> First<U>(string storedProcName, object parameters, string connectionId = "Default");
        Task<IEnumerable<U>> Query<U, T>(string storedProcName, T parameters, string connectionId = "Default");
        Task<IEnumerable<U>> Query<U>(string storedProcName, string connectionId = "Default");
        Task Execute<T>(string storedProcName, T parameters, string connectionId = "Default");
        Task<Tuple<IEnumerable<RT1>, IEnumerable<RT2>>> QueryWithTwoReturns<RT1, RT2, P>(string storedProcName, P parameters, string connectionId = "Default");
    }
}
