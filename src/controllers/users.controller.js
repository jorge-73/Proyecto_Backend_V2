import { UserService } from "../services/users.service.js";
import { devLogger } from "../utils/logger.js";

export const updatedUserRoleController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await UserService.findById(uid);

    if (!user) {
      return res.sendRequestError("User not found");
    }

    if (user.role === "admin") return res.sendUserError("Admins cannot change user roles.");

    user.role = user.role === "user" ? "premium" : "user";

    const updatedUser = await UserService.update(uid, user);

    res.sendSuccess(updatedUser);
  } catch (error) {
    devLogger.error(error.message);
    res.sendServerError(error.message);
  }
};
