namespace WebAPI.Models
{
    public class TodoListItem
    {
        public int Id { get; set; }
        public int ListId { get; set; }
        public string Content { get; set; }
        public bool isComplete { get; set; }
    }
}
