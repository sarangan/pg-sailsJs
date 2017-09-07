/**
 * Subscription plan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    splan_id: {
      type: "integer",
      primaryKey: true
    },
    title: {
      type: "string"
    },
    price: {
        type: "float",
    },
    months: {
      type: "integer"
    },
    reports: {
      type: "integer"
    },
    type: {
      type: "string"
    },
    // created_date: {
    //   type: "datetime"
    // }

  }
};
