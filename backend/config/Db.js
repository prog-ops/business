import {Sequelize} from "sequelize";

export const db = new Sequelize(
    'produkdb',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)
