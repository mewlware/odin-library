// Query starting DOM elements
const libraryWrapper = document.querySelector(".library-wrapper")
const showAddFormBtn = document.querySelector(".show-add")
const addBtn = document.querySelector(".add")

let bookForm = document.querySelector("#bookForm")

let books = libraryWrapper.querySelectorAll(":scope > .book");

// Initialize empty library (Object)
let library = {}
let indexArray = []
let tempBook = new Book(null, null, null)

let saved = false

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

// Edit book in library
function editBook(index, title, author, read) {
    library[index]['title'] = title
    library[index]['author'] = author
    library[index]['read'] = read
}

// DOM FUNCTIONS

function addBookDOM(index, title, author, read) {
    const newBookDOM = document.createElement("article");

    newBookDOM.classList.add('book');
    newBookDOM.dataset.index = index;
    newBookDOM.dataset.read = read;
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
    readDOM.classList.add('readData', read, 'hidden');
    readDOM.textContent = read;
    readDOM.addEventListener('click', toggleRead)

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = 'DELETE';
    deleteBtn.classList.add('delete', 'hidden', 'btn-inner');
    deleteBtn.disabled = true;
    deleteBtn.addEventListener('click', deleteBtnWrapper);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = 'SAVE';
    saveBtn.classList.add('save', 'hidden', 'btn-inner')
    saveBtn.disabled = true
    saveBtn.addEventListener('click', saveAndViewMode)
    
    newBookDOM.appendChild(titleDOM);
    newBookDOM.appendChild(authorDOM);
    newBookDOM.appendChild(readDOM);
    newBookDOM.appendChild(deleteBtn);
    newBookDOM.appendChild(saveBtn);

    libraryWrapper.appendChild(newBookDOM);

    newBookDOM.addEventListener('focus', handleFocus, true);
    newBookDOM.addEventListener('blur', handleBlur, true);

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
            if (value == 'yes') {
                read = 'read'
            } else if (value == 'no') {
                read = 'not-read'
            }
        }
      }

    addBookDOM(index, title, author, read)
    addBookObject(index, title, author, read)
}


// Delete book from DOM 

function deleteBookDOM(index) {
    bookToDelete = document.querySelector(`[data-index="${index}"]`);
    bookToDelete.remove()
}

function deleteBtnWrapper(e) {
    let button = e.target
    index = button.parentElement.dataset.index;
    deleteBookDOM(index);
    deleteBookObject(index);
}

function enableBtn(button) {
    button.disabled = false;
    button.classList.remove('hidden');
}

function disableBtn(button) {
    button.disabled = true;
    button.classList.add('hidden');
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
            enableBtn(book.children[i])
        } else if (book.children[i].classList.contains('readData')) {
            book.children[i].classList.remove('hidden')
        } else if (book.children[i].classList.contains('save')) {
            book.children[i].classList.remove('hidden')
            enableBtn(book.children[i])
        }
    }
}

function disableEditing(book) {
    for (i = 0; i < book.children.length; i++) {
        if (book.children[i].classList.contains('title')) {
            book.children[i].contentEditable = "false";
        } else if (book.children[i].classList.contains('author')) {
            book.children[i].contentEditable = "false";
        } else if (book.children[i].classList.contains('delete')) {
            disableBtn(book.children[i])
        } else if (book.children[i].classList.contains('readData')) {
            book.children[i].classList.add('hidden')
        } else if (book.children[i].classList.contains('save')) {
            book.children[i].classList.add('hidden')
            disableBtn(book.children[i])
        }
    }
}

function toggleRead(e) {
    currentBookRead = e.target
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

function saveEdit(book) {
    saved = true;
    let title = book.querySelector('.title').textContent
    let author = book.querySelector('.author').textContent
    let read = book.querySelector('.readData').textContent
    
    editBook(book.dataset.index, title, author, read)
    
    tempBook.title = null
    tempBook.author = null
    tempBook.read = null
}

function saveBookOnTemp(book) {
    tempBook.title = book.querySelector('.title').textContent
    tempBook.author = book.querySelector('.author').textContent
    tempBook.read = book.querySelector('.readData').textContent
}

function cancelEdit(book) {
    if (!saved) {
        let titleDOM = book.querySelector('.title')
        let authorDOM = book.querySelector('.author')
        let readDOM = book.querySelector('.readData')
    
        titleDOM.textContent = tempBook.title;
        authorDOM.textContent = tempBook.author;
        readDOM.textContent = tempBook.read;
    
        if(readDOM == 'read') {
            readDOM.classList.add('read')
            readDOM.classList.remove('not-read')
        } else if (readDOM == 'not-read') {
            readDOM.classList.add('not-read')
            readDOM.classList.remove('read')
        }
    
        tempBook.title = null
        tempBook.author = null
        tempBook.read = null
    }
}

function editMode(book) {
    book.style.border = "1px solid red"
    enableEditing(book);
    saveBookOnTemp(book);
    disableShowAddFormBtn();
    hideForm();
}

function viewMode(book) {
    book.style.border = "none"
    disableEditing(book);
    enableShowAddFormBtn();
}

function handleBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        viewMode(e.currentTarget)
        cancelEdit(e.currentTarget)
        saved = false;
    }
}

function handleFocus(e) {
    editMode(e.currentTarget)
}

function saveAndViewMode(e) {
    saveEdit(e.target.parentElement)
    viewMode(e.target.parentElement)
}

showAddFormBtn.addEventListener('click', toggleShowForm)

addBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    submitBook()
})