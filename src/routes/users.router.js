import { updatedUserRoleController } from "../controllers/users.controller.js";
import appRouter from "./router.js";

export default class UsersRouter extends appRouter {
  init() {
    this.post("/premium/:uid", ["USER", "PREMIUM"], updatedUserRoleController);
  }
}
