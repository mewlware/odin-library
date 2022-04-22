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

    const bookInfoDOM = document.createElement("section");
    bookInfoDOM.classList.add('bookinfo');

    const titleDOM = document.createElement("h3");
    titleDOM.classList.add('title');
    titleDOM.textContent = title;
    titleDOM.setAttribute("tabindex", "0");

    const authorDOM = document.createElement("p");
    authorDOM.classList.add('author');
    authorDOM.textContent = author;
    authorDOM.setAttribute("tabindex", "0");

    const buttonsDOM = document.createElement("div");
    buttonsDOM.classList.add('btn-wrapper', 'hidden');

    const readBtn = document.createElement("button");
    readBtn.classList.add('readData', 'btn-inner');
    /*readBtn.textContent = read;*/
    readBtn.addEventListener('click', toggleRead)

    const readBlankIcon = document.createElement("img");
    const readCheckIcon = document.createElement("img");
    readBlankIcon.src = "assets/checkbox-blank-outline.svg";
    readCheckIcon.src = "assets/checkbox-marked-outline.svg";
    readBlankIcon.classList.add("not-read")
    readCheckIcon.classList.add("read")
    readBlankIcon.setAttribute('style', 'width: 32px; height: 32px')
    readCheckIcon.setAttribute('style', 'width: 32px; height: 32px')
    if (read == "read") {
        readBlankIcon.classList.add('hidden')
    } else if (read == "not-read") {
        readCheckIcon.classList.add('hidden')
    }
    readBtn.appendChild(readBlankIcon)
    readBtn.appendChild(readCheckIcon)

    const deleteBtn = document.createElement("button");
    /*deleteBtn.textContent = "Delete"*/
    deleteBtn.classList.add('delete', 'btn-inner');
    deleteBtn.disabled = true;
    deleteBtn.addEventListener('click', deleteBtnWrapper);

    const deleteIcon = document.createElement('img');
    deleteIcon.src = "assets/trash-can-outline.svg";
    deleteIcon.setAttribute('style', 'width: 32px; height: 32px')
    deleteBtn.appendChild(deleteIcon);

    const saveBtn = document.createElement("button");
    /*saveBtn.textContent = "Save"*/
    saveBtn.classList.add('save', 'btn-inner');
    saveBtn.disabled = true;
    saveBtn.addEventListener('click', saveAndViewMode);
    
    const saveIcon = document.createElement('img');
    saveIcon.src = "assets/content-save-outline.svg";
    saveIcon.setAttribute('style', 'width: 32px; height: 32px')
    saveBtn.appendChild(saveIcon);

    buttonsDOM.appendChild(deleteBtn);
    buttonsDOM.appendChild(saveBtn);
    buttonsDOM.appendChild(readBtn);

    bookInfoDOM.appendChild(titleDOM);
    bookInfoDOM.appendChild(authorDOM);

    newBookDOM.appendChild(bookInfoDOM);
    newBookDOM.appendChild(buttonsDOM);

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
    let book = button.parentElement.parentElement
    let index = book.dataset.index;
    deleteBookDOM(index);
    deleteBookObject(index);
}

function enableBtns(btnsWrapper) {
    console.log("enabling buttons")
    console.log(btnsWrapper.children)
    btnsWrapper.classList.remove('hidden');
    for (let i = 0; i < btnsWrapper.children.length; i++) {
        btnsWrapper.children[i].disabled = false;
    }
}

function enableTextEdit(bookInfo) {
    for (let i = 0; i < bookInfo.children.length; i++) {
        bookInfo.children[i].contentEditable = "true"
    }
} 

function disableBtns(btnsWrapper) {
    btnsWrapper.classList.add('hidden');
    for (let i = 0; i < btnsWrapper.children.length; i++) {
        btnsWrapper.children[i].disabled = true;
    }
}

function disableTextEdit(bookInfo) {
    for (let i = 0; i < bookInfo.children.length; i++) {
        bookInfo.children[i].contentEditable = "false"
    }
} 

function disableShowAddFormBtn() {
    showAddFormBtn.disabled = true;
}

function enableShowAddFormBtn() {
    showAddFormBtn.disabled = false;
}

function enableEditing(book) {
    for (let i = 0; i < book.children.length; i++) {
        if (book.children[i].classList.contains('bookinfo')) {
            enableTextEdit(book.children[i])
        } else if (book.children[i].classList.contains('btn-wrapper')) {
            enableBtns(book.children[i])
        }
    }
}

function disableEditing(book) {
    for (let i = 0; i < book.children.length; i++) {
        if (book.children[i].classList.contains('bookinfo')) {
            disableTextEdit(book.children[i])
        } else if (book.children[i].classList.contains('btn-wrapper')) {
            disableBtns(book.children[i])
        }
    }
}

function toggleRead(e) {
    let read = e.target;
    let book = read.parentElement.parentElement;
    let blankIcon = read.querySelector('.not-read');
    let checkIcon = read.querySelector('.read');

    if (book.dataset.read == "read") {
        book.dataset.read = "not-read"
        blankIcon.classList.remove('hidden')
        checkIcon.classList.add('hidden')
    } else if (book.dataset.read == "not-read") {
        book.dataset.read = "read"
        checkIcon.classList.remove('hidden')
        blankIcon.classList.add('hidden')
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
    
    editBook(book.dataset.index, title, author, book.dataset.read)
    
    tempBook.title = null
    tempBook.author = null
    tempBook.read = null
}

function saveBookOnTemp(book) {
    tempBook.title = book.querySelector('.title').textContent
    tempBook.author = book.querySelector('.author').textContent
    tempBook.read = book.dataset.read
}

function cancelEdit(book) {
    if (!saved) {
        let titleDOM = book.querySelector('.title')
        let authorDOM = book.querySelector('.author')
        let readBlankIcon = book.querySelector('.not-read')
        let readCheckIcon = book.querySelector('.read')
    
        titleDOM.textContent = tempBook.title;
        authorDOM.textContent = tempBook.author;

        if(tempBook.read == 'read') {
            readBlankIcon.classList.add('hidden')
            readCheckIcon.classList.remove('hidden')
            book.dataset.read = 'read'
        } else if (tempBook.read == 'not-read') {
            readCheckIcon.classList.add('hidden')
            readBlankIcon.classList.remove('hidden')
            book.dataset.read = 'not-read'
        }
    
        tempBook.title = null
        tempBook.author = null
        tempBook.read = null
    }
}

function addFocusStyling(book) {
    book.classList.add('book-focus');
}

function removeFocusStyling(book) {
    book.classList.remove('book-focus');
}

function editMode(book) {
    enableEditing(book);
    saveBookOnTemp(book);
    disableShowAddFormBtn();
    hideForm();
}

function viewMode(book) {
    disableEditing(book);
    enableShowAddFormBtn();
}

function handleBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        removeFocusStyling(e.currentTarget)
        viewMode(e.currentTarget)
        cancelEdit(e.currentTarget)
        saved = false;
    }
}

function handleFocus(e) {
    addFocusStyling(e.currentTarget)
    editMode(e.currentTarget)
}

function saveAndViewMode(e) {
    let book = e.currentTarget.closest('.book')
    saveEdit(book)
    viewMode(book)
}

showAddFormBtn.addEventListener('click', toggleShowForm)

addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    submitBook()
})

// Add dummy books for example
let index1 = uniqueNewBookIndex();

addBookDOM(index1, "1984", "George Orwell", "read")
addBookObject(index1, "1984", "George Orwell", "read")

let index2 = uniqueNewBookIndex();

addBookDOM(index2, "The Bell Jar", "Slyvia Plath", "not-read")
addBookObject(index2, "The Bell Jar", "Slyvia Plath", "not-read")

let index3 = uniqueNewBookIndex();

addBookDOM(index3, "Maybe Talk?", "Lori Gottlieb", "read")
addBookObject(index3, "Maybe Talk?", "Lori Gottlieb", "read")
