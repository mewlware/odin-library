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
function addBook(index, title, author, read) {
    let newBook = new Book(title, author, read)
    library[index] = newBook;
}

// Deleting book to library
function deleteBook(index) {
    delete library[index]
}
