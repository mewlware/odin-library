// Query starting DOM elements
const libraryWrapper = document.querySelector(".library-wrapper")
const addBtn = document.querySelector(".add")
const editBtn = document.querySelector(".edit")
const stopEditBtn = document.querySelector(".stop-edit")

let books = libraryWrapper.querySelectorAll(":scope > .book");

// Initialize empty library (Object)
let library = {}
let indexArray = []

// Book Object constructor
function Book(title, author, read) {
    this.title = title;
    this.author = author;
    this.read = read;
}

// Adding books to library
/// Creating random index number for book
const MAX = 1000

function randomIntIndex(max) {
    return Math.floor(Math.random() * max)
}

// Making unique new index for book
function uniqueNewBookIndex() {
    let index = 0;
    let indexExists = true

    while (indexExists == true) {
        index = randomIntIndex(MAX)
        console.log(index)
        if (!(index in library)) {
            indexExists = false
        }
    }

    return index;
}


// Adding book to library
function addBookObject(index, title, author, read) {
    let newBook = new Book(title, author, read)
    library[index] = newBook;
}

// Deleting book to library
function deleteBookObject(index) {
    delete library[index]
}

// Add book to DOM

function addBookDOM(index, title, author, read) {
    const newBookDOM = document.createElement("article");
    let readData = ""
    if (read) {
        readData = "read"
    } else if (!read) {
        readData = "not-read"
    }

    newBookDOM.classList.add('book');
    newBookDOM.dataset.index = index;
    newBookDOM.dataset.read = readData;

    const titleDOM = document.createElement("h3");
    titleDOM.classList.add('title');
    titleDOM.textContent = title;

    const authorDOM = document.createElement("p");
    authorDOM.classList.add('author');
    authorDOM.textContent = author;

    const readDOM = document.createElement("p");
    
    readDOM.classList.add('readData', readData);
    readDOM.textContent = readData;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = 'X'
    deleteBtn.classList.add('delete', 'hidden');
    deleteBtn.disabled = true;

    newBookDOM.appendChild(titleDOM);
    newBookDOM.appendChild(authorDOM);
    newBookDOM.appendChild(readDOM);
    newBookDOM.appendChild(deleteBtn);

    libraryWrapper.appendChild(newBookDOM);
}

// Delete book from DOM 

function deleteBookDOM(index) {
    bookToDelete = document.querySelector(`[data-index="${index}"]`);
    bookToDelete.remove()
}

function deleteBtnWrapper(button) {
    index = button.parentElement.dataset.index;
    deleteBookDOM(index);
    deleteBookObject(index);
}

function enableDeleteBtn(button) {
    button.disabled = false;
    button.classList.remove('hidden');
    button.addEventListener('click', () => {
        deleteBtnWrapper(button)
    });
}

function disableDeleteBtn(button) {
    button.disabled = true;
    button.classList.add('hidden');
    button.removeEventListener('click', deleteBtnWrapper);
}

function promptAddBook() {
    let title = prompt("Title?");
    let author = prompt("Author?");
    let read = confirm("Read or Not? Ok = read, cancel = not");
    let index = uniqueNewBookIndex();

    addBookObject(index, title, author, read);
    addBookDOM(index, title, author, read);
    console.log(library)
}

function disabledAddBtn() {
    addBtn.disabled = true;
}

function enableAddBtn() {
    addBtn.disabled = false;
}

function toggleEditBtns() {
    editBtn.classList.toggle('hidden');
    stopEditBtn.classList.toggle('hidden');

    if (editBtn.classList.contains('hidden')) {
        editBtn.disabled = true;
        stopEditBtn.disabled = false;
    } else if (stopEditBtn.classList.contains('hidden')) {
        stopEditBtn.disabled = true;
        editBtn.disabled = false;
    }
}

function enableEditing() {
    books.forEach((book) => { 
        for (i = 0; i < book.children.length; i++) {
            if (book.children[i].classList.contains('title')) {
                book.children[i].contentEditable = "true";
            } else if (book.children[i].classList.contains('author')) {
                book.children[i].contentEditable = "true";
            } else if (book.children[i].classList.contains('delete')) {
                book.children[i].disabled = false;
                book.children[i].classList.toggle('hidden')
                enableDeleteBtn(book.children[i])
            } else if (book.children[i].classList.contains('readData')) {
                enableToggleRead(book.children[i])
            }
        }
    })
}

function disableEditing() {
    books.forEach((book) => {
        for (i = 0; i < book.children.length; i++) {
            if (book.children[i].classList.contains('title')) {
                book.children[i].contentEditable = "false";
            } else if (book.children[i].classList.contains('author')) {
                book.children[i].contentEditable = "false";
            } else if (book.children[i].classList.contains('delete')) {
                disableDeleteBtn(book.children[i])
            } else if (book.children[i].classList.contains('read')) {
                disableToggleRead(book.children[i])
            }
        }
    })
}

function editMode() {
    books = libraryWrapper.querySelectorAll(":scope > .book");
    enableEditing();
    toggleEditBtns();
    disabledAddBtn();
}

function viewMode() {
    disableEditing();
    toggleEditBtns();
    enableAddBtn();
}

function enableToggleRead(currentBookRead) {
    currentBookRead.addEventListener('click', () => {
        toggleRead(currentBookRead);
    })
}

function disableToggleRead(currentBookRead) {
    currentBookRead.removeEventListener('click', toggleRead)
}

function toggleRead(currentBookRead) {
    currentBookRead.classList.toggle('read');
    currentBookRead.classList.toggle('not-read');
    let currentBook = currentBookRead.parentElement

    if (currentBook.dataset.read == "read") {
        currentBook.dataset.read = "not-read"
        currentBookRead.textContent = "not-read"
    } else if (currentBook.dataset.read == "not-read") {
        currentBook.dataset.read = "read"
        currentBookRead.textContent = "read"
    }
}

// Event Listeners
editBtn.addEventListener('click', editMode)
addBtn.addEventListener('click', promptAddBook)
stopEditBtn.addEventListener('click', viewMode)