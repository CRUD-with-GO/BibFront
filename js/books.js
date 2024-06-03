document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    document.getElementById('add-book-form').addEventListener('submit', addBook);
    document.getElementById('edit-book-form').addEventListener('submit', saveBookChanges);
});

function fetchBooks() {
    fetch('http://localhost:8080/books')
        .then(response => response.json())
        .then(data => {
            const booksList = document.getElementById('books-list');
            booksList.innerHTML = '';
            data.forEach(book => {
                appendBookToTable(book);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

function appendBookToTable(book) {
    const tableBody = document.getElementById('books-list');
    const row = document.createElement('tr');

    // Create table cells for each property
    const idCell = document.createElement('td'); // New cell for book ID
    idCell.textContent = book.id; // Populate with book ID
    const titleCell = document.createElement('td');
    titleCell.textContent = book.title;
    const authorCell = document.createElement('td');
    authorCell.textContent = book.author;
    const isbnCell = document.createElement('td');
    isbnCell.textContent = book.isbn;

    // Create edit and delete buttons
    const actionCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => editBook(book.id, book.title, book.author, book.isbn));
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteBook(book.id));

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell); // Append book ID cell
    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(isbnCell);
    row.appendChild(actionCell);

    // Append row to table body
    tableBody.appendChild(row);
}


function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    const book = {
        title: title,
        author: author,
        isbn: isbn
    };

    fetch('http://localhost:8080/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Book added:', data);
        appendBookToTable(data);
        document.getElementById('add-book-form').reset();
    })
    .catch(error => console.error('Error adding book:', error));
}

function appendBookToList(book) {
    const booksList = document.getElementById('books-list');
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.setAttribute('data-id', book.id);
    bookItem.innerHTML = `
       ID:${book.id}  ,Title: ${book.title}, Author: ${book.author}, ISBN: ${book.isbn} 
        <button  onclick="deleteBook(${book.id})"style="background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
        <button  onclick="editBook(${book.id}, '${book.title}', '${book.author}', '${book.isbn}')" style="background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Edit</button>
    `;
    booksList.appendChild(bookItem);
}

function deleteBook(bookId) {
    fetch(`http://localhost:8080/deleteBook/${bookId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Book deleted');
            fetchBooks();
        } else {
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .catch(error => console.error('Error deleting book:', error));
}


function editBook(bookId, title, author, isbn) {
    document.getElementById('edit-book-id').value = bookId;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-author').value = author;
    document.getElementById('edit-isbn').value = isbn;
    document.getElementById('edit-book-form').style.display = 'block';
}
function saveBookChanges(event) {
    event.preventDefault();

    const bookId = document.getElementById('edit-book-id').value;
    const title = document.getElementById('edit-title').value;
    const author = document.getElementById('edit-author').value;
    const isbn = document.getElementById('edit-isbn').value;

    const book = {
        title: title,
        author: author,
        isbn: isbn
    };

    fetch(`http://localhost:8080/updateBook/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Book updated:', data);
        fetchBooks();
        document.getElementById('edit-book-form').reset();
        document.getElementById('edit-book-form').style.display = 'none';
    })
    .catch(error => console.error('Error updating book:', error));
}
