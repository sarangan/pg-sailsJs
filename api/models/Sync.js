/**
 * sync.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    syn_id: {
      type: "string",
      primaryKey: true
    },
    property_id:{
      type: "string",
      required: true
    },
    table_name: {
        type: "string",
        required: true
    },
    key_id: {
        type: "string",
        required: true
    },
    task: {
      type: "string"
    },
    pk_name: {
      type: "string"
    },
    status: {
      type: "integer"
    },
    created_date: {
      type: "string"
    }
  }
};
