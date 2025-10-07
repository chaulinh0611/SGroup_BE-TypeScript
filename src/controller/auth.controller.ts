import {Request, Response} from "express"
import { AuthService } from "../services/auth.service"

const authService = new AuthService();

export class AuthController{
    async login(req: Request, res: Response){
        const {email, password} = req.body;

        const user = await authService.validateUser(email, password);
        if(!user) return res.status(401).json({message: "Email hoặc mật khẩu không đúng."})

        const tokens = authService.generateTokens(user.id);
        await authService.saveRefreshToken(user, tokens.refreshToken);
        return res.json(tokens);
    }

    async refreshToken(req: Request, res: Response){
        const {refreshToken} = req.body;
        if(!refreshToken) return res.status(401).json({message: "Lỗi token."});
        const user = await authService.verifyRefreshToken(refreshToken);
        if(!user) return res.status(401).json({message: "Token không hợp lệ"})

        const tokens = authService.generateTokens(user.id);
        await authService.saveRefreshToken(user, tokens.refreshToken);

        return res.json(tokens);
    }
}