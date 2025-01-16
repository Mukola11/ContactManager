using ContactManager.Data;
using ContactManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
            if (request.UpdatedData != null && request.UpdatedData.Any())
            {
                foreach (var contact in request.UpdatedData)
                {
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

                await _context.SaveChangesAsync();

                return Json(new { success = true });
            }

            return Json(new { success = false });
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
