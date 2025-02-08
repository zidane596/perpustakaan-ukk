const { Sequelize } = require('sequelize');

const db = new Sequelize('perpus', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

db.authenticate()
  // .then(() => {
  //   console.log('Koneksi berhasil!');
  //   return db.sync({ alter: true });
  // })
  .then(() => {
    console.log('Koneksi berhasil!');
  })
  .catch(err => {
    console.error('Koneksi gagal:', err);
  });

module.exports = db;
