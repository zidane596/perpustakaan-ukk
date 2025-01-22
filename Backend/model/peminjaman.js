const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('peminjaman', {
    PeminjamanID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'UserID'
      }
    },
    BukuID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'buku',
        key: 'BukuID'
      }
    },
    TanggalPeminjaman: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TanggalPengembalian: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    StatusPeminjaman: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'peminjaman',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PeminjamanID" },
        ]
      },
      {
        name: "BukuID",
        using: "BTREE",
        fields: [
          { name: "BukuID" },
        ]
      },
      {
        name: "UserID",
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
    ]
  });
};
