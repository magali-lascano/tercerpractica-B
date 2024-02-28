import  cartModel from "../models/cartModel.js"

class cartManager {

    getCarts = async () => {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            req.logger.warn();('Error al obtener el carrito:', error.message);
            return [];
        }
    };

    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId);
            return cart;
        } catch (error) {
            req.logger.warn('Error al obtener el carrito por ID:', error.message);
            return error;
        }
    };

    addCart = async (products) => {
        try {
            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }

            const cart = await cartModel.create(cartData);
            return cart;
        } catch (error) {
            req.logger.warn('Error al crear el carrito:', error.message);
            return error;
        }
    };

    addProductInCart = async (cid, obj) => {
        try {
            const filter = { _id: cid, "products._id": obj._id };
            const cart = await cartModel.findById(cid);
            const findProduct = cart.products.some((product) => product._id.toString() === obj._id);

            if (findProduct) {
                const update = { $inc: { "products.$.quantity": obj.quantity } };
                await cartModel.updateOne(filter, update);
            } else {
                const update = { $push: { products: { _id: obj._id, quantity: obj.quantity } } };
                await cartModel.updateOne({ _id: cid }, update);
            }

            return await cartModel.findById(cid);
        } catch (error) {
            req.logger.warn('Error al agregar el producto al carrito:', error.message);
            return error;
        }
    };

    deleteProductInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })
        } catch (error) {
            return error
        }

    };

    updateOneProduct = async (cid, products) => {
        await cartModel.updateOne(
            { _id: cid },
            { products })
        return await cartModel.findOne({ _id: cid })
    };
};


export default cartManager;