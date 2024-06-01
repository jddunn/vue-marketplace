'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Offer extends Model {
        static associate(models) {
            Offer.belongsTo(models.Product, { foreignKey: 'productId' });
            Offer.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }

    Offer.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('BuyerOffer', 'SellerCounterOffer'),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
                defaultValue: 'Pending',
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id',
                },
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
            modelName: 'Offer',
        },
    );
    return Offer;
};
