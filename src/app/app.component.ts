import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CloudService } from './services/cloud.service';
import { DbService } from './services/db.service';
import * as Parse from "parse";
import { UserService } from './services/user.service';
import { LiveService } from './services/live.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'parse-sdk';
  className: string = 'Random'

  constructor(private cloud: CloudService, private user: UserService, private db: DbService, private live: LiveService) { }

  ngOnInit(): void {
    const env = environment.parseConfig;
    Parse.initialize(env.appId);
    (Parse as any).serverURL = env.serverURL;
    this.startLive()
  }

  // CLOUD
  async getTime() {
    this.cloud.getTime().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async getParams() {
    this.cloud.getParams().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async getConfig() {
    this.cloud.getConfig().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  // AUTH
  addRole() {
    this.user.addRole().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async addUser() {
    this.user.addUser().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async login() {
    this.user.login().then((res) => {
      console.log(res);
      console.log(res.toJSON());
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async logout() {
    localStorage.clear();
    this.user.logout().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async addRandomUser() {
    this.user.addRandomUser().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async deleteRandomUser() {
    this.user.deleteRandomUser().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  // CRUD
  async get() {
    this.db.get(this.className).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async post() {
    this.db.post(this.className).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async put() {
    this.db.put(this.className).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async delete() {
    this.db.delete(this.className).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  // LIVE
  async startLive() {
    let query = new Parse.Query('Live');
    query.lessThan("number_col", 10)
    let subscription = await query.subscribe();

    subscription.on('open', () => {
      console.log('live started');
    });

    subscription.on('close', () => {
      console.log('live ended');
    });

    subscription.on('create', (object) => {
      console.log('LIVE: CREATED', object);
    });

    subscription.on('update', (object) => {
      console.log('LIVE: UPDATED', object);
    });

    subscription.on('delete', (object) => {
      console.log('LIVE: DELETE', object);
    });

    subscription.on('enter', (object) => {
      console.log('LIVE: ENTER', object);
    });

    subscription.on('leave', (object) => {
      console.log('LIVE: LEAVE', object);
    });

    // subscription.unsubscribe();
  }

  async addLive() {
    this.live.addLive().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async getCompoundQuery() {
    this.live.getCompoundQuery().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async getMatchKeyQuery() {
    this.live.getMatchKeyQuery().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async getMatchQuery() {
    this.live.getMatchQuery().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }

  async getLiveWithRelation() {
    this.live.getLiveWithRelation().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log("ERR: " + err);
    })
  }
}
