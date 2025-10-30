import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AppDataSource } from './data-source';
import { User } from '../entities/User.entity';
import { Role } from '../entities/Role.entity';
import 'dotenv/config';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!AppDataSource.isInitialized) {
          console.log('⏳ Waiting for AppDataSource initialization...');
          await AppDataSource.initialize();
        }
        const userRepo = AppDataSource.getRepository(User);
        const roleRepo = AppDataSource.getRepository(Role);

        const email = profile.emails?.[0].value;
        const name = profile.displayName;

        if (!email) {
          return done(new Error('No email found in Google profile'));
        }
        let user = await userRepo.findOne({ where: { email }, relations: ['role'] });
        if (!user) {
          let userRole = await roleRepo.findOne({ where: { name: 'USER' } });
          if (!userRole) {
            userRole = roleRepo.create({ name: 'USER', description: 'Default user' });
            await roleRepo.save(userRole);
          }
          user = userRepo.create({
            name,
            email,
            password: '',
            isActive: true,
            role: [userRole],
          });
          await userRepo.save(user);
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);
export default passport;
