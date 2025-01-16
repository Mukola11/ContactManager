using ContactManager.Data;
using ContactManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace ContactManager.Controllers
{
    public class ContactsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var contacts = await _context.Contacts.ToListAsync();
            return View(contacts);
        }

        [HttpPost]
        public async Task<IActionResult> SaveChanges([FromBody] SaveChangesRequest request)
        {
            if (request?.UpdatedData == null || !request.UpdatedData.Any())
            {
                return Json(new { success = false, message = "No data provided" });
            }

            foreach (var contact in request.UpdatedData)
            {
                if (string.IsNullOrEmpty(contact.Name))
                {
                    return Json(new { success = false, message = "Name is required" });
                }

                if (string.IsNullOrEmpty(contact.Phone) || !Regex.IsMatch(contact.Phone, @"^\d{3}-\d{3}-\d{4}$"))
                {
                    return Json(new { success = false, message = "Invalid phone number format. Use xxx-xxx-xxxx." });
                }

                var existingContact = await _context.Contacts
                    .FirstOrDefaultAsync(c => c.Id == contact.Id);
                if (existingContact != null)
                {
                    existingContact.Name = contact.Name;
                    existingContact.DateOfBirth = contact.DateOfBirth;
                    existingContact.Married = contact.Married;
                    existingContact.Phone = contact.Phone;
                    existingContact.Salary = contact.Salary;
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch (DbUpdateException ex)
            {
                return Json(new { success = false, message = "An error occurred while saving changes.", error = ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync(); 

            return RedirectToAction("Index"); 
        }
    }
}
