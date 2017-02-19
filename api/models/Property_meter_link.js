/**
 * Property meter link.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    prop_meter_id: {
      type: "string",
      primaryKey: true
    },
    property_id: {
      type: "string",
      required: true
    },
    com_meter_id: {
        type: "integer",
        required: true
    },
    meter_name: {
        type: "string",
    },
    reading_value: {
      type: "string"
    },
    status: {
      type: "integer"
    },
    mb_createdAt: {
      type: "string"
    }


  }
};
