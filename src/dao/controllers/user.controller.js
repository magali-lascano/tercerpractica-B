import User from "../models/userModel.js"
import { UserService } from "../../services/users.services.js"


class UserMongo {
    
    async login(email, password){
        try {
            if(email==="" || password === ""){
                throw new Error(`All fields are required`);
            }
            
            const userFound = await User.findOne({email, password});
            if(!userFound){
                throw new Error(`User ${email} Not Found!`);
            }

            return userFound;
        } catch (error) {
            throw new Error(error);
        }
    }

    async register(name, email, password){
        try {
            if(name==="" || email==="" || password === ""){
                throw new Error(`All fields are required`);
            }
            
            const existsUser = await User.findOne({email});
            if(existsUser){
                throw new Error(`User ${email} duplicate!`);
            }

            const data = {
                name, 
                email, 
                password
            }
            const user = new User(data);
            await user.save();
        } catch (error) {
            throw new Error(error);
        }   
    }
}

const userService = new UserService();

export const updateRole = async (req , res) => {
    const idUser = req.params.uid;
    try {
        res.status(200).send({status : "success", payload: await userService.updateRole(idUser)})
        req.logger.info('Usuario actualizado')
    } catch (error) {
        res.status(400).send({status : "Error", error: "No se pudo actualizar el rol"})
    }
}

export default UserMongo;