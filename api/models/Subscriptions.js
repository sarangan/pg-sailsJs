/**
 * Subscriptions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    subs_id: {
      type: "integer",
      primaryKey: true
    },
    company_id: {
      type: "integer"
    },
    splan_id: {
        type: "integer",
    },
    // created_date: {
    //   type: "datetime"
    // }

  }
};
