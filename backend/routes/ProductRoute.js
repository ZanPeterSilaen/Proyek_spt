import express from "express";
import {
    getProducts,
    getProductsById,
    createProducts,
    updateProducts,
    deleteProducts,
} from "../controllers/Products.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import multer from "multer";

const router = express.Router();

const DIR = "../frontend/public/uploads";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname.replace(/\s/g, '-');
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
});
router.get('/products', verifyUser, getProducts);
router.get('/products/:id', verifyUser, getProductsById);
router.post('/products', verifyUser, upload.single("file"), createProducts);
router.patch('/products/:id', upload.single("file"), verifyUser, adminOnly, updateProducts);
router.delete('/products/:id', verifyUser, adminOnly, deleteProducts);

export default router;
