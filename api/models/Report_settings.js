/**
 * Report_settings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    report_id: {
      type: "integer",
      primaryKey: true
    },
    company_id: {
      type: "integer",
      required: true
    },
    logo_url: {
      type: "string"
    },
    base_color: {
      type: "string"
    },
    page_header_layout: {
      type: "string"
    },
    page_header_color: {
      type: "string"
    },
    table_header_bg_color: {
      type: "string"
    },
    table_header_color: {
      type: "string"
    },
    front_page_layout: {
      type: "string"
    },
    cover_page_text: {
      type: "string"
    },
    show_photos: {
      type: "string"
    },
    show_photos_limit: {
      type: "integer"
    },
    photo_size:{
      type: "string"
    },
    show_photo_date_time:{
      type: "integer"
    },
    



  }


}
