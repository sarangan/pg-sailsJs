/**
 * Company Master items link.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    com_subitem_id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true
    },
    com_master_id: {
      type: "integer",
      required: true
    },
    company_id: {
      type: "integer",
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
    }

  }
};
