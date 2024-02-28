import { Router } from "express";

const router = Router();

router.get('/', (req, res)=>{
    req.logger.error("Test nivel error");
    req.logger.log("error", "Test nivel error");
    req.logger.warn("Test nivel warn");
    req.logger.info("Test nivel info");
    req.logger.http("Test nivel http");
    req.logger.verbose("Test nivel verbose");
    req.logger.debug("Test nivel debug");
    req.logger.silly("Test nivel silly");
    return res.status(200).json({
        message: "Logger Test!"
    });
});

export default router;