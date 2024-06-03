document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (userId) {
        document.getElementById('loan-user-id').value = userId;
        fetchUserLoans(userId);
    } else {
        fetchAllLoans();
    }

    document.getElementById('add-loan-form').addEventListener('submit', addLoan);
    document.getElementById('edit-loan-form').addEventListener('submit', saveLoanChanges);
});

function fetchUserLoans(userId) {
    fetch(`http://localhost:8080/loans/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const loansTable = document.getElementById('loans-list');
            loansTable.innerHTML = '';
            data.forEach(loan => {
                appendLoanToTable(loan);
            });
        })
        .catch(error => console.error('Error fetching loans:', error));
}

function fetchAllLoans() {
    fetch('http://localhost:8080/loan')
        .then(response => response.json())
        .then(data => {
            const loansTable = document.getElementById('loans-list');
            loansTable.innerHTML = '';
            data.forEach(loan => {
                appendLoanToTable(loan);
            });
        })
        .catch(error => console.error('Error fetching loans:', error));
}

function addLoan(event) {
    event.preventDefault();

    const userIdElement = document.getElementById('loan-user-id');
    const userId = userIdElement.value ? parseInt(userIdElement.value, 10) : parseInt(document.getElementById('user-id').value, 10);
    const bookId = parseInt(document.getElementById('book-id').value, 10);
    const loanDate = document.getElementById('loan-date').value;
    const returnDate = document.getElementById('return-date').value;

    const loan = {
        user_id: userId,
        book_id: bookId,
        loan_date: loanDate,
        return_date: returnDate
    };

    fetch('http://localhost:8080/loan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loan)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Loan added:', data);
        if (userId) {
            fetchUserLoans(userId);
        } else {
            fetchAllLoans();
        }
        document.getElementById('add-loan-form').reset();
    })
    .catch(error => {
        console.error('Error adding loan:', error);
        alert(error.message); // Display the error in a popup
    });
}

function appendLoanToTable(loan) {
    const loansTable = document.getElementById('loans-list');
    const row = document.createElement('tr');

    // Create table cells for each property
    const userIdCell = document.createElement('td');
    userIdCell.textContent = loan.user_id;
    const bookIdCell = document.createElement('td');
    bookIdCell.textContent = loan.book_id;
    const loanIdCell = document.createElement('td');
    loanIdCell.textContent = loan.id;
    const loanDateCell = document.createElement('td');
    loanDateCell.textContent = loan.loan_date;
    const returnDateCell = document.createElement('td');
    returnDateCell.textContent = loan.return_date;

    // Create edit and delete buttons
    const actionCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'loans-edit-button';
    editButton.addEventListener('click', () => editLoan(loan.id, loan.user_id, loan.book_id, loan.loan_date, loan.return_date));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'loans-delete-button';
    deleteButton.addEventListener('click', () => deleteLoan(loan.id, loan.user_id));
   

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
   


    row.appendChild(userIdCell);
    row.appendChild(bookIdCell);
    row.appendChild(loanIdCell);
    row.appendChild(loanDateCell);
    row.appendChild(returnDateCell);
    row.appendChild(actionCell);

    // Append row to table body
    loansTable.appendChild(row);
}

function deleteLoan(loanId, userId) {
    fetch(`http://localhost:8080/deleteLoan/${loanId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Loan deleted');
            if (userId) {
                fetchUserLoans(userId);
            } else {
                fetchAllLoans();
            }
        } else {
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .catch(error => console.error('Error deleting loan:', error));
}

function editLoan(loanId, userId, bookId, loanDate, returnDate) {
    document.getElementById('edit-loan-id').value = loanId;
    document.getElementById('edit-user-id').value = userId;
    document.getElementById('edit-book-id').value = bookId;
    document.getElementById('edit-loan-date').value = loanDate;
    document.getElementById('edit-return-date').value = returnDate;
    document.getElementById('edit-loan-form').style.display = 'block';
}

function saveLoanChanges(event) {
    event.preventDefault();

    const loanId = parseInt(document.getElementById('edit-loan-id').value, 10);
    const userId = parseInt(document.getElementById('edit-user-id').value, 10);
    const bookId = parseInt(document.getElementById('edit-book-id').value, 10);
    const loanDate = document.getElementById('edit-loan-date').value;
    const returnDate = document.getElementById('edit-return-date').value;

    const loan = {
        id: loanId,
        user_id: userId,
        book_id: bookId,
        loan_date: loanDate,
        return_date: returnDate
    };

    fetch(`http://localhost:8080/updateLoan/${loanId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loan)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Loan updated:', data);
        if (userId) {
            fetchUserLoans(userId);
        } else {
            fetchAllLoans();
        }
        document.getElementById('edit-loan-form').reset();
        document.getElementById('edit-loan-form').style.display = 'none';
    })
    .catch(error => {
        console.error('Error updating loan:', error);
        alert(error.message); // Display the error in a popup
    });
}
