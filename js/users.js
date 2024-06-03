document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    document.getElementById('add-user-form').addEventListener('submit', addUser);
    document.getElementById('edit-user-form').addEventListener('submit', saveUserChanges);
});

function fetchUsers() {
    fetch('http://localhost:8080/users')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';
            data.forEach(user => {
                appendUserToTable(user);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function addUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email: email,
        password: password
    };

    fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User added:', data);
        appendUserToTable(data);
        document.getElementById('add-user-form').reset();
    })
    .catch(error => console.error('Error adding user:', error));
}

function appendUserToTable(user) {
    const usersList = document.getElementById('users-list');
    const row = document.createElement('tr');

    // Create table cells for each property
    const idCell = document.createElement('td');
    idCell.textContent = user.id;
    const emailCell = document.createElement('td');
    emailCell.textContent = user.email;

    // Create edit and delete buttons
    const actionCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => editUser(user.id, user.email, user.password));
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteUser(user.id));
    const loansButton = document.createElement('button');
    loansButton.textContent = 'Expand Loans';
    loansButton.className = 'loans-button';
    loansButton.addEventListener('click', () => navigateToUserLoans(user.id));

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    actionCell.appendChild(loansButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(emailCell);
    row.appendChild(actionCell);

    // Append row to table body
    usersList.appendChild(row);
}

function deleteUser(userId) {
    fetch(`http://localhost:8080/deleteUser/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('User deleted');
            fetchUsers();
        } else {
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .catch(error => console.error('Error deleting user:', error));
}

function editUser(userId, email, password) {
    document.getElementById('edit-user-id').value = userId;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-password').value = password;
    document.getElementById('edit-user-form').style.display = 'block';
}

function saveUserChanges(event) {
    event.preventDefault();

    const userId = document.getElementById('edit-user-id').value;
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;

    const user = {
        email: email,
        password: password
    };

    fetch(`http://localhost:8080/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User updated:', data);
        fetchUsers();
        document.getElementById('edit-user-form').reset();
        document.getElementById('edit-user-form').style.display = 'none';
    })
    .catch(error => console.error('Error updating user:', error));
}

function navigateToUserLoans(userId) {
    window.location.href = `loans.html?userId=${userId}`;
}
