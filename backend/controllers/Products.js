import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const createProducts = async (req, res) => {
    try {
        const { name, penulis, terbit, masuk } = req.body
        const myFile = req.file;
        const product = await Products.create({ name, penulis, terbit, masuk, userId: req.userId, file: myFile.filename });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProducts = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Products.findAll({
                attributes: ['uuid', 'name', 'penulis', 'masuk', 'terbit', 'file'],
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Products.findAll({
                attributes: ['uuid', 'name', 'penulis', 'masuk', 'terbit', 'file'],
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

export const getProductsById = async (req, res) => {
    try {

        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;
        if (req.role === "admin") {
            response = await Products.findOne({
                attributes: ['uuid', 'name', 'penulis', 'masuk', 'terbit', 'file'],
                where: {
                    id: product.id
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Products.findOne({
                attributes: ['uuid', 'name', 'penulis', 'masuk', 'terbit', 'file'],
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}


export const updateProducts = async (req, res) => {
    try {
        const { name, penulis, terbit, masuk } = req.body
        const myFile = req.file;
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        await Products.update({ name, penulis, terbit, masuk, userId: req.userId, file: myFile.filename }, { where: { id: product.id } });
        res.status(200).json({ msg: "Product Updated" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    // try {

    //     const product = await Products.findOne({
    //         where: {
    //             uuid: req.params.id
    //         }
    //     });
    //     if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
    //     const { name, penulis, terbit, masuk } = req.body
    //     if (req.role === "admin") {
    //         await Products.update({ name, penulis, terbit, masuk }, {
    //             where: {
    //                 id: product.id
    //             }
    //         })
    //     } else {
    //         if (req.userId !== product.userId) return res.status(403).json({ msg: "Akses terlarang" })
    //         await Products.update({ name, penulis, terbit, masuk }, {
    //             where: {
    //                 [Op.and]: [{ id: product.id }, { userId: req.userId }]
    //             }
    //         })
    //     }
    //     res.status(200).json({ msg: "Product Updated" });
    // } catch (error) {
    //     res.status(500).json({ msg: error.message });
    // }

}

export const deleteProducts = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });
        const { name, penulis } = req.body
        if (req.role === "admin") {
            await Products.destroy({
                where: {
                    id: product.id
                }
            })
        } else {
            if (req.userId !== product.userId) return res.status(403).json({ msg: "Akses terlarang" })
            await Products.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            })
        }
        res.status(200).json({ msg: "Product Deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}