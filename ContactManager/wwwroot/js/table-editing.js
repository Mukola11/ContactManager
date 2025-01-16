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
            const columnType = table.querySelector('th').dataset.column;

            if (cell.querySelector('input') || cell.querySelector('select')) return;

            const originalText = cell.textContent.trim();

            createEditableInput(cell, columnType, originalText);
        });
    });

    function createEditableInput(cell, columnType, originalText) {
        let input;

        if (columnType === 'dob') {
            input = document.createElement('input');
            input.type = 'date';
            input.value = date.toISOString().split('T')[0];
        } else if (columnType === 'married') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = originalText === 'true';
        } else if (columnType === 'salary') {
            input = document.createElement('input');
            input.type = 'number';
            input.value = originalText;
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
        if (newValue === originalText) {
            return;
        }

        cell.textContent = newValue;


        if (!changesMade) {
            saveChangesForm.style.display = 'block';
            changesMade = true;
        }
    }
});
