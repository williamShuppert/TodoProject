namespace WebAPI.Models
{
    public class TodoList
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; }
    }
}
