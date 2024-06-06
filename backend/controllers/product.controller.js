const db = require("../models");
const Product = db.product;
const Category = db.category;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
    }

    const product = {
        name: req.body.name,
        categoryId: req.body.categoryId
    };

    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Product."
            });
        });
};

exports.findAll = (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const limitValue = parseInt(limit);

    Product.findAndCountAll({
        limit: limitValue,
        offset: offset,
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['name', 'id']
            }
        ]
    })
        .then(result => {
            res.send({
                totalItems: result.count,
                products: result.rows,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findByPk(id, {
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['name', 'id']
            }
        ]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Product with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving Product with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Product.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Product with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Product.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Could not delete Product with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Products were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all products."
            });
        });
};
