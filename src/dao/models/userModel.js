export class UsersManager {
    userModel
    constructor() {
        this.userModel = userModel;
    }
    async updateRole(idUser) {
        const userToUpdate = await this.userModel.findOne({_id : idUser})
        if (userToUpdate.role === "user") {
            const updatedUser = await this.userModel.updateOne({_id : idUser}, {role : "premium"})
            return updatedUser
        }
        const updatedUser = await this.userModel.updateOne({_id : idUser}, {role : "user"})
        return updatedUser
    }
    async getUser(email) {
        try {
            const user = await this.userModel.findOne({email : email});
            return user;
        } catch (error) {
            res.status(404).send({status : "Error", error: "Usuario no encontrado"})
        }
    }
    async update(email, object) {
        const user = await this.userModel.findOneAndUpdate({email : email}, object);
        return user;
    }
}