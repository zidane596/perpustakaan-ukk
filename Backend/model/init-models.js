var DataTypes = require("sequelize").DataTypes;
var _buku = require("./buku");
var _kategoribuku = require("./kategoribuku");
var _kategoribuku_relasi = require("./kategoribuku_relasi");
var _koleksipribadi = require("./koleksipribadi");
var _peminjaman = require("./peminjaman");
var _role = require("./role");
var _ulasanbuku = require("./ulasanbuku");
var _user = require("./user");

function initModels(sequelize) {
  var buku = _buku(sequelize, DataTypes);
  var kategoribuku = _kategoribuku(sequelize, DataTypes);
  var kategoribuku_relasi = _kategoribuku_relasi(sequelize, DataTypes);
  var koleksipribadi = _koleksipribadi(sequelize, DataTypes);
  var peminjaman = _peminjaman(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var ulasanbuku = _ulasanbuku(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  kategoribuku_relasi.belongsTo(buku, { as: "Buku", foreignKey: "BukuID"});
  buku.hasMany(kategoribuku_relasi, { as: "kategoribuku_relasis", foreignKey: "BukuID"});
  koleksipribadi.belongsTo(buku, { as: "Buku", foreignKey: "BukuID"});
  buku.hasMany(koleksipribadi, { as: "koleksipribadis", foreignKey: "BukuID"});
  peminjaman.belongsTo(buku, { as: "Buku", foreignKey: "BukuID"});
  buku.hasMany(peminjaman, { as: "peminjamans", foreignKey: "BukuID"});
  ulasanbuku.belongsTo(buku, { as: "Buku", foreignKey: "BukuID"});
  buku.hasMany(ulasanbuku, { as: "ulasanbukus", foreignKey: "BukuID"});
  kategoribuku_relasi.belongsTo(kategoribuku, { as: "Kategori", foreignKey: "KategoriID"});
  kategoribuku.hasMany(kategoribuku_relasi, { as: "kategoribuku_relasis", foreignKey: "KategoriID"});
  user.belongsTo(role, { as: "Role", foreignKey: "RoleID"});
  role.hasMany(user, { as: "users", foreignKey: "RoleID"});
  koleksipribadi.belongsTo(user, { as: "User", foreignKey: "UserID"});
  user.hasMany(koleksipribadi, { as: "koleksipribadis", foreignKey: "UserID"});
  peminjaman.belongsTo(user, { as: "User", foreignKey: "UserID"});
  user.hasMany(peminjaman, { as: "peminjamans", foreignKey: "UserID"});
  ulasanbuku.belongsTo(user, { as: "User", foreignKey: "UserID"});
  user.hasMany(ulasanbuku, { as: "ulasanbukus", foreignKey: "UserID"});

  return {
    buku,
    kategoribuku,
    kategoribuku_relasi,
    koleksipribadi,
    peminjaman,
    role,
    ulasanbuku,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
