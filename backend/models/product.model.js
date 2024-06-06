module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        name: {
            type: Sequelize.STRING
        },
        categoryId: {
            type: Sequelize.INTEGER
        }
    });
    return Product;
};
