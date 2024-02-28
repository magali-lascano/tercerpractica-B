import {userModel} from '../dao/models/userModel.js';

export class UserService {
    constructor() {
        this.dao = new UsersManager();
    }
    updateRole(idUser) {
        return this.dao.updateRole(idUser);
    }
    getUser(email) {
        return this.dao.getUser(email);
    }
    update(email, object) {
        return this.dao.update(email, object);
    }
}   