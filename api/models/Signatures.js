/**
 * photos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    sign_id: {
      type: "string",
      primaryKey: true
    },
    property_id:{
      type: "string",
      required: true
    },
    comment: {
        type: "string"
    },
    tenant_url: {
        type: "string"
    },
    lanlord_url: {
      type: "string"
    },
    clerk_url: {
      type: "string"
    },
    mb_createdAt: {
      type: "string"
    }
  }
};
