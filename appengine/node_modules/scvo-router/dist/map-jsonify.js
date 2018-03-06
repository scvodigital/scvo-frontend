"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Function to loop through a Dictionary/Map of JSONable object's keys and return a map of all their JSON responses
 * @param { [key: string]: T } map - The map you'd like a simpler version of
 * @return { [key: string]: T } A version of a JavaScript object without methods or cleaned up by its toJSON method
 */
function MapJsonify(map) {
    var json = {};
    Object.keys(map).forEach(function (key) {
        var item = map[key];
        if (typeof item.toJSON === 'function') {
            json[key] = item.toJSON();
        }
        else {
            json[key] = JSON.parse(JSON.stringify(item));
        }
    });
    return json;
}
exports.MapJsonify = MapJsonify;
//# sourceMappingURL=map-jsonify.js.map