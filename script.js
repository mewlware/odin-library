// Query starting DOM elements
const libraryWrapper = document.querySelector(".library-wrapper")
const showAddFormBtn = document.querySelector(".show-add")
const addBtn = document.querySelector(".add")
const editBtn = document.querySelector(".edit")
const stopEditBtn = document.querySelector(".stop-edit")

let bookForm = document.querySelector("#bookForm")

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

// DOM FUNCTIONS


function addBookDOM(index, title, author, read) {
    const newBookDOM = document.createElement("article");
    let readData = ""
    if (read == "yes") {
        readData = "read"
    } else if (read == "no") {
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

function submitBook() {
    let newBookData = new FormData(bookForm);
    let index = uniqueNewBookIndex();
    let title = "";
    let author = "";
    let read = "";

    for(let [name, value] of newBookData) {
        if (name == "get-title") {
            title = value;
        } else if (name == "get-author") {
            author = value;
        } else if (name == "get-read") {
            alert("checking if it's read")
            read = value;
        }
      }

    addBookDOM(index, title, author, read)
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

function disabledShowAddFormBtn() {
    showAddFormBtn.disabled = true;
}

function enableShowAddFormBtn() {
    showAddFormBtn.disabled = false;
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
    disableShowAddFormBtn();
}

function viewMode() {
    disableEditing();
    toggleEditBtns();
    enableShowAddFormBtn();
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

function toggleDisableForm() {
    if (bookForm.classList.contains('hidden')) {
        addBtn.disabled = true; 
    } else {
        addBtn.disabled = false;
    }
}

function toggleShowForm() {
    bookForm.classList.toggle('hidden');
    toggleDisableForm();
}

// Event Listeners
editBtn.addEventListener('click', editMode)
showAddFormBtn.addEventListener('click', toggleShowForm)
stopEditBtn.addEventListener('click', viewMode)

addBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    submitBook()
})