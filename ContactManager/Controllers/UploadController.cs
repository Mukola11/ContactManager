using ContactManager.Data;
using ContactManager.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

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
        if (csvFile == null || csvFile.Length == 0)
        {
            TempData["ErrorMessage"] = "No file selected. Please upload a valid CSV file.";
            return RedirectToAction("Upload");
        }

        if (!csvFile.FileName.EndsWith(".csv"))
        {
            TempData["ErrorMessage"] = "Invalid file format. Please upload a CSV file.";
            return RedirectToAction("Upload");
        }

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            MissingFieldFound = null,
            HeaderValidated = null
        };

        try
        {
            using (var reader = new StreamReader(csvFile.OpenReadStream()))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<Contact>().ToList();

                var errorMessages = new List<string>();
                foreach (var record in records)
                {
                    if (string.IsNullOrEmpty(record.Name))
                    {
                        errorMessages.Add("Name is required.");
                    }

                    if (record.DateOfBirth == default(DateTime))
                    {
                        errorMessages.Add("Invalid or missing Date of Birth.");
                    }

                    if (string.IsNullOrEmpty(record.Phone))
                    {
                        errorMessages.Add("Phone number is required.");
                    }

                    if (record.Salary < 0)
                    {
                        errorMessages.Add("Salary cannot be negative.");
                    }

                    if (errorMessages.Any())
                    {
                        TempData["ErrorMessage"] = string.Join("<br>", errorMessages);
                        return RedirectToAction("Upload");
                    }

                    _context.Contacts.Add(record);
                }

                await _context.SaveChangesAsync();
            }

            TempData["SuccessMessage"] = "CSV file uploaded successfully!";
            return RedirectToAction("Index", "Contacts");
        }
        catch (CsvHelperException csvEx)
        {
            TempData["ErrorMessage"] = "Error reading the CSV file: " + csvEx.Message;
            return RedirectToAction("Upload");
        }
        catch (Exception ex)
        {
            TempData["ErrorMessage"] = "An unexpected error occurred: " + ex.Message;
            return RedirectToAction("Upload");
        }
    }
}
