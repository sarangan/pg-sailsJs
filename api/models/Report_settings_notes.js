/**
 * Report_settings_notes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    report_settings_notes_id: {
      type: "integer",
      primaryKey: true
    },
    company_id: {
      type: "integer",
      required: true
    },
    note_title: {
      type: "string",
      required: true
    },
    title: {
      type: "string"
    },
    note: {
      type: "string"
    },
    included: {
      type: "integer"
    }
  }
};
