document.addEventListener('DOMContentLoaded', () => {
    const saveChangesForm = document.getElementById('saveChangesForm');
    const table = document.getElementById('contactsTable');

    saveChangesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedData = [];
        const rows = table.querySelectorAll('tbody .contactRow');
        let hasErrors = false;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const updatedRow = {};
            let rowHasError = false;

            cells.forEach((cell, index) => {
                const column = table.querySelectorAll('th')[index].dataset.column;
                if (column) {
                    const inputElement = cell.querySelector('input');

                    if (inputElement) {
                        let value;
                        if (inputElement.type === 'checkbox') {
                            value = inputElement.checked;
                        } else if (inputElement.type === 'date') {
                            const date = inputElement.value;
                            if (!date) {
                                alert(`Please provide a valid date for ${column}.`);
                                rowHasError = true;
                                hasErrors = true;
                                return;
                            }
                            value = new Date(date).toISOString().split('T')[0];
                        } else if (inputElement.type === 'number') {
                            value = inputElement.value;
                            if (isNaN(value) || value === '') {
                                alert(`Please provide a valid number for ${column}.`);
                                rowHasError = true;
                                hasErrors = true;
                                return;
                            }
                        } else {
                            value = inputElement.value;
                            if (value.trim() === '') {
                                alert(`Please provide a value for ${column}.`);
                                rowHasError = true;
                                hasErrors = true;
                                return;
                            }
                        }

                        updatedRow[column] = value;
                    } else {
                        updatedRow[column] = cell.textContent.trim();
                    }
                }
            });

            if (!rowHasError) {
                updatedData.push(updatedRow);
            }
        });

        if (hasErrors) {
            console.log("Please correct the errors before saving.");
            return;
        }

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
