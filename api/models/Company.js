/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {
    company_id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true
    },
    company_name:{
        type: "string",
        required: true
    },
    address: {
      type: "string"
    },
    telephone: {
      type: "string"
    },
    status: {
      type: "integer",
      defaultsTo: 1
    }

  }
};
