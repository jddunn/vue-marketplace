'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.User, { foreignKey: 'userId' });
            Product.hasMany(models.Offer, { foreignKey: 'productId' });
        }
    }

    Product.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('Available', 'Reserved', 'Sold'),
                allowNull: false,
                defaultValue: 'Available',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Product',
        },
    );
    return Product;
};
