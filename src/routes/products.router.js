import { uploader } from "../utils.js";
import {
  addProductsController,
  deleteProductsController,
  getProductsByIdController,
  getProductsController,
  updateProductsController,
} from "../controllers/products.controller.js";
import appRouter from "./router.js";

export default class ProductsRouter extends appRouter {
  init() {
    this.get("/", [/* "USER", "ADMIN" */"PUBLIC"], getProductsController);

    this.get("/:pid", [/* "USER", "ADMIN" */"PUBLIC"], getProductsByIdController);

    this.post("/", [/* "ADMIN" */"PUBLIC"], uploader.single("file"), addProductsController);

    this.put("/:pid", [/* "ADMIN" */"PUBLIC"], updateProductsController);

    this.delete("/:pid", [/* "ADMIN" */"PUBLIC"], deleteProductsController);
  }
}
