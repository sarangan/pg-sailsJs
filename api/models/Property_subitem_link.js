/**
 * Property sub item link.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    prop_subitem_id: {
      type: "string",
      primaryKey: true
    },
    property_id: {
      type: "string",
      required: true
    },
    com_subitem_id: {
      type: "integer",
      required: true
    },
    prop_master_id:{
      type: "string",
      required: true
    },
    item_name: {
      type: "string"
    },
    type: {
      type: "string"
    },
    priority: {
      type: "integer"
    },
    status: {
      type: "integer"
    },
    mb_createdAt: {
      type: "string"
    }

  }
};
