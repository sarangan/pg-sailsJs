/**
 * property_sub_feedback_general.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {
   autoPK: false,
   attributes: {

     prop_sub_feedback_general_id: {
       type: "string",
       primaryKey: true
     },
     property_id:{
       type: "string",
       required: true
     },
     	item_id: {
         type: "string",
         required: true
     },
     parent_id:{
        type: "string"
     },
     comment: {
       type: "string"
     },
     mb_createdAt: {
      type: "string"
    }
   }
 };
