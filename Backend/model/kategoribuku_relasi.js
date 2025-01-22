const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kategoribuku_relasi', {
    KategoriBukuID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BukuID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'buku',
        key: 'BukuID'
      }
    },
    KategoriID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kategoribuku',
        key: 'KategoriID'
      }
    }
  }, {
    sequelize,
    tableName: 'kategoribuku_relasi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "KategoriBukuID" },
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
        name: "KategoriID",
        using: "BTREE",
        fields: [
          { name: "KategoriID" },
        ]
      },
    ]
  });
};
