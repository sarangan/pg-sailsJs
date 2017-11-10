/**
 * Report_log.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    report_gen_id: {
      type: "integer",
      primaryKey: true
    },
    property_id: {
      type: "string",
      required: true
    },

  }
};
