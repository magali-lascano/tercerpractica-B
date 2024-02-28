import * as url from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import config from './config.js'

import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const mailerService = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GOOGLE_APP_EMAIL,
        pass: config.GOOGLE_APP_PASS
    }
});

export const sendConfirmation = (type, msg) => {
    return async (req, res, next) => {
        try {
            let content = {};

            switch (msg) {
                case 'register':
                    content.subject = 'LSKN SHOP confirmación registro';
                    content.html = `<h1>LSKN SHOP confirmación registro</h1><p>Muchas gracias por registrarte ${req.user.first_name} ${req.user.last_name}!, te hemos dado de alta en nuestro sistema con el email ${req.user.email}`;
                    break;
                
                default:
            }

            switch (type) {
                case 'email':
                    // Enviamos utilizando NodeMailer
                    await mailerService.sendMail({
                        from: config.GOOGLE_APP_EMAIL,
                        to: req.user.email,
                        subject: content.subject,
                        html: content.html
                    });
                    // Enviamos utilizando Resend
                    const resendService = new Resend(config.RESEND_API_KEY);
                    await resendService.emails.send({
                        from: config.RESEND_API_EMAIL,
                        to: req.user.email,
                        subject: content.subject,
                        html: content.html
                    });

                    default:
            }
            next();
        } catch (err) {
            res.status(500).send({ status: 'ERR', data: err.message })
        }
    }
}


export const __filename = url.fileURLToPath(import.meta.url)

export const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (payload, duration) => jwt.sign(payload, config.SECRET_KEY, { expiresIn: duration })

export const authToken = (req, res, next) => {
    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1]: undefined;
    const cookieToken = req.cookies && req.cookies['codertoken'] ? req.cookies['codertoken']: undefined;
    const queryToken = req.query.access_token ? req.query.access_token: undefined;  
    const receivedToken = headerToken || cookieToken || queryToken
    
    if (!receivedToken) return res.redirect('/login')

    jwt.verify(receivedToken, config.SECRET_KEY, (err, credentials) => {
        if (err) return res.status(403).send({ status: 'ERR', data: 'No autorizado' })
        req.user = credentials
        next()
    })
}

export const passportCall = (strategy, options) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, options, (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).send({ status: 'ERR', data: info.messages ? info.messages: info.toString() });
            req.user = user;
            next();
        })(req, res, next);
    }
}

export const catcher = (fn) => {
    return (req, res, next) => {
        fn(req, res).catch(err => next(err));
    };
}
