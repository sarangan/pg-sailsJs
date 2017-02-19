/**
 * Property.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    property_id: {
      type: "string",
      primaryKey: true
    },
    company_id: {
        type: "integer",
        required: true
    },
    description: {
      type: "string"
    },
    status: {
      type: "integer",
      defaultsTo: 1
    },
    mb_createdAt: {
      type: "string"
    }
  }
};
