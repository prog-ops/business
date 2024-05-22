import {Sequelize} from "sequelize";
import {db} from "../config/Db.js";

const {DataTypes} = Sequelize

const Produk = db.define('produk', {
  name: DataTypes.STRING,
  buy_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sell_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  photo: DataTypes.STRING,
  photo_url: DataTypes.STRING,
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  locale: DataTypes.STRING,
  offset: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sort_by: DataTypes.STRING,
  open_now: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  attributes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true
})

export default Produk;
