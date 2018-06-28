/**
 * coupons.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    coupon_id: {
      type: "integer",
      primaryKey: true
    },
    coupon_text: {
      type: "string"
    },
    coupon_amount: {
      type: "string",
    },
    package_id: {
      type: "integer"
    },
    status: {
      type: "integer"
    }
  }
};
