/**
 * Property general condition link.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    prop_general_id: {
      type: "string",
      primaryKey: true
    },
    property_id: {
      type: "string",
      required: true
    },
    com_general_id: {
        type: "integer",
        required: true
    },
    item_name: {
      type: "string"
    },
    options: {
      type: "string"
    },
    type:{
      type: "string"
    },
    priority:{
      type: "integer",
    },
    status: {
      type: "integer"
    },
    user_input: {
      type: "string"
    },
    comment: {
      type: "string"
    },
    mb_createdAt: {
      type: "string"
    }

  }
};
