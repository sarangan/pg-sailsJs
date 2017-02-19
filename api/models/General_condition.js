/**
 * General condition.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    general_id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true
    },
    item_name: {
        type: "string",
        required: true
    },
    options: {
      type: "string"
    },
    priority: {
      type: "integer"
    },
    type: {
      type: "string"
    }

  }
};
