/**
 * Property Master items link.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    prop_master_id: {
      type: "string",
      primaryKey: true
    },
    property_id: {
        type: "string",
        required: true
    },
    com_master_id: {
      type: "integer"
    },
    type: {
      type: "string"
    },
    com_type: {
      type: "string"
    },
    option: {
      type: "string"
    },
    self_prop_master_id: {
      type: "string"
    },
    name: {
      type: "string"
    },
    priority: {
      type: "integer"
    },
    total_num: {
      type: "integer"
    },
    status: {
      type: "boolean"
    },
    mb_createdAt: {
      type: "string"
    }


  }
};
