/**
 * payments_log.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    payment_id: {
      type: "integer",
      primaryKey: true
    },
    package_name: {
      type: "string"
    },
    package_id: {
      type: "string",
    },
    payment_status: {
      type: "string"
    },
    amount: {
      type: "float"
    },
    currency: {
      type: "string"
    },
    txn_id: {
      type: "string"
    },
    receiver_email: {
      type: "string"
    },
    payer_email: {
      type: "string"
    },
    user_id: {
      type: "integer"
    },
    // created_date: {
    //   type: "datetime"
    // }

  }
};
