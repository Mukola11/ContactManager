using System.Text.Json.Serialization;

namespace ContactManager.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool Married { get; set; }
        public string Phone { get; set; }
        public decimal Salary { get; set; }
    }

    public class SaveChangesRequest
    {
        public List<Contact> UpdatedData { get; set; }
    }

}
