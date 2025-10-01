import jwt from "jsonwebtoken";
import User from "./userModel.js";

export class UserService {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const user = new User(userData);
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
