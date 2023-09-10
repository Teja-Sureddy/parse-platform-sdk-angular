import { Injectable } from '@angular/core';
import * as Parse from "parse";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor() { }

  async get(className: string) {
    try {
      const Class_ = Parse.Object.extend(className);
      const query = new Parse.Query(Class_);
      return await query.find();
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async post(className: string) {
    try {
      const Class_ = Parse.Object.extend(className);
      const myObject = new Class_();

      let data: any = {
        "column1": Math.floor((Math.random() * 10000) + 1),
        "column2": String(Math.floor((Math.random() * 10000) + 1)),
        "number_col": Math.floor(Math.random() * 5 + 1)
      }
      return await myObject.save(data)
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async put(className: string) {
    try {
      const Class_ = Parse.Object.extend(className);
      const query = new Parse.Query(Class_);
      let obj: any = await query.first();
      let obj_copy = JSON.parse(JSON.stringify(obj.toJSON()))

      let data: any = {
        "column1": Math.floor((Math.random() * 10000) + 1),
        "column2": String(Math.floor((Math.random() * 10000) + 1)),
      }
      let res = await obj.save(data)
      return { "OLD": obj_copy, "CURRENT": res.toJSON() }
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async delete(className: string) {
    try {
      const Class_ = Parse.Object.extend(className);
      const query = new Parse.Query(Class_);
      let obj: any = await query.first();
      if (obj) {
        return await obj.destroy()
      }
      throw { message: className + " not found" };
    }
    catch (err: any) {
      throw err.message;
    }
  }
}
