const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('buku', {
    BukuID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Penulis: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Penerbit: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TahunTerbit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Stok: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'buku',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BukuID" },
        ]
      },
    ]
  });
};
