import { UserService } from "./userService.js";

const userService = new UserService();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
};

export const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyToken = async (req, res) => {
  res.status(200).json({
    message: "Token válido",
    user: req.user,
  });
};
