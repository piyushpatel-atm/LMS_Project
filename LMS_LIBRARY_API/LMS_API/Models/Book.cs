namespace LMS_API.Models
{
    public class Book
    {
        public int Id { get; set; } 
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public float Price { get; set; } = 0;
        public bool Ordered { get; set; } = false;
        public string CategoryId { get; set; }
        public BookCategory Category { get; set; }=new BookCategory();
    }
}
