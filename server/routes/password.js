import express from 'express';

import { passwordController } from 
'../controllers/passwordControllers.js';

const passwordRouter = express.Router();

passwordRouter.post(`/forgot-password`,
    passwordController.forgotPassword
);

passwordRouter.get(`/reset-password`, 
    passwordController.verifyToken
);

passwordRouter.post(`/reset-password`, 
    passwordController.resetPassword
);

export default passwordRouter