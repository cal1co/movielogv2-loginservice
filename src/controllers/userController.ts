import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import { User, UserInfoResponse } from '../utils/userTypes'

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
      if (!user) return res.status(401).json({ message: 'Invalid username or email' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      const token = generateToken(user);    
      res.json({ token });
    } catch (error) {
      console.error(error);
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
  }
}

const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: '1h' }
  );
}

export default userController;