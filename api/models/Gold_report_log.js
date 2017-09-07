/**
 * gold_report_log.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    g_report_id: {
      type: "integer",
      primaryKey: true
    },
    company_id: {
      type: "integer"
    },
    property_id: {
      type: "string"
    },
    month: {
      type: "integer"
    },
    year: {
      type: "integer"
    },
    // created_date: {
    //   type: "datetime"
    // }

  }
};
