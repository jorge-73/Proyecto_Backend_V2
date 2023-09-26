export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  findOne = async (user) => await this.dao.findOne(user);
  findById = async (id) => await this.dao.findById(id);
  create = async (user) => await this.dao.create(user);
  update = async (id, data) => await this.dao.update(id, data);
}
