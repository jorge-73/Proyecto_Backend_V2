import { userModel } from "../models/users.model.js";

export default class UserDAO {
  findOne = async (user) => await userModel.findOne(user);
  findById = async (id) => await userModel.findById(id).lean().exec();
  create = async (user) => await userModel.create(user);
  update = async (id, data) =>
    await userModel.findByIdAndUpdate(id, data, { new: true });
}
