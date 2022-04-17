// Query starting DOM elements
const libraryWrapper = document.querySelector(".library-wrapper")
const showAddFormBtn = document.querySelector(".show-add")
const addBtn = document.querySelector(".add")

let bookForm = document.querySelector("#bookForm")

let books = libraryWrapper.querySelectorAll(":scope > .book");

// Initialize empty library (Object)
let library = {}
let indexArray = []
let tempLibrary = {}

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
    newBookDOM.setAttribute("tabindex", "0");

    const titleDOM = document.createElement("h3");
    titleDOM.classList.add('title');
    titleDOM.textContent = title;
    titleDOM.setAttribute("tabindex", "0");

    const authorDOM = document.createElement("p");
    authorDOM.classList.add('author');
    authorDOM.textContent = author;
    authorDOM.setAttribute("tabindex", "0");

    const readDOM = document.createElement("p");
    readDOM.classList.add('readData', readData, 'hidden');
    readDOM.textContent = readData;
    readDOM.addEventListener('click', toggleRead)

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = 'DELETE';
    deleteBtn.classList.add('delete', 'hidden', 'btn-delete');
    deleteBtn.disabled = true;

    newBookDOM.appendChild(titleDOM);
    newBookDOM.appendChild(authorDOM);
    newBookDOM.appendChild(readDOM);
    newBookDOM.appendChild(deleteBtn);

    libraryWrapper.appendChild(newBookDOM);

    newBookDOM.addEventListener('focus', editMode, true);
    newBookDOM.addEventListener('blur', deleteOrViewMode, true);

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
    console.log("delete")
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

function deleteOrViewMode(e) {
    console.log(e.Target)
    console.log(e.currentTarget)
    viewMode(e)
}


function disableShowAddFormBtn() {
    showAddFormBtn.disabled = true;
}

function enableShowAddFormBtn() {
    showAddFormBtn.disabled = false;
}

function enableEditing(book) {
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
            book.children[i].classList.remove('hidden')
        }
    }
    console.log("enable editing" + book)
}

function disableEditing(book) {
    console.log("disable editing" + book)
    for (i = 0; i < book.children.length; i++) {
        if (book.children[i].classList.contains('title')) {
            book.children[i].contentEditable = "false";
        } else if (book.children[i].classList.contains('author')) {
            book.children[i].contentEditable = "false";
        } else if (book.children[i].classList.contains('delete')) {
            disableDeleteBtn(book.children[i])
        } else if (book.children[i].classList.contains('readData')) {
            book.children[i].classList.add('hidden')
        }
    }
}

function toggleRead(e) {
    console.log("toggle read")
    console.log(e.currentTarget)
    currentBookRead = e.currentTarget
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

function hideForm() {
    bookForm.classList.add('hidden');
    toggleDisableForm();
}

function saveEditedContent(e) {
    let tempBook = new Book(title, author, read)
}

function enableSaveEditedContent(editableContent) {
    editableContent.addEventListener('input', saveEditedContent)
}

function editMode(e) {
    e.currentTarget.style.border = "1px solid red"
    enableEditing(e.currentTarget);
    disableShowAddFormBtn();
    hideForm();
}

function viewMode(e) {
    console.log(e.currentTarget)
    e.currentTarget.style.border = "none"
    disableEditing(e.currentTarget);
    enableShowAddFormBtn();
}


showAddFormBtn.addEventListener('click', toggleShowForm)

addBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    submitBook()
})