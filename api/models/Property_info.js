/**
 * Property_info.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    property_id: {
      type: "string",
      primaryKey: true
    },
    address_1: {
        type: "string",
        required: true
    },
    address_2: {
        type: "string"
    },
    city: {
      type: "string"
    },
    postalcode: {
      type: "string",
      required: true
    },
    report_type: {
      type: "string"
    },
    report_date: {
      type: "string"
    },
    image_url: {
      type: "string"
    },
    sign_url: {
      type: "string"
    },
    locked: {
      type: "integer"
    },
    mb_createdAt: {
      type: "string"
    }

  }
};
