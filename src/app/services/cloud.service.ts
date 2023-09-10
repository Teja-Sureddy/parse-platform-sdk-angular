import { Injectable } from '@angular/core';
import * as Parse from "parse";

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  constructor() { }

  async getTime() {
    try {
      return await Parse.Cloud.run("getTime");
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async getParams() {
    try {
      return await Parse.Cloud.run("getParams", {text: "This is text!", field: true});
    }
    catch (err: any) {
      throw err.message;
    }
  }

  async getConfig() {
    try {
      return await Parse.Cloud.run("getConfig");
    }
    catch (err: any) {
      throw err.message;
    }
  }
}
