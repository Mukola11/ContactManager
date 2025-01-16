document.addEventListener('DOMContentLoaded', () => {

    const filterInput = document.getElementById('filterInput');


    filterInput.addEventListener('input', function () {
        const filterValue = filterInput.value.toLowerCase();
        const rows = document.querySelectorAll('#contactsTable tbody .contactRow');

        rows.forEach(row => {
            let rowText = row.textContent.toLowerCase();
            if (rowText.includes(filterValue)) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none'; 
            }
        });
    });
});
