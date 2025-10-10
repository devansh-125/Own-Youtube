import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/users/google/callback" // This must match the URI in your Google Cloud setup
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Check if a user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user exists, just return the user
        return done(null, user);
      } else {
        // 2. If user does not exist, create a new user in your database
        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000), // Create a unique username
          email: profile.emails[0].value,
          fullName: profile.displayName,
          avatar: profile.photos[0].value,
        });

        await newUser.save();
        return done(null, newUser);
      }
    } catch (error) {
      return done(error, false);
    }
  }
));

// These are needed to manage the user's session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

export default passport;