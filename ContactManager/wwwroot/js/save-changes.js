document.addEventListener('DOMContentLoaded', () => {
    const saveChangesForm = document.getElementById('saveChangesForm');
    const table = document.getElementById('contactsTable');

    saveChangesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedData = [];
        const rows = table.querySelectorAll('tbody .contactRow');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const updatedRow = {};

            cells.forEach((cell, index) => {
                const column = table.querySelectorAll('th')[index].dataset.column; 
                if (column) {
                    const inputElement = cell.querySelector('input');

                    if (inputElement) {
                        if (inputElement.type === 'checkbox') {
                            updatedRow[column] = inputElement.checked;
                        } else if (inputElement.type === 'date') {
                            const date = inputElement.value;
                            updatedRow[column] = date ? new Date(date).toISOString().split('T')[0] : null;
                        } else {
                            updatedRow[column] = inputElement.value;
                        }
                    } else {
                        updatedRow[column] = cell.textContent.trim();
                    }
                }
            });
            updatedData.push(updatedRow);
        });

        fetch('/contacts/saveChanges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updatedData }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Changes are saved!');
                    saveChangesForm.style.display = 'none';
                    changesMade = false; 
                } else {
                    console.error('Failed to save changes');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
