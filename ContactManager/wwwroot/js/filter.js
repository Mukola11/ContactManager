document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.getElementById('filterInput');
    const contactsTable = document.getElementById('contactsTable');
    const errorMessage = document.createElement('div');
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    document.body.appendChild(errorMessage);

    filterInput.addEventListener('input', function () {
        const filterValue = filterInput.value.toLowerCase();
        if (filterValue === '') {
            const rows = document.querySelectorAll('#contactsTable tbody .contactRow');
            rows.forEach(row => {
                row.style.display = '';
            });
            errorMessage.style.display = 'none';
            return;
        }

        const invalidCharacters = /[^a-zA-Z0-9\s]/;
        if (invalidCharacters.test(filterValue)) {
            errorMessage.textContent = 'Please enter valid characters (letters, numbers, spaces only).';
            errorMessage.style.display = 'block';
            const rows = document.querySelectorAll('#contactsTable tbody .contactRow');
            rows.forEach(row => {
                row.style.display = 'none';
            });
            return;
        }

        errorMessage.style.display = 'none'; 
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
