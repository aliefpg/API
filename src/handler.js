/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');

// menambahkan buku baru ke dalam data buku
const savebook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // readpage lebih besar dari pagecount //
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // readpage setara dengan pagecount //
  if (readPage === pageCount) {
    finished = true;
  }

  // buat buku baru //
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

// menampilkan daftar buku berdasarkan query parameters //
const AllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  // Filter books based on query parameters //
  let filteredBooks = [...books];

  if (name) {
    const searchName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(searchName));
  }

  if (reading === '0' || reading === '1') {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished === '0' || finished === '1') {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  if (filteredBooks.length === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }

  const simpelBooks = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

  const response = h.response({
    status: 'success',
    data: {
      books: simpelBooks,
    },
  });
  response.code(200);
  return response;
};

// menampilkan detail buku berdasarkan ID
const detail = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

// mengubah data buku berdasarkan ID
const edit = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // Cari buku berdasarkan ID
  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // readPage yang lebih besar pageCount //
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Id yang dilampirkan oleh client tidak ditemukkan //
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Bila buku berhasil diperbarui //
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

// Fungsi untuk menghapus buku berdasarkan ID //
const deletebook = (request, h) => {
  const { bookId } = request.params;

  // cari buku berdasarkan ID
  const index = books.findIndex((book) => book.id === bookId);

  // Bila id yang dilampirkan tidak dimiliki oleh buku manapun //
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Bila id dimiliki oleh salah satu buku
  books.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  savebook,
  AllBooks,
  detail,
  edit,
  deletebook,
};
