import sequelize from '../config/sequelize.js'
import { DataTypes } from 'sequelize'
import User from './user.model.js'

const OAuth = sequelize.define('OAuth', {
    userId: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'compositeIndex',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    provider: {
        type: DataTypes.STRING,
        unique: 'compositeIndex',
        allowNull: false
    },
    id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'oauth'
})

User.hasMany(OAuth)
OAuth.belongsTo(User)

export default OAuth