let books = [];
let editBookId = null;

const STORAGE_KEY = "BOOKSHELF_APPS";

// Data awal (hanya dimasukkan saat pertama kali aplikasi digunakan)
const initialBooks = [
  {
    id: 123123123,
    title: "Judul Buku 1",
    author: "Penulis Buku 1",
    year: 2028,
    isComplete: false,
  },
  {
    id: 456456456,
    title: "Judul Buku 2",
    author: "Penulis Buku 2",
    year: 2030,
    isComplete: true,
  },
];

// Fungsi untuk merender buku ke dalam tampilan
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Fungsi untuk menambah atau mengedit buku
function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value); // Konversi year ke number
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editBookId !== null) {
    // Edit buku
    const bookIndex = books.findIndex((book) => book.id === editBookId);
    if (bookIndex !== -1) {
      books[bookIndex] = { ...books[bookIndex], title, author, year, isComplete };
      alert("Data Buku berhasil diperbarui");
    }
    editBookId = null;
  } else {
    // Tambah buku baru
    const newBook = {
      id: Date.now(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(newBook);
    alert("Yay! Buku berhasil ditambahkan");
  }

  document.getElementById("bookForm").reset();
  saveData();
  renderBooks();
}

// Fungsi untuk pencarian buku
function handleSearchSubmit(event) {
  event.preventDefault();

  const searchQuery = document.getElementById("searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });

  alert("Pencarian selesai");
}

// Fungsi untuk tombol di daftar buku
function handleBookListClick(event) {
  const bookElement = event.target.closest("[data-testid='bookItem']");
  const bookId = bookElement?.getAttribute("data-bookid");

  if (!bookId) return;

  if (event.target.dataset.testid === "bookItemDeleteButton") {
    // Hapus buku
    books = books.filter((book) => book.id !== parseInt(bookId));
    alert("Buku berhasil dihapus");
  } else if (event.target.dataset.testid === "bookItemIsCompleteButton") {
    // Ubah status selesai/belum selesai
    const book = books.find((book) => book.id === parseInt(bookId));
    if (book) {
      book.isComplete = !book.isComplete;
      alert("Status buku berhasil diubah");
    }
  } else if (event.target.dataset.testid === "bookItemEditButton") {
    // Edit buku
    const book = books.find((book) => book.id === parseInt(bookId));
    if (book) {
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;
      editBookId = book.id;
      alert("Silakan edit data buku di form");
    }
  }

  saveData();
  renderBooks();
}

// Fungsi untuk menyimpan data ke Local Storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

// Fungsi untuk memuat data dari Local Storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData).map((book) => ({
      ...book,
      year: parseInt(book.year), // Konversi year ke number saat data dimuat
    }));
  } else {
    books = initialBooks;
    saveData();
  }
  renderBooks();
}

// Cek apakah Local Storage didukung oleh browser
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.getElementById("bookForm").addEventListener("submit", handleFormSubmit);
document.getElementById("searchBook").addEventListener("submit", handleSearchSubmit);
document.getElementById("incompleteBookList").addEventListener("click", handleBookListClick);
document.getElementById("completeBookList").addEventListener("click", handleBookListClick);

// Muat data dari Local Storage saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
