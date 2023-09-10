import { Injectable } from '@angular/core';
import * as Parse from "parse";

@Injectable({
    providedIn: 'root'
})
export class LiveService {
    date = Date.now()
    dummy_data = [
        {
            "string_col": "String_1",
            "number_col": 1,
            "boolean_col": true,
            "date_col": new Date(),
            "geoPoint_col": new Parse.GeoPoint({ latitude: 10.0, longitude: -10.0 }),
            "polygon_col": new Parse.Polygon([[0, 0], [0, 1], [1, 1], [1, 0]]),
            "array_col": [1, 2, 3, 4],
            "object_col": { "key1": "value1" }
        }, {
            "string_col": "String_2",
            "number_col": 2,
            "boolean_col": false,
            "date_col": new Date(),
            "geoPoint_col": new Parse.GeoPoint({ latitude: 20.0, longitude: -20.0 }),
            "polygon_col": new Parse.Polygon([[1, 0], [0, 0], [0, 1], [1, 1]]),
            "array_col": [5, 6, 7],
            "object_col": { "key2": "value2" }
        }, {
            "string_col": "String_3",
            "number_col": 3,
            "boolean_col": true,
            "date_col": new Date(),
            "geoPoint_col": new Parse.GeoPoint({ latitude: 30.0, longitude: -30.0 }),
            "polygon_col": new Parse.Polygon([[1, 1], [1, 0], [0, 0], [0, 1]]),
            "array_col": [8, 9],
            "object_col": { "key3": "value3" }
        }, {
            "string_col": "String_4",
            "number_col": 4,
            "boolean_col": false,
            "date_col": new Date(),
            "geoPoint_col": new Parse.GeoPoint({ latitude: 40.0, longitude: -40.0 }),
            "polygon_col": new Parse.Polygon([[0, 1], [1, 1], [1, 0], [0, 0]]),
            "array_col": [10, 11, 12],
            "object_col": { "key4": "value4" }
        }, {
            "string_col": "String_5",
            "number_col": 5,
            "boolean_col": true,
            "date_col": new Date(),
            "geoPoint_col": new Parse.GeoPoint({ latitude: 50.0, longitude: -60.0 }),
            "polygon_col": new Parse.Polygon([[10, 10], [10, 15], [15, 15], [15, 10], [10, 10]]),
            "array_col": [13],
            "object_col": { "key5": "value5" }
        }
    ]

    constructor() { }

    async addLive() {
        try {
            let objectsToSave: any = [];
            const Live = Parse.Object.extend('Live');

            const User = new Parse.Query(Parse.User);
            User.limit(10)
            let users: any = await User.find()

            this.dummy_data.forEach((data: any) => {
                const live = new Live();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        live.set(key, data[key]);
                    }
                }
                live.set('pointer_col', users[0])
                objectsToSave.push(live);
            });

            const liveObjects = await Parse.Object.saveAll(objectsToSave);
            await Promise.all(
                liveObjects.map(async (obj: any) => {
                    const relation = obj.relation("relation_col");
                    await Promise.all(users.map(async (user: any) => await relation.add(user)));
                    await obj.save();
                })
            );
            return liveObjects;
        }
        catch (err: any) {
            throw err.message;
        }
    }

    async getCompoundQuery() {
        try {
            const q1 = new Parse.Query("Live");
            q1.greaterThan("number_col", 5);

            const q2 = new Parse.Query("Live");
            q2.lessThan("number_col", 3);

            const q3 = new Parse.Query("Live");
            q3.endsWith("string_col", "_1");

            const q4 = new Parse.Query("Live");
            q4.endsWith("string_col", "_5");

            const finalQuery = Parse.Query.and(
                Parse.Query.or(q1, q2),
                Parse.Query.or(q3, q4)
            );
            return await finalQuery.find() // live objs with the number_col >5 or <3 have either string_col ends with _1 or _5
        }
        catch (err: any) {
            throw err.message;
        }
    }

    async getMatchKeyQuery() {
        try {
            const Random = Parse.Object.extend('Random');
            const q1 = new Parse.Query(Random);

            const Live = Parse.Object.extend('Live');
            const q2 = new Parse.Query(Live);
            q2.containedIn('string_col', ['String_1', 'String_2'])

            q1.matchesKeyInQuery('number_col', 'number_col', q2)
            return await q1.find(); // Random Data
        }
        catch (err: any) {
            throw err.message;
        }
    }

    async getMatchQuery() {
        try {
            const User = Parse.Object.extend('_User');
            const q1 = new Parse.Query(User);
            q1.equalTo('phone', 1111)

            const Live = Parse.Object.extend('Live');
            const q2 = new Parse.Query(Live);

            q2.matchesQuery('relation_col', q1);
            return await q2.find(); // live Data
        }
        catch (err: any) {
            throw err.message;
        }
    }

    async getLiveWithRelation() {
        try {
            const Live = Parse.Object.extend('Live');
            const query = new Parse.Query(Live);
            query.include('relation_col', 'pointer_col');
            const results = await query.find();
            let resultArray: any = [];

            await Promise.all(
                results.map(async (obj: any) => {
                    const usersRelation = obj.relation('relation_col');
                    const q = usersRelation.query();
                    let users: any = await q.find();

                    const completeObj = { ...obj.toJSON(), "users": users.map((user: any) => user.toJSON()) };
                    resultArray.push(completeObj);
                })
            )
            return resultArray;
        }
        catch (err: any) {
            throw err.message;
        }
    }
}
