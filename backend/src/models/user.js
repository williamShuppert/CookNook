import sequelize from '../config/sequelize.js'
import { DataTypes } from 'sequelize'

const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        collate: 'utf8_general_ci'
    },
    displayname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    }
}, {})//.sync({alter:true})

export default User