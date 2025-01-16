document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('contactsTable');
    const rows = Array.from(table.querySelectorAll('tbody .contactRow'));
    const sortableColumns = table.querySelectorAll('th.sortable');

    let sortDirections = {};

    sortableColumns.forEach(column => {
        column.addEventListener('click', function () {
            const columnIndex = column.cellIndex;
            const columnType = column.dataset.column;

            if (sortDirections[columnIndex] === undefined) {
                sortDirections[columnIndex] = true;
            }

            const isAscending = sortDirections[columnIndex];

            const sortedRows = rows.sort((a, b) => {
                const cellA = a.cells[columnIndex];
                const cellB = b.cells[columnIndex];

                let comparison = 0;

                try {
                    if (columnType === 'dob') {
                        const dateA = new Date(cellA.textContent.trim());
                        const dateB = new Date(cellB.textContent.trim());

                        if (isNaN(dateA) || isNaN(dateB)) {
                            throw new Error('Invalid date format');
                        }
                        comparison = dateA - dateB;
                    } else if (columnType === 'married') {
                        const boolA = cellA.querySelector('input[type="checkbox"]').checked;
                        const boolB = cellB.querySelector('input[type="checkbox"]').checked;
                        comparison = Number(boolA) - Number(boolB);
                    } else if (!isNaN(cellA.textContent.trim()) && !isNaN(cellB.textContent.trim())) {
                        comparison = parseFloat(cellA.textContent.trim()) - parseFloat(cellB.textContent.trim());
                    } else {
                        comparison = cellA.textContent.trim().localeCompare(cellB.textContent.trim());
                    }
                } catch (error) {
                    console.error('Error during comparison:', error.message);
                    comparison = 0; 
                }

                return isAscending ? comparison : -comparison;
            });

            sortedRows.forEach(row => table.querySelector('tbody').appendChild(row));

            sortDirections[columnIndex] = !isAscending;
        });
    });
});
