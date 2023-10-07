const {
  savebook,
  AllBooks,
  detail,
  edit,
  deletebook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: savebook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: AllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: detail,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: edit,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deletebook,
  },
];

module.exports = routes;
