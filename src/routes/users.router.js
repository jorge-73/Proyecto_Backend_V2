import { addFilesController, updatedUserRoleController } from "../controllers/users.controller.js";
import { uploaders } from "../middlewares/multer.js";
import appRouter from "./router.js";

export default class UsersRouter extends appRouter {
  init() {
    this.post("/premium/:uid", ["USER", "PREMIUM"], updatedUserRoleController);
    this.post("/:uid/documents", ["USER", "PREMIUM", "ADMIN"], uploaders, addFilesController);
  }
}
