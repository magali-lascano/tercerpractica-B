import express from 'express'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cors from 'cors'

import { __dirname} from './utils.js';
import config from './config.js';
import "./dao/dbconf.js";
import viewRouter from "./routes/view.routes.js";
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/cart.routes.js';
import loginRouter from './routes/login.routes.js';
import cookieRouter from './routes/cookies.routes.js';
import usersRouter from './routes/users.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import routerLogger from "./routes/logger.routes.js";
import ProductManager from "./dao/controllers/product.controller.js";
import MessagesManager from "./dao/controllers/message.controller.js";
import UserMongo from './dao/controllers/user.controller.js';
import errorsDictionary from "./services/error.dictionary.js";
import MongoSingleton from './services/mongo.singleton.js';
import addLogger from './services/logger.js';

try {
    const app = express();
    await MongoSingleton.getInstance();
    
    const httpServer = app.listen(config.PORT, () => {
        console.log(`Backend activo modo ${config.MODE} puerto ${config.PORT}`);
    })
    
    app.use(cors({origin: 'http://127.0.0.1:5500',
        methods: 'GET,POST,PUT,PATCH,DELETE'}));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser('secretKeyAbc123'));

    const fileStorage = FileStore(session)
    app.use(session({
        store: MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl: 60, clearInterval: 5000 }), // MONGODB
        secret: 'secretKeyAbc123',
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize())
    app.use(passport.session())

    // handlebars
    app.engine('handlebars', handlebars.engine());
    app.set("views", __dirname + "/views");
    app.set("view engine", "handlebars");
    
    app.use(addLogger);
    app.use('/', viewRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/users/premium/:uid', usersRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/cookies', cookieRouter);
    app.use('/api/login', loginRouter);
    app.use('/api/sessions/current', sessionsRouter);
    app.use("/loggerTest", routerLogger);


    const pmanagersocket = new ProductManager();
    const messagesManager = new MessagesManager();
    const userMongo = new UserMongo (); 

    app.use('/static', express.static(`${config.__DIRNAME}/public`));

    app.use((err, req, res, next) => {
        const code = err.code || 500;
        const message = err.message || 'Hubo un problema, error desconocido';
        
        return res.status(code).send({
            status: 'ERR',
            data: message,
            //más info del error en modo development:
            stack: config.MODE === 'devel' ? err.stack : {}
        });
    });

        
    app.all('*', (req, res, next)=>{
            res.status(404).send({ status: 'ERR', data: errorsDictionary.PAGE_NOT_FOUND.message });
    });
    } catch(err) {
        console.log(`Backend: error al inicializar (${err.message})`)
}