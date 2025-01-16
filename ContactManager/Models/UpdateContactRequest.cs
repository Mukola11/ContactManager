namespace ContactManager.Models
{
    public class UpdateContactRequest
    {
        public int Id { get; set; }
        public string Column { get; set; }
        public object Value { get; set; }
    }
}
