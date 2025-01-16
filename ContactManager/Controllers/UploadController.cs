using ContactManager.Data;
using ContactManager.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

public class UploadController : Controller
{
    private readonly ApplicationDbContext _context;

    public UploadController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Upload()
    {
        return View("~/Views/Contacts/Upload.cshtml");
    }

    [HttpPost]
    public async Task<IActionResult> UploadCSV(IFormFile csvFile)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            MissingFieldFound = null,
            HeaderValidated = null
        };

        if (csvFile != null && csvFile.Length > 0)
        {
            using (var reader = new StreamReader(csvFile.OpenReadStream()))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<Contact>().ToList();

                foreach (var record in records)
                {
                    _context.Contacts.Add(record);
                }

                await _context.SaveChangesAsync();
            }

            TempData["SuccessMessage"] = "CSV file uploaded successfully!";
            return RedirectToAction("Index", "Contacts");
        }

        TempData["ErrorMessage"] = "Please upload a valid CSV file.";
        return RedirectToAction("Upload");
    }
}
