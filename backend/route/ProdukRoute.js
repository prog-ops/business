import {
  searchProduk,
  getProdukList,
  getProdukById,
  addProduk,
  editProduk,
  removeProduk
} from "../controller/ProdukController.js";
import express from "express";

const router = express.Router()

router.get('/produk/search', searchProduk)
router.get('/produk', getProdukList)
router.get('/produk/:id', getProdukById)
router.post('/produk', addProduk)
router.patch('/produk/:id', editProduk)
router.delete('/produk/:id', removeProduk)

export default router;
