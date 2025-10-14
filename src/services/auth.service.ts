import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {AppDataSource} from "../config/data-source"
import {User} from "../entities/User.entity"

const ACCESS_SECRET = "access_secret"
const REFRESh_SECRET =  "refresh_secret"

export class AuthService{
    private userRepo = AppDataSource.getRepository(User);

    async validateUser(email: string, password: string){
        const user = await this.userRepo.findOne({where: {email}});
        if(!user) return null;

        const match = await bcrypt.compare(password, user.password);
        return match ? user : null;
    }

    generateTokens(userId: string){
        const accessToken = jwt.sign({sub: userId}, ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign({sub: userId}, REFRESh_SECRET, {expiresIn: '7d'});
        return {accessToken, refreshToken};
    }

    async saveRefreshToken(user: User, token: string){
        user.refreshToken = token;
        await this.userRepo.save(user);
    }

    async verifyRefreshToken(token: string){
        try{
            const payload = jwt.verify(token, REFRESh_SECRET) as any;
            const user = await this.userRepo.findOne({where: {id: payload.sub}});
            if(!user || user.refreshToken !== token) return null;
            return user;
        }catch{
            return null;
        }
    }
}
