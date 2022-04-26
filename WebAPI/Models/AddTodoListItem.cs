namespace WebAPI.Models
{
    public class AddTodoListItem
    {
        public string Content { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsComplete { get; set; }
    }
}
