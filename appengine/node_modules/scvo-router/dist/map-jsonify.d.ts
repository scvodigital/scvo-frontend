/**
 * Function to loop through a Dictionary/Map of JSONable object's keys and return a map of all their JSON responses
 * @param { [key: string]: T } map - The map you'd like a simpler version of
 * @return { [key: string]: T } A version of a JavaScript object without methods or cleaned up by its toJSON method
 */
export declare function MapJsonify<T>(map: {
    [key: string]: T;
}): {
    [key: string]: T;
};
