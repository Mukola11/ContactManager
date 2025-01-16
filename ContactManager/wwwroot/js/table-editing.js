document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('contactsTable');
    const rows = Array.from(table.querySelectorAll('tbody .contactRow'));
    const saveChangesForm = document.getElementById('saveChangesForm');
    window.changesMade = false;

    rows.forEach(row => {
        row.addEventListener('click', function (event) {
            const cell = event.target.closest('td');
            if (!cell) return;

            const columnIndex = cell.cellIndex;
            const columnType = table.querySelectorAll('th')[columnIndex].dataset.column;

            if (cell.querySelector('input') || cell.querySelector('select')) return;

            const originalText = cell.textContent.trim();

            createEditableInput(cell, columnType, originalText);
        });
    });

    function createEditableInput(cell, columnType, originalText) {
        let input;

        if (columnType === 'dob') {
            const date = new Date(originalText);
            input = document.createElement('input');
            input.type = 'date';
            input.value = isNaN(date) ? '' : date.toISOString().split('T')[0];
        } else if (columnType === 'married') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = originalText === 'true';
        } else if (columnType === 'salary') {
            input = document.createElement('input');
            input.type = 'number';
            input.value = originalText;
            input.min = 0;
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = originalText;
        }

        input.classList.add('editable');
        cell.innerHTML = '';
        cell.appendChild(input);

        input.focus();

        input.addEventListener('blur', () => {
            saveChanges(cell, input, originalText);
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveChanges(cell, input, originalText);
            }
        });
    }

    function saveChanges(cell, inputElement, originalText) {
        const newValue = inputElement.value;

        if (newValue.trim() === '') {
            alert('This field cannot be empty');
            return;
        }

        if (inputElement.type === 'number' && isNaN(newValue)) {
            alert('Please enter a valid number for salary.');
            return;
        }

        if (inputElement.type === 'date' && new Date(newValue) == 'Invalid Date') {
            alert('Please enter a valid date.');
            return;
        }

        if (inputElement.type === 'checkbox' && typeof newValue !== 'boolean') {
            alert('Please check the checkbox to indicate marital status.');
            return;
        }

        if (newValue === originalText) {
            return;
        }

        cell.textContent = newValue;

        if (!window.changesMade) {
            saveChangesForm.style.display = 'block';
            window.changesMade = true;
        }
    }
});
