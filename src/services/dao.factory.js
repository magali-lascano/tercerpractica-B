import config from '../config.js';

let factoryCartService = {};

switch (config.PERSISTENCE) {
    case 'mongo':
        // patrón Singleton para instanciar la conexión a Mongo DB
        const { default: MongoSingleton } = await import('./mongo.singleton.js');
        await MongoSingleton.getInstance();
        
        const MongoCartService = await import('../services/carts.mongo.dao.js');
        factoryCartService = MongoCartService.default;
        break;
        
    default:
        throw new Error(`Persistencia ${config.PERSISTENCE} no soportada`);
}

export default factoryCartService;