import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/User';
import { User } from '../utils/userTypes'

const userController = {
  async register (req: Request, res: Response) {
      try {
          const { username, email, password } = req.body;
    
          const existingUser = await userModel.getUserByUsernameOrEmail(username);
    
          if (existingUser) {
            res.status(409).json({ error: 'User with that username or email already exists' });
            return;
          }
    
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const user = await userModel.createUser({ username, email, password: hashedPassword });
    
          res.status(201).json({ user });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
  },
  async login (req: Request, res: Response) {
    const { usernameOrEmail, password } = req.body;

    try {
      // Check if user exists in database
      const user:User | undefined = await userModel.getUserByUsernameOrEmail(usernameOrEmail);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or email' });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Generate JWT token and send it in response
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}

export default userController;