module.exports = app => {
    const categories = require("../controllers/category.controller.js");

    const router = require("express").Router();

    router.post("/", categories.create);
    router.get("/", categories.findAll);
    router.get("/:id", categories.findOne);
    router.put("/:id", categories.update);
    router.delete("/:id", categories.delete);
    router.delete("/", categories.deleteAll);

    app.use('/api/categories', router);
};
