import { Injectable } from '@angular/core';
import * as Parse from "parse";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async addRole() {
    try {
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(true);
      const Role = new Parse.Role('admin', acl);
      return await Role.save()
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async login(username: string = 'admin', password: string = 'Admin@123') {
    try {
      return await Parse.User.logIn(username, password);
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async logout() {
    return await Parse.User.logOut();
  }

  async addUser() {
    try {
      let acl = new Parse.ACL();
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      acl.setRoleReadAccess("admin", true);
      acl.setRoleWriteAccess("admin", true);

      const User = Parse.Object.extend("User");
      const user = new User();
      await user.setACL(acl);
      let userObj = await user.save({ username: "admin", password: "Admin@123", email: "admin@gmail.com", phone: 1111 })

      const Role = new Parse.Query(Parse.Role);
      Role.equalTo("name", "admin");
      let role: any = await Role.first()
      const relation = role.relation("users");
      await relation.add(userObj);
      await role.save()
      return userObj
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async addRandomUser() {
    try {
      let acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(true);

      const User = Parse.Object.extend("User");
      const user = new User();
      await user.setACL(acl);
      let userObj = await user.save({ username: String(Date.now()), password: "Admin@123", email: Date.now() + "@gmail.com", phone: 1234 })
      return userObj
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async deleteRandomUser() {
    try {
      const User = new Parse.Query(Parse.User);
      User.equalTo("phone", 1234);
      let user: any = await User.first()
      if (user) {
        return await user.destroy()
      }
      throw { message: "User not found" };
    }
    catch (err: any) {
      throw err.message;
    }
  }
}
