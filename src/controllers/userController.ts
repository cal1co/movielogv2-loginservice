import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import { User, UserInfoResponse, UserData } from '../utils/userTypes'
import { populateImages } from '../controllers/userPageController'


const userController = {
  async register (req: Request, res: Response) {
    const { username, email, password } = req.body;
      try {
          const existingUser = await userModel.getUserByUsernameOrEmail(username);
          if (existingUser) return res.status(409).json({ error: 'User with that username or email already exists' });
        
          const hashedPassword = await bcrypt.hash(password, 10);
        
          const user:User | undefined = await userModel.createUser({ username, email, password: hashedPassword });
          if (!user) return res.status(401).json({ message: 'Error Creating User' });

          const token = generateToken(user)
          res.status(201).json({ user, token });

        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
  },
  async login (req: Request, res: Response) {
    const { usernameOrEmail, password } = req.body;

    try {
      const user:User | undefined = await userModel.getUserByUsernameOrEmail(usernameOrEmail);
      if (!user) return res.status(401).json({ message: "Couldn't verify login with given credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Couldn't verify login with given credentials" });

      const token = generateToken(user);    
      res.json({ token });
    } catch (error) {
      console.log("ERROR", error)
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  async getUser (req: Request, res: Response) {
    const username = req.params.username;

    try {
      const user: UserInfoResponse | undefined = await userModel.getUserByUsername(username)

      if (!user) {
        return res.status(401).json({ message: `User with username ${username} not found` });
      }

      res.json(user)
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  async updateBio (req: Request, res: Response) {
    const { bioContent } = req.body;
    const uid = req.user.id;
    
    try {
      const success = await userModel.updateBio(uid, bioContent)
      if (!success) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(success)
    } catch (error){
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  },
  async updateUsername (req: Request, res: Response) {
    const { username } = req.body;
    const uid = req.user.id;

    try {
      const success = await userModel.updateUsername(uid, username)
      if (!success) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(success)
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Internal server error'})
    }
  },
  async updateDisplayName (req: Request, res: Response) {
    const { displayName } = req.body;
    const uid = req.user.id;

    try {
      const success = await userModel.updateDisplayName(uid, displayName)
      if (!success) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(success)
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Internal server error'})
    }
  },
  async updatePassword (req: Request, res: Response) {
    const { password, newPass } = req.body;
    const uid = req.user.id;

    const existingPasswordHashPromise = userModel.fetchPassword(uid);
    if (!existingPasswordHashPromise) {
      return res.status(500).json({ message: 'Couldnt fetch password information' });
    }
    existingPasswordHashPromise.then((existingPasswordHash: string) => {
      bcrypt.compare(password, existingPasswordHash, async (err, isMatch) => {
        if (isMatch) {
          try {
            const hashedPassword = await bcrypt.hash(newPass, 10);
            const success = await userModel.updatePassword(uid, hashedPassword)
            if (!success) {
              return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(success)
          } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Internal server error'})
          }
        } else {
          res.status(500).json({message: "provided existing password does not match"})
        }
      });
    });
  },
  async getUserData (req: Request, res:Response) {
    const uid = req.user.id 
    try { 
      const user: UserData | undefined = await userModel.getUserByIdVerbose(uid)
      if (!user) {
        return res.status(401).json({ message: `User with id ${uid} not found` });
      }
      if (!user.profile_image) {
        user.profile_image = "profile_default.jpg"
      } 

      user.profile_image = await populateImages(user.profile_image)
      res.json(user)
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}


const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET_KEY!
  );
}

export default userController;