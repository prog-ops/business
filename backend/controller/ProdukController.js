import Produk from "../model/Produk.js";
import path from "path";
import fs from "fs";
import {allowedType} from "../constant/constants.js";
import {Op} from "sequelize";

export const searchProduk = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search_query || ""
    const buyPriceSearch = req.query.buy_price ? parseFloat(req.query.buy_price) : null;
    const location = req.query.location || "";
    const categories = req.query.categories || "";
    const openNow = req.query.open_now === 'true';
    const offset = limit * page;

    // Building dynamic where clause
    const whereClause = {
        [Op.or]: [
            {
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }
        ]
    };

    if (buyPriceSearch !== null) {
        whereClause[Op.or].push({
            buy_price: {
                [Op.like]: '%' + buyPriceSearch + '%'
            }
        });
    }

    if (location) {
        whereClause.location = {
            [Op.like]: '%' + location + '%'
        };
    }

    if (categories) {
        whereClause.categories = {
            [Op.like]: '%' + categories + '%'
        };
    }

    if (openNow) {
        whereClause.open_now = openNow;
    }

    try {
        const totalRows = await Produk.count({ where: whereClause });
        const totalPage = limit > 0 ? Math.ceil(totalRows / limit) : 0; // Prevent division by zero
        const result = await Produk.findAll({
            where: whereClause,
            offset,
            limit,
            order: [['id', 'DESC']]
        });

        res.json({
            result,
            page,
            limit,
            totalRows,
            totalPage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getProdukList = async (req, res) => {
    try {
        const respon = await Produk.findAll()
        res.json(respon)
    } catch (e) {
        console.log(e.message)
    }
}

export const getProdukById = async (req, res) => {
    try {
        const respon = await Produk.findOne({
            where: {
                id: req.params.id
            }
        })
        res.json(respon)
    } catch (e) {
        console.log(e.message)
    }
}

export const addProduk = (req, res) => {
    if (req.files === null)
        return res.status(400).json({msg: "Tidak dapat mengupload gambar."})

    const name = req.body.name
    const buyPrice = req.body.buy_price
    const sellPrice = req.body.sell_price
    const stock = req.body.stock
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const locale = req.body.locale
    const offset = req.body.offset
    const sortBy = req.body.sort_by
    const openNow = req.body.open_now
    const attributes = req.body.attributes

    // Image
    const file = req.files.file
    const fileSize = file.data.length
    const extension = path.extname(file.name)
    const fileName = /*'Image__' +*/ file.md5 + extension
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

    // Check the type
    if (!allowedType.includes(extension.toLowerCase()))
        return res.status(422).json({msg: "Tipe gambar tidak valid, hanya boleh JPG/JPEG dan PNG."})
    // Check the size
    if (fileSize > 1000_000) // 1 MB
        return res.status(422).json({msg: "Ukuran gambar tidak boleh lebih dari 1 MB."})

    // Save image to public/images directory
    file.mv(`./public/images/${fileName}`, async (error) => {
        if (error)
            return res.status(500).json({msg: error.message})

        // check if product with the same name already exists
        const existingProduct = await Produk.findOne({
            where: {
                name
            }
        });
        if (existingProduct) {
            throw new Error('Product with the same name already exists');

        } else {
            try {
                await Produk.create({
                    name,
                    buy_price: buyPrice,
                    sell_price: sellPrice,
                    stock,
                    photo: fileName,
                    photo_url: url,
                    latitude,
                    longitude,
                    locale,
                    offset,
                    sort_by: sortBy,
                    open_now: openNow,
                    attributes
                })
                res.status(201).json({msg: "Produk berhasil ditambahkan."})
            } catch (e) {
                console.log(e.message)
            }
        }
    })
}

export const editProduk = async (req, res) => {
    const produk = await Produk.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!produk)
        return res.status(404).json({msg: "No data found."})

    // Whether user wanna update the image or not
    let photo
    if (req.files === null) {
        photo = Produk.photo
    } else {
        const file = req.files.file
        const size = file.data.length
        const extension = path.extname(file.name)
        photo = /*'Gambar_' +*/ file.md5 + extension

        if (!allowedType.includes(extension.toLowerCase()))
            return res.status(422).json({msg: "Tipe gambar tidak valid, hanya boleh JPG/JPEG dan PNG."})
        if (size > 100_000)
            return res.status(422).json({msg: "Ukuran gambar tidak boleh lebih dari 100KB."})

        // Hapus photo lama
        const filePath = `./public/images/${produk.photo}`
        fs.unlinkSync(filePath)

        file.mv(`./public/images/${photo}`, error => {
            if (error)
                return res.status(500).json({msg: error.message})

        })
    }
    const name = req.body.name
    const buyPrice = req.body.buy_price
    const sellPrice = req.body.sell_price
    const stock = req.body.stock
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const locale = req.body.locale
    const offset = req.body.offset
    const sortBy = req.body.sort_by
    const openNow = req.body.open_now
    const attributes = req.body.attributes
    const url = `${req.protocol}://${req.get("host")}/images/${photo}`
    try {
        await Produk.update({
            name,
            buy_price: buyPrice,
            sell_price: sellPrice,
            stock,
            photo,
            photo_url: url,
            latitude,
            longitude,
            locale,
            offset,
            sort_by: sortBy,
            open_now: openNow,
            attributes
        }, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({msg: "Produk diperbarui."})
    } catch (e) {
        console.log(e.message)
    }
}

export const removeProduk = async (req, res) => {
    try {
        const produk = await Produk.findOne({
            where: {
                id: req.params.id
            }
        })

        // if product isn't found
        if (!produk)
            return res.status(404).json({msg: "No data found."})

        // if found then delete the image file
        try {
            // delete locally
            const filePath = `./public/images/${produk.photo}`
            fs.unlinkSync(filePath)

            // then delete on db also
            await Produk.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json({msg: "Produk dihapus."})
        } catch (e) {
            console.log(e.message)
        }
    } catch (e) {
        console.log(e.message)
    }
}
