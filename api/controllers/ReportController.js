/**
 * ReportController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  getreportsettings: function(req, res){

    if( req.token.hasOwnProperty('sid') ){
      if(req.token.sid){

        User.findOne({id :  req.token.sid}).then(function(user){

          //check if the user is authorize to access this property
          if(user.company_id){


              var report_settings_data = Report_settings.findOne({company_id: user.company_id})
                .then(function(report_settings_data) {
                    return report_settings_data;
              });

              var report_settings_notes_data = Report_settings_notes.find({ company_id: user.company_id })
                .then(function(report_settings_notes_data) {
                    return report_settings_notes_data;
              });

              return [report_settings_data, report_settings_notes_data];

          }
          else{
            return res.json({status: 2, text: 'you are not allow to access this info!' });
          }

        })
        .spread(function(report_settings, report_settings_notes) {

            var newJson = {};
            newJson.report_settings = report_settings;
            newJson.report_settings_notes = report_settings_notes;
            return res.json({ status: 1, data: newJson });
        })
        .fail(function(err) {
            console.log(err);
            res.json({ error: err });
        });


      }
    }


  },

  updateReportSettings: function(req, res){

    if( req.token.hasOwnProperty('sid') ){
      if(req.token.sid){

        User.findOne({id :  req.token.sid}).exec(function(err, user){
          if(err) return res.json(err);

          //check if the user is authorize to access this property
          if(user.company_id && user.type == 'ADMIN'){

            var settings = req.param('report_settings');

            Report_settings.findOne({company_id: user.company_id }).exec(function(err, report_settings){


              // save and update the general note values
              var report_settings_notes = req.param('report_settings_notes');
              if(report_settings_notes){

                for(var i = 0, l = report_settings_notes.length; i < l; i++){
                  var note = report_settings_notes[i];
                  var report_settings_notes_id = note.report_settings_notes_id;
                  if(report_settings_notes_id){
                    // we got id man
                    delete note['report_settings_notes_id'];
                    Report_settings_notes.update({report_settings_notes_id : report_settings_notes_id }, note).exec(function updated(err, updated){
                      if (err) return res.json(err);
                    });
                  }
                  else{
                    delete note['report_settings_notes_id'];
                    note['company_id'] = user.company_id;
                    Report_settings_notes.create(note).exec(function updated(err, updated){
                      if (err) return res.json(err);
                    });
                  }

                }

              }
              //end of saving general note



              var report_id ='';

              if(typeof report_settings != 'undefined'){
                if(report_settings.hasOwnProperty('report_id') ){
                  report_id = report_settings['report_id'];
                  delete settings['report_id'];
                }
              }

              if(report_id){
                  //update existing one

                  Report_settings.update({report_id: report_id }, settings).exec(function afterwards(err, updated){
                      if (err) return res.json(err);

                    //   EmailService.sendEmail({
                     // sarangan12@gmail.com',
                     // ct: 'Welcome to PropertyGround!',
     							// 		 text: "Hey " + "sara" + "\n Thanks for signing up, and welcome to PropertyGround!\nYou may customize your own proerty templates and reports." ,
     							// 		 html: '<b>Hey '+ "sara" + '</b><br/> Thanks for signing up, and welcome to PropertyGround!<br/>You may customize your own proerty templates and reports.'
                     // ction (err) {
                     //

                      return res.json(200, { status: 1, text: 'successfully updated' });
                  });

              }
              else{
                  //create new
                  delete settings['report_id'];
                  settings['company_id'] = user.company_id;

                  Report_settings.create(settings).exec(function afterwards(err, updated){
    								if (err) return res.json(err);

    								return res.json(200, { status: 1, text: 'successfully created' });
    							});

              }

            });



          }
          else{
            return res.json({status: 2, text: 'you are not allow to access this info!' });
          }

        });

      }
    }

  },

  uploadlogo: function(req, res){

    if( req.token.hasOwnProperty('sid') ){
      if(req.token.sid){

        User.findOne({id :  req.token.sid}).exec(function(err, user){
          if(err) return res.json(err);

            console.log('Uploading logo');
            var fs = require('fs');
            var im = require('imagemagick');
            var path = require('path');

            var ImagesDirArr = __dirname.split('/'); // path to this controller
            ImagesDirArr.pop();
            ImagesDirArr.pop();

            var upload_path =  ImagesDirArr.join('/')  + '/assets/images/reportlogos/';

            if(fs.existsSync( upload_path )){
              sails.log('folder exists');

              req.file('logo').upload(
                {
                   dirname: '../public/images',//'./assets/images',
                    maxBytes: 10000000
                },
                function (err, files) {

                  if (err){
                    console.log(err);
                    return res.json(err);
                  }
                  console.log(files[0].fd);
                  console.log(files[0].filename);
                  const uuidV4 = require('uuid/v4');

                  var data = {
                    //img_url: files[0].fd,
                    logo_url: path.basename(files[0].fd)
                  }

                  var _src = files[0].fd; // path of the uploaded file
                  var _dest =  upload_path + path.basename(files[0].fd); // the destination path
                  fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

                  im.resize({
                    srcPath: _src,
                    dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
                    width: 300
                  }, function(err, stdout, stderr){
                    if (err) throw err;
                    sails.log('resized fit within 300px');
                  });


                  Report_settings.findOne({company_id: user.company_id }).exec(function(err, report_settings){

                      var report_id ='';
                      if(typeof report_settings != 'undefined'){
                        if(report_settings.hasOwnProperty('report_id') ){
                          report_id = report_settings['report_id'];
                        }
                      }

                      if(report_id){
                          //update existing one
                          Report_settings.update({report_id: report_id }, data).exec(function afterwards(err, updated){
                            if (err) return res.json(err);
                            return res.json(200, { status: 1, text: 'successfully uploaded' });
                          });
                      }
                      else{
                            //create new
                            data['company_id'] = user.company_id;
                            Report_settings.create(data).exec(function afterwards(err, updated){
                							if (err) return res.json(err);
                							return res.json(200, { status: 1, text: 'successfully uploaded' });
                						});
                      }

                });


              });


            }
            else{

              var mkdirp = require('mkdirp');
              mkdirp( upload_path, function(err) {
                if(err){
                  sails.error(err);
                  return res.json(err);
                }
                else{
                  sails.log('folder created!');

                  req.file('logo').upload(
                    {
                       dirname: '../public/images',//'./assets/images',
                        maxBytes: 10000000
                    },
                    function (err, files) {

                      if (err){
                        console.log(err);
                        return res.json(err);
                      }
                      console.log(files[0].fd);
                      console.log(files[0].filename);
                      const uuidV4 = require('uuid/v4');

                      var data = {
                        //img_url: files[0].fd,
                        logo_url: path.basename(files[0].fd)
                      }

                      var _src = files[0].fd; // path of the uploaded file
                      var _dest =  upload_path + path.basename(files[0].fd); // the destination path
                      fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

                      im.resize({
                        srcPath: _src,
                        dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
                        width: 300
                      }, function(err, stdout, stderr){
                        if (err) throw err;
                        sails.log('resized fit within 300px');
                      });


                      Report_settings.findOne({company_id: user.company_id }).exec(function(err, report_settings){

                          var report_id ='';
                          if(typeof report_settings != 'undefined'){
                            if(report_settings.hasOwnProperty('report_id') ){
                              report_id = report_settings['report_id'];
                            }
                          }

                          if(report_id){
                              //update existing one
                              Report_settings.update({report_id: report_id }, data).exec(function afterwards(err, updated){
                                if (err) return res.json(err);
                                return res.json(200, { status: 1, text: 'successfully uploaded' });
                              });
                          }
                          else{
                                //create new
                                data['company_id'] = user.company_id;
                                Report_settings.create(data).exec(function afterwards(err, updated){
                    							if (err) return res.json(err);
                    							return res.json(200, { status: 1, text: 'successfully uploaded' });
                    						});
                          }

                    });


                  });



                }

              });


            }







        });

      }

    }

  },

  generatereport: function(req, res){

    if( req.token.hasOwnProperty('sid') ){
      if(req.token.sid){

        User.findOne({id :  req.token.sid}).then(function(user){

          //check if the user is authorize to access this property
          if(user.company_id){

              var property_id = req.param('property_id');
              var Promise = require('bluebird');
              var qry = '';



              //-------------------------------- REPORT DATA ----------------------------------
              var report_settings_data = Report_settings.findOne({company_id: user.company_id})
                .then(function(report_settings_data) {
                    return report_settings_data;
              });

              var report_settings_notes_data = Report_settings_notes.find({ company_id: user.company_id })
                .then(function(report_settings_notes_data) {
                    return report_settings_notes_data;
              });

              var property_info_data = Property_info.findOne({ property_id: property_id })
                .then(function(property_info_data) {
                    return property_info_data;
              });

              var company_data = Company.findOne({ company_id: user.company_id })
                .then(function(company_data) {
                    return company_data;
              });

              qry = "select property_general_condition_link.* from property_general_condition_link where property_general_condition_link.status=1 and property_general_condition_link.property_id='"+ property_id +"' order by property_general_condition_link.priority";
              var general_conditionQueryAsync = Promise.promisify(Property_general_condition_link.query);
              var general_condition_data =  general_conditionQueryAsync(qry).then(function(general_condition_data) {
                  return general_condition_data;
              });

              qry = "SELECT property_meter_link.prop_meter_id, property_meter_link.property_id, property_meter_link.com_meter_id, property_meter_link.meter_name, property_meter_link.reading_value, property_feedback.prop_feedback_id, property_feedback.comment, property_feedback.description, (select photos.file_name from photos where photos.item_id = property_meter_link.prop_meter_id and photos.property_id = '" + property_id + "' and photos.file_name != '' limit 1) as photo FROM property_meter_link LEFT JOIN property_feedback ON property_meter_link.prop_meter_id = property_feedback.item_id where property_meter_link.status = 1 and property_meter_link.property_id='"+ property_id +"'" ;
              var meterQueryAsync = Promise.promisify(Property_meter_link.query);
              var meter_data =  meterQueryAsync(qry).then(function(meter_data) {
                  return meter_data;
              });

              qry = "select property_masteritem_link.*, property_masteritem_link.com_type as template_type from property_masteritem_link where NOT(property_masteritem_link.option ='NUM' and property_masteritem_link.type ='DEFAULT') and property_masteritem_link.property_id ='"+ property_id +"' and property_masteritem_link.status = 1 order by property_masteritem_link.priority";
              var masterQueryAsync = Promise.promisify(Property_masteritem_link.query);
              var master_data =  masterQueryAsync(qry).then(function(master_data) {
                  return master_data;
              });

              qry = "select property_masteritem_link.prop_master_id, property_masteritem_link.name as master_item_name, company_subitem_link.com_master_id, property_masteritem_link.priority master_order, property_subitem_link.* from property_subitem_link inner join company_subitem_link on property_subitem_link.com_subitem_id = company_subitem_link.com_subitem_id inner JOIN property_masteritem_link on property_subitem_link.prop_master_id = property_masteritem_link.prop_master_id where property_masteritem_link.status =1 and property_subitem_link.status =1 and property_masteritem_link.property_id ='"+ property_id +"' order by property_masteritem_link.name";
              var subQueryAsync = Promise.promisify(Property_subitem_link.query);
              var sub_items_data =  subQueryAsync(qry).then(function(sub_items_data) {
                  return sub_items_data;
              });

              var photo_data = Photos.find({ property_id: property_id })
                .then(function(photo_data) {
                    return photo_data;
              });

              var feedback_data = Property_feedback.find({ property_id: property_id })
                .then(function(feedback_data) {
                    return feedback_data;
              });

              var feedback_general_data = Property_sub_feedback_general.find({ property_id: property_id })
                .then(function(feedback_general_data) {
                    return feedback_general_data;
              });

              var signature_data = Signatures.findOne({ property_id: property_id })
                .then(function(signature_data) {
                    return signature_data;
              });


              qry = "select subscriptions.*, subscription_plan.title, subscription_plan.price, subscription_plan.months, subscription_plan.reports, subscription_plan.type from subscriptions inner join subscription_plan on subscriptions.splan_id = subscription_plan.splan_id where subscriptions.company_id="+ user.company_id +" order by subscriptions.subs_id DESC limit 1";
              var subscriptionsQueryAsync = Promise.promisify(Subscriptions.query);
              var subscriptions_data =  subscriptionsQueryAsync(qry).then(function(subscriptions_data) {
                  return subscriptions_data;
              });

              qry = "select sliver_report_log.* from sliver_report_log where sliver_report_log.company_id=" + user.company_id + " order by sliver_report_log.s_report_id DESC limit 1";
              var sliver_report_logQueryAsync = Promise.promisify(Sliver_report_log.query);
              var sliver_report_log_data =  sliver_report_logQueryAsync(qry).then(function(sliver_report_log_data) {
                  return sliver_report_log_data;
              });

              var today = new Date();
              var mm = today.getMonth()+1; //January is 0!
              var yyyy = today.getFullYear();

              var gold_report_log_data = Gold_report_log.find(
                {
                  company_id: user.company_id,
                  month: mm,
                  year: yyyy
                }
              ).then(function(gold_report_log_data) {
                return gold_report_log_data;
              });

              var report_log_data = Report_log.findOne({ property_id: property_id })
                .then(function(report_log_data) {
                    return report_log_data;
              });


              return [report_log_data, gold_report_log_data, sliver_report_log_data, subscriptions_data, user, company_data, property_id, report_settings_data, report_settings_notes_data, property_info_data, general_condition_data, meter_data, master_data, sub_items_data, photo_data, feedback_data, feedback_general_data, signature_data ];

              //-------------------------------- REPORT DATA ----------------------------------


          }
          else{
            return res.json({status: 2, text: 'you are not allow to access this info!' });
          }

        })
        .spread(function(report_log_data, gold_report_log_data, sliver_report_log_data, subscriptions_data, user, company_data, property_id, report_settings, report_settings_notes, property_info, general_conditions, meter_data, master_data, sub_items_data, photo_data, feedback_data, feedback_general_data, signature_data ) {

            sails.log("i am in spread");

             var fs = require('fs');
             var wkhtmltopdf = require('wkhtmltopdf');
             //var server_image_path = 'http://52.39.72.94:3000/images/';
             var server_image_path = "http://propertyground.co.uk:1337/images/";
             var server_rpt_image_path = "http://propertyground.co.uk:1337/images/reportlogos/";

             var can_view_report = 0;

             sails.log(report_log_data);


             if(report_log_data && report_log_data.property_id && report_log_data.property_id == property_id){
               // we already generated this report before
                can_view_report = 1;
                sails.log('user no need to check can go straight to report');
             }
             else{

               //check ---------------- payment plans

               var created_date = '';
               var splan_id = 0;
               var subs = {};

               if(subscriptions_data){
                 subs =  subscriptions_data[0];
                 created_date = subs.createdAt;
                 splan_id = subs.splan_id;
               }

               if(splan_id){

                 if( splan_id == 1000 ){ // sliver for one report

                   var sliver_rep = {};
                   if(sliver_report_log_data){
                     sliver_rep = sliver_report_log_data[0];
                   }

                   if(sliver_rep && sliver_rep.s_report_id && sliver_rep.status == 0){

                     var data = {
                       status: 1
                     };
                     can_view_report = 1;

                     sails.log('sliver report ok');

                     Sliver_report_log.update({s_report_id: sliver_rep.s_report_id }, data).exec(function afterwards(err, updated){
                       if (err) sails.log(err);
                       sails.log('sliver report updated successfully');
                       // we are ok to  generate report
                       sails.log('okay to generate report');
                       //here we will start to generate report TODO
                     });

                     Report_log.create({property_id: property_id }).exec(function(err, report_log_create){
                       if(err){
                         sails.log(err);
                       }
                       sails.log('report generate log updated');

                     });



                   }
                   else{
                       //there is no peding payment
                       sails.log('sliver report no pending payment');
                      can_view_report = 0;
                       EmailService.sendEmail({
                          to: user.email,
                          subject: 'PropertyGround account payment',
                          text: "Hello" + user.first_name + "\n You do not have enough credit to generate report!\nPlease pay before generate reports.\nhttp://propertyground.co.uk/pay/" + encodeURIComponent(user.email) + "\nThank you.\nPropertyGround Team." ,
                          html: '<b>Hello '+ user.first_name + '</b><br/>You do not have enough credit to generate report!<br/>Please pay before generate reports.<br/><a href="http://propertyground.co.uk/pay/' + encodeURIComponent(user.email) + '" target="_blank">Click here to pay</a><br/>Thank you.<br/><b>PropertyGround Team</b>'
                        }, function (err) {
                       });



                   }


                 }
                 else if(splan_id == 2000){

                   var today = new Date();
                   var mm = today.getMonth()+1; //January is 0!
                   var yyyy = today.getFullYear();

                   var plan_date = new Date(created_date);
                   var get_last_sub_month = plan_date.getMonth() + 1;
                   var get_last_sub_year = plan_date.getFullYear();

                   if( get_last_sub_month == mm  && get_last_sub_year == yyyy ){


                     if(gold_report_log_data){

                       sails.log("number of reports gold generated ", gold_report_log_data.length );

                         if( (gold_report_log_data.length + 1) <= subs.reports ){

                           can_view_report = 1;
                           sails.log('gold report ok');

                           //okay to generate report TODO
                           var data_gold_report_log = {
                             company_id: user.company_id,
                             property_id: property_id,
                             month: mm,
                             year: yyyy
                           };

                           Gold_report_log.create(data_gold_report_log).exec(function(err, Gold_report_log_create){
                             if(err){
                               sails.log(err);
                             }
                             sails.log('report generate gold updated');
                           });

                           Report_log.create({property_id: property_id }).exec(function(err, report_log_create){
                             if(err){
                               sails.log(err);
                             }
                             sails.log('report generate log updated');

                           });

                         }
                         else{

                           can_view_report = 0;

                           sails.log("number of reports gold generated ");
                           EmailService.sendEmail({
                              to: user.email,
                              subject: 'PropertyGround account payment',
                              text: "Hello" + user.first_name + "\n You do not have enough credit to generate report!\nPlease pay before generate reports.\nhttp://propertyground.co.uk/pay/" + encodeURIComponent(user.email) + "\nThank you.\nPropertyGround Team." ,
                              html: '<b>Hello '+ user.first_name + '</b><br/>You do not have enough credit to generate report!<br/>Please pay before generate reports.<br/><a href="http://propertyground.co.uk/pay/' + encodeURIComponent(user.email) + '" target="_blank">Click here to pay</a><br/>Thank you.<br/><b>PropertyGround Team</b>'
                            }, function (err) {
                           });
                           return res.json({status: 2, text: 'you do not have enough credit to generate report!' });

                         }


                     }
                     else{
                       sails.log("may be can generate report gold ");
                       can_view_report = 1;

                     }

                   }
                   else{
                     can_view_report = 0;
                     sails.log('gold report no pending gold payment');
                     EmailService.sendEmail({
                        to: user.email,
                        subject: 'PropertyGround account payment',
                        text: "Hello" + user.first_name + "\n You do not have enough credit to generate report!\nPlease pay before generate reports.\nhttp://propertyground.co.uk/pay/" + encodeURIComponent(user.email) + "\nThank you.\nPropertyGround Team." ,
                        html: '<b>Hello '+ user.first_name + '</b><br/>You do not have enough credit to generate report!<br/>Please pay before generate reports.<br/><a href="http://propertyground.co.uk/pay/' + encodeURIComponent(user.email) + '" target="_blank">Click here to pay</a><br/>Thank you.<br/><b>PropertyGround Team</b>'
                      }, function (err) {
                     });
                     return res.json({status: 2, text: 'you do not have enough credit to generate report!' });

                   }




                 }
                 else if(splan_id == 3000 ){

                   var today = new Date();
                   var mm = today.getMonth()+1; //January is 0!
                   var yyyy = today.getFullYear();

                   //check if last plan is for current month
                   var plan_date = new Date(created_date);
                   var get_last_sub_month = plan_date.getMonth() + 1;
                   var get_last_sub_year = plan_date.getFullYear();

                   if( get_last_sub_month == mm  && get_last_sub_year == yyyy ){
                     // here we got same month and year so generate report
                     sails.log('gold report ok to generate');

                     can_view_report = 1;

                     Report_log.create({property_id: property_id }).exec(function(err, report_log_create){
                       if(err){
                         sails.log(err);
                       }
                       sails.log('report generate log updated');

                     });

                   }
                   else{
                     can_view_report = 0;
                     sails.log('platninum report no pending gold payment');
                     EmailService.sendEmail({
                        to: user.email,
                        subject: 'PropertyGround account payment',
                        text: "Hello" + user.first_name + "\n You do not have enough credit to generate report!\nPlease pay before generate reports.\nhttp://propertyground.co.uk/pay/" + encodeURIComponent(user.email) + "\nThank you.\nPropertyGround Team." ,
                        html: '<b>Hello '+ user.first_name + '</b><br/>You do not have enough credit to generate report!<br/>Please pay before generate reports.<br/><a href="http://propertyground.co.uk/pay/' + encodeURIComponent(user.email) + '" target="_blank">Click here to pay</a><br/>Thank you.<br/><b>PropertyGround Team</b>'
                      }, function (err) {
                     });
                     return res.json({status: 2, text: 'you do not have enough credit to generate report!' });

                   }


                 }
                 else{
                   can_view_report = 0;
                   // no plans yet man
                   EmailService.sendEmail({
                     to: user.email,
                     subject: 'PropertyGround account payment',
                     text: "Hello" + user.first_name + "\n You do not have enough credit to generate report!\nPlease pay before generate reports.\nhttp://propertyground.co.uk/pay/" + encodeURIComponent(user.email) + "\nThank you.\nPropertyGround Team." ,
                     html: '<b>Hello '+ user.first_name + '</b><br/>You do not have enough credit to generate report!<br/>Please pay before generate reports.<br/><a href="http://propertyground.co.uk/pay/' + encodeURIComponent(user.email) + '" target="_blank">Click here to pay</a><br/>Thank you.<br/><b>PropertyGround Team</b>'
                   }, function (err) {
                   });

                   return res.json({status: 2, text: 'no Subscription plan!' });

                 }




               }
               else{

                 can_view_report = 0;
                  EmailService.sendEmail({
                    to: user.email,
                    subject: 'PropertyGround account payment',
                    text: "Hello" + user.first_name + "\n You do not have enough credit to generate report!\nPlease pay before generate reports.\nhttp://propertyground.co.uk/pay/" + encodeURIComponent(user.email) + "\nThank you.\nPropertyGround Team." ,
                    html: '<b>Hello '+ user.first_name + '</b><br/>You do not have enough credit to generate report!<br/>Please pay before generate reports.<br/><a href="http://propertyground.co.uk/pay/' + encodeURIComponent(user.email) + '" target="_blank">Click here to pay</a><br/>Thank you.<br/><b>PropertyGround Team</b>'
                  }, function (err) {
                  });

                 return res.json({status: 2, text: 'Please pay before you generate reports!' });

               }


               // check payment plans






             }
              // end exisiting report check




             //start general notes----------------------------------------------------------------------------------
            var general_notes  ='';
            if(property_info.report_type){
                 var notes = '';
              	 for(var i =0, l = report_settings_notes.length; i < l ; i++){
              	   if(report_settings_notes[i].note_title == property_info.report_type  && report_settings_notes[i].included == 1 ){

              	     notes =  report_settings_notes[i].note;
              	     general_notes ='<div class="chapter">' +
              	       '<h1 class="sub-heading">General notes and guidance</h1>' +
              	       '<hr/>' +
              	       '<div style="width:90%; padding: 10px; font-weight: bold;">' + report_settings_notes[i].title +
              	       '</div><div style="width:90%; padding: 10px; margin-top: 10px;">' +
              	       report_settings_notes[i].note +
              	       '</div></div>';
              	   }
              }

            	if(!notes){
            	  general_notes  ='';
            	}
            }
//end of general_notes ----------------------------------------------------------------------------------

//start genral conditions ----------------------------------------------------------------------------------
       var general_conditiions_html = ''
       if(report_settings.include_condition_summary == 1){

         var got_any_gen_data = false;

	        general_conditiions_html = '<div class="chapter">' +
                                  	   '<h1 class="sub-heading">General Condition</h1>' +
                                  	   '<hr/>' +
                                  	   '<div>' +
                                  	     '<table class="format-table condtion-tbl">' +
                                  '<thead>' +
                                    '<th class="col1">Condition</th>' +
                                    '<th class="col2">Summary</th>' +
                                  '</thead>' +
                                  '<tbody>';

            for(var i =0, l = general_conditions.length; i < l ; i++){
              if(general_conditions[i].user_input ){
                got_any_gen_data = true;
                 general_conditiions_html += '<tr>' +
                   '<td class="col1"><span class="left-text">'+ general_conditions[i].item_name +'</span></td>' +
                   '<td class="col2"><span class="right-text">'+ general_conditions[i].user_input +'</span></td>' +
                 '</tr>';
               }
            }

          general_conditiions_html += '</tbody></table></div></div>';

          if(!got_any_gen_data){
            general_conditiions_html = '';
          }

        }
//end genral conditions----------------------------------------------------------------------------------

//start meter----------------------------------------------------------------------------------

    var meter_html = '';
    if(meter_data){
        meter_html = '<div class="chapter"><h1 class="sub-heading">Meater Reading</h1><hr/><div><table class="format-table report-tbl7"><thead><th class="col1"></th><th class="col2"></th><tbody>';

        var check_meter_data = false;

        for(var i =0, l = meter_data.length; i < l ; i++){
          if(meter_data[i].photo || meter_data[i].reading_value ){
            check_meter_data = true;
            //sails.log(server_image_path +  property_id + '/' + '300_' + (meter_data[i].photo.substr(0, meter_data[i].photo.lastIndexOf('.')) || meter_data[i].photo) + '.jpg');

            var need_maintance = meter_data[i].description ? (meter_data[i].description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
            var temp_needmaintaince_html = '';
            if(need_maintance){
              temp_needmaintaince_html ='<div style="width: 100%; display:block; margin-top: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
            }

             meter_html += '<tr><td><div class="img-inline-wrapper">' +
             '<img src="' + server_image_path +  property_id + '/' + '300_' + (meter_data[i].photo.substr(0, meter_data[i].photo.lastIndexOf('.')) || meter_data[i].photo) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
             '<a href="'+ server_image_path +  property_id + '/' + meter_data[i].photo + '">Ref'+ (i + 1) +'</a>' +
              '</div></td><td>' +
              '<b>Meter name : </b>'+  meter_data[i].meter_name +'<br>' +
              '<b>Reading : </b>'+  meter_data[i].reading_value +'<br>' +
              '<b>Description : </b>'+ meter_data[i].comment + '<br>' +
              temp_needmaintaince_html +
              '</td></tr>';
           }
        }

        meter_html += '</tbody></table></div></div>';

        if(!check_meter_data){
          meter_html = '';
        }
    }

//end meter----------------------------------------------------------------------------------

  var temp_master_items = [];
  if(master_data){

    for(var i =0, ml = master_data.length; i < ml ; i++){

      var get_master_name = master_data[i].name;
      var get_master_id = master_data[i].prop_master_id;
      var get_master_type = master_data[i].com_type; // we will know if its SUB or ITEM

      //lets go to sub items basket
      if(get_master_type == 'SUB'){ // if it has sub items

        var temp_sub_items = [];
        var temp_top_photos = [];

        for(var j =0, sl = sub_items_data.length; j < sl ; j++){ // sub item loop
          if( sub_items_data[j].prop_master_id == get_master_id ){
            // yes it is belongs to our master items

            var sub_item_id = sub_items_data[j].prop_subitem_id;

            //get the feedback data for sub items
            var temp_feedback = {};
            for(var k =0, fl = feedback_data.length; k < fl ; k++){
              if( sub_item_id == feedback_data[k].item_id && get_master_id == feedback_data[k].parent_id ){
                //we have our feedback data now
                temp_feedback = feedback_data[k];
                break;
              }
            }

            //get the photos for sub item
            var temp_photos = [];
            for(var l =0, pl = photo_data.length; l < pl ; l++){
              if( sub_item_id == photo_data[l].item_id && get_master_id == photo_data[l].parent_id ){
                //we have our photo data now
                temp_photos.push(photo_data[l]);
                //if(l < 3 ){
                  temp_top_photos.push(photo_data[l]);
                //}
              }
            }


            temp_sub_items.push(
              {
                subitem: sub_items_data[j],
                feedback: temp_feedback,
                photos: temp_photos
              }
            );

          } // match master id with sub item

        }//sub item loop

        //get the feedback general data for sub items
        var temp_feedback_general = {};
        for(var s=0, fgl = feedback_general_data.length; s < fgl ; s++){
          if( get_master_id == feedback_general_data[s].parent_id ){
            //we have our feedback general data now
            temp_feedback_general = feedback_general_data[s];
            break;
          }
        }

        temp_master_items.push(
          {
            master: master_data[i],
            sub: temp_sub_items,
            type: 'SUB',
            temp_top_photos: temp_top_photos,
            feedback_general: temp_feedback_general,
          }
        );

      } // sub items if end
      else{

        // no sub items just feed back only
        var temp_feedback = {};
        for(var ik =0, ifl = feedback_data.length; ik < ifl ; ik++){
          if( get_master_id == feedback_data[ik].item_id ){
            //we have our feedback data now
            temp_feedback = feedback_data[ik];

          }
        }

        //get the photos for sub item
        var temp_photos = [];
        for(var il =0, ipl = photo_data.length; il < ipl ; il++){
          if( get_master_id == photo_data[il].item_id ){
            //we have our photo data now
            temp_photos.push(photo_data[il]);
          }
        }

        temp_master_items.push(
          {
            master:  master_data[i],
            sub: [],
            type: 'ITEM',
            feedback: temp_feedback,
            photos: temp_photos,
            feedback_general: {}
          }
        );

      }


    } // end master loop

  } // end if master


  //sails.log(temp_master_items);


  var master_html = '';
  var merger_photos_html = '';
  var check_master_item_data_exists = false;
  for(var i =0, masterl = temp_master_items.length; i < masterl; i++){

    check_master_item_data_exists = false;

    var master_item = temp_master_items[i];

    if(report_settings.items_details_layout == 'STYLE 1'){

      if(master_item.type == 'SUB' ){

        var top_photos = '';
        if(master_item.temp_top_photos){

          for(var j =0, tl = master_item.temp_top_photos.length; j < tl ; j++){
            var photo_date = '';
            if(master_item.temp_top_photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.temp_top_photos[j].mb_createdAt ){
              photo_date = master_item.temp_top_photos[j].createdAt;
            }
            else{
              photo_date = master_item.temp_top_photos[j].mb_createdAt;
            }
            if(report_settings.show_photo_date_time != 1){
              photo_date = '';
            }
            else{
              photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
            }

            //sails.log(server_image_path +  property_id + '/' + 'report_300_' + (master_item.temp_top_photos[j].file_name.substr(0, master_item.temp_top_photos[j].file_name.lastIndexOf('.')) || master_item.temp_top_photos[j].file_name) + '.jpg')

            top_photos += '<div style="width: 25%; padding: 10px; background-color: #ffffff; display: inline-block; max-width: 300px; margin-bottom: 5px; margin-left: 10px; ">'+
              '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.temp_top_photos[j].file_name.substr(0, master_item.temp_top_photos[j].file_name.lastIndexOf('.')) || master_item.temp_top_photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
              '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
              '<div>' +
              '<a href="'+ server_image_path +  property_id + '/' + temp_master_items[i].temp_top_photos[j].file_name + '">Ref#'+ (j + 1) +'</a>' +
              '</div></div>';

              if(j >= 2){
                break;
              }
          }
        }


        var sub_items_html = '';

        sails.log(master_item.master.name);

        for(var j =0, sl = master_item.sub.length; j < sl ; j++){ // sub item loop

          var sub_item = master_item.sub[j];

          var option = '-';
          var desc = '-';
          var need_maintance = '';

          var general_item_text = '';

          if(Object.keys(sub_item.feedback).length === 0 && sub_item.feedback.constructor === Object ){
            //is empty object
            option = '-';
            desc = '-';
          }
          else{
            option =  sub_item.feedback.option? sub_item.feedback.option : '-';
            desc = sub_item.feedback.comment? sub_item.feedback.comment: '-';
            need_maintance = sub_item.feedback.description ? (sub_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
          }

           var temp_sub_items_html = '<div class="divrow">' +
             '<div style="width: 30%; display:inline-block"><span class="left-text">'+ sub_item.subitem.item_name +'</span></div>' +
             '<div style="width: 20%; display:inline-block"><span class="left-text">'+ option +'</span></div>' +
             '<div style="width: 50%; display:inline-block"><span class="left-text">'+ desc +'</span></div>' +
           '</div>';

           if(need_maintance){
                 temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px; "> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
           }


           sails.log(sub_item.subitem.item_name);
           sails.log(sub_item.feedback.option);
           sails.log(sub_item.feedback.comment);
           sails.log(need_maintance);
           sails.log(sub_item.photos.length);

           if(!sub_item.feedback.option && !sub_item.feedback.comment && !need_maintance && !sub_item.photos.length){

             sub_items_html += '';
             sails.log('not exists');
           }
           else{
             sails.log('exists');
             if(sub_item.subitem.type != 'GENERAL'){
               sub_items_html += temp_sub_items_html;
             }
             check_master_item_data_exists = true;
           }



           var photos_html = ''
           if(sub_item.photos){

               for(var l =0, pl = sub_item.photos.length; l < pl ; l++){

                 var photo_date = '';
                 if(sub_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !sub_item.photos[l].mb_createdAt ){
                   photo_date = sub_item.photos[l].createdAt;
                 }
                 else{
                   photo_date = sub_item.photos[l].mb_createdAt;
                 }
                 if(report_settings.show_photo_date_time != 1){
                   photo_date = '';
                 }
                 else{
                   photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                 }

                 if(l < 3){
                   photos_html += '<div class="img-wrapper1">' +
                      '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (sub_item.photos[l].file_name.substr(0, sub_item.photos[l].file_name.lastIndexOf('.')) || sub_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-1-img" />' +
                      '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                      '<div>' +
                      '<a href="'+ server_image_path +  property_id + '/' + sub_item.photos[l].file_name + '">Ref#'+ (j + 1) +'</a>' +
                      '</div>' +
                      '</div>';
                 }
                 else{
                   break;
                 }

               }

              if(sub_item.photos.length > 0){
                sub_items_html += '<div class="div-img-wrapper">' +
                     photos_html +
                   '</div>';
              }

          }

        } //end master item loop


        var fgeneral = '';
        // if(Object.keys(master_item.feedback_general).length === 0 && master_item.feedback_general.constructor === Object ){
        //   fgeneral = master_item.feedback_general.comment?master_item.feedback_general.comment:'';
        // }
        if(master_item.feedback_general && master_item.feedback_general.hasOwnProperty('comment')){
          fgeneral = master_item.feedback_general.comment ? master_item.feedback_general.comment : '';
        }

        if(fgeneral){
          check_master_item_data_exists = true;
        }

        sails.log(check_master_item_data_exists);


        sails.log('------');

        if(check_master_item_data_exists){

          master_html +='<div class="chapter">' +
           '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
           '<hr/><div>' +
            '<div style="margin-top: 10px; margin-bottom: 2px; width:100%;">' +
               top_photos +
             '</div>' +
            ' <div>' +
               '<span>' +
                fgeneral +
               '</span>' +
             '</div>' +
             '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                  '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                  '<div class="divtable" style="width:20%; display: inline-block;">Condition</div>' +
                  '<div class="divtable" style="width:50%; display: inline-block;">Comment</div>' +
                '<div>' +
                sub_items_html +
         '</div></div></div></div>';

        }



      }
      else if(master_item.type == 'ITEM' ){
        // item table
        var sub_items_html = '';
        var top_photos = '';
        if(master_item.photos){
          for(var j =0, tl = master_item.photos.length; j < tl ; j++){
            var photo_date = '';
            if(master_item.photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[j].mb_createdAt ){
              photo_date = master_item.photos[j].createdAt;
            }
            else{
              photo_date = master_item.photos[j].mb_createdAt;
            }

            if(report_settings.show_photo_date_time != 1){
              photo_date = '';
            }
            else{
              photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
            }

            top_photos += '<div style="width: 25%; padding: 10px; background-color: #ffffff; display: inline-block; margin: 5px; max-width: 300px;  margin-bottom: 10px; margin-left: 10px;">'+
              '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[j].file_name.substr(0, master_item.photos[j].file_name.lastIndexOf('.')) || master_item.photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
              '<div style="font-style: italic; color: #a0a0a0;">'+ photo_date +'</div>'+
              '<div>' +
              '<a href="'+ server_image_path +  property_id + '/' + temp_master_items[i].photos[j].file_name + '">Ref#'+ (j + 1) +'</a>' +
              '</div></div>';

              if(j >= 2){
                break;
              }
          }
        }

        var option = '-';
        var desc = '-';
        var need_maintance = '';

        if(Object.keys(master_item.feedback).length === 0 && master_item.feedback.constructor === Object ){
          option = '-';
          desc = '-';
        }
        else{
          option =  master_item.feedback.option? master_item.feedback.option : '-';
          desc = master_item.feedback.comment? master_item.feedback.comment: '-';
          need_maintance = master_item.feedback.description ? (master_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
        }

        var temp_sub_items_html = '<div class="divrow">' +
           '<div style="width: 30%; display:inline-block"><span class="left-text">'+ master_item.master.name +'</span></div>' +
           '<div style="width: 20%; display:inline-block"> <span class="left-text">'+ option +'</span></div>' +
           '<div style="width: 50%; display:inline-block"> <span class="left-text">'+ desc +'</span></div>' +
         '</div>';

         if(need_maintance){
           temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
         }

         if(!master_item.feedback.option && !master_item.feedback.comment && !need_maintance){

           sub_items_html += '';
         }
         else{
           sub_items_html += temp_sub_items_html;
           check_master_item_data_exists = true;
         }


         var photos_html = ''
         if(master_item.photos){
             for(var l =0, pl = master_item.photos.length; l < pl ; l++){

               var photo_date = '';
               if(master_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[l].mb_createdAt ){
                 photo_date = master_item.photos[l].createdAt;
               }
               else{
                 photo_date = master_item.photos[l].mb_createdAt;
               }
               if(report_settings.show_photo_date_time != 1){
                 photo_date = '';
               }
               else{
                 photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
               }

               if(l < 3){
                 photos_html += '<div class="img-wrapper1">' +
                    '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[l].file_name.substr(0, master_item.photos[l].file_name.lastIndexOf('.')) || master_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-1-img" />' +
                    '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                    '<div>' +
                    '<a href="'+ server_image_path +  property_id + '/' + master_item.photos[l].file_name + '">Ref#'+ (j + 1) +'</a>' +
                    '</div>' +
                    '</div>';
               }
               else{
                 break;
               }

             }

            if(master_item.photos.length > 0){
              sub_items_html += '<div class="div-img-wrapper">' +
                   photos_html +
                 '</div>';
            }

        }

        if(check_master_item_data_exists){

          master_html +='<div class="chapter">' +
           '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
           '<hr/><div>' +
            '<div style="margin-top: 10px; margin-bottom: 20px; width:100%;">' +
               top_photos +
             '</div>' +
            ' <div class="rt-2-des">' +
               '<span>' +
               '</span>' +
             '</div>' +
             '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                  '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                  '<div class="divtable" style="width:20%; display: inline-block;">Condition</div>' +
                  '<div class="divtable" style="width:50%; display: inline-block;">Comment</div>' +
                '<div>' +
                sub_items_html +
         '</div></div></div></div>';

        }




      } //item end


    }//style 1 end
    else if(report_settings.items_details_layout == 'STYLE 2'){

          if(master_item.type == 'SUB' ){

            var top_photos = '';
            if(master_item.temp_top_photos){

              for(var j =0, tl = master_item.temp_top_photos.length; j < tl ; j++){

                var photo_date = '';
                if(master_item.temp_top_photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.temp_top_photos[j].mb_createdAt ){
                  photo_date = master_item.temp_top_photos[j].createdAt;
                }
                else{
                  photo_date = master_item.temp_top_photos[j].mb_createdAt;
                }
                if(report_settings.show_photo_date_time != 1){
                  photo_date = '';
                }
                else{
                  photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                }

                top_photos += '<div style="width: 25%; padding: 10px; background-color: #ffffff; display: inline-block; max-width: 300px;  margin-bottom: 10px; margin-left: 10px;">'+
                  '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.temp_top_photos[j].file_name.substr(0, master_item.temp_top_photos[j].file_name.lastIndexOf('.')) || master_item.temp_top_photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
                  '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                  '<div>' +
                  '<a href="'+ server_image_path +  property_id + '/' + master_item.temp_top_photos[j].file_name + '">Ref#'+ (j + 1) +'</a>' +
                  '</div></div>';

                  if(j >= 2){
                    break;
                  }
              }
            }


            var sub_items_html = '';

            for(var j =0, sl = master_item.sub.length; j < sl ; j++){ // sub item loop

              var sub_item = master_item.sub[j];

              //sails.log(sub_item);

              var option = '-';
              var desc = '-';
              var need_maintance = '';

              if(Object.keys(sub_item.feedback).length === 0 && sub_item.feedback.constructor === Object ){
                //is empty object
                option = '-';
                desc = '-';
              }
              else{
                option = sub_item.feedback.option? sub_item.feedback.option : '-';
                desc = sub_item.feedback.comment? sub_item.feedback.comment: '-';
                need_maintance = sub_item.feedback.description ? (sub_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
              }


              var photos_html = '';
              if(sub_item.photos){

                  for(var l =0, pl = sub_item.photos.length; l < pl ; l++){

                    var photo_date = '';
                    if(sub_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !sub_item.photos[l].mb_createdAt ){
                      photo_date = sub_item.photos[l].createdAt;
                    }
                    else{
                      photo_date = sub_item.photos[l].mb_createdAt;
                    }
                    if(report_settings.show_photo_date_time != 1){
                      photo_date = '';
                    }
                    else{
                      photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                    }


                    if(sub_item.photos[l].file_name){
                      photos_html = '<div class="img-inline-wrapper">' +
                         '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (sub_item.photos[l].file_name.substr(0, sub_item.photos[l].file_name.lastIndexOf('.')) || sub_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                         '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div></div>'+
                         '<a href="'+ server_image_path +  property_id + '/' + sub_item.photos[l].file_name + '">Ref#'+ 1 +'</a></div>' +
                         '</div>';
                         break;
                    }

                  }


             }

               var temp_sub_items_html = '<div class="divrow">' +
                 '<div style="width: 20%; display:inline-block"><span class="left-text">'+ sub_item.subitem.item_name +'</span></div>' +
                 '<div style="width: 15%; display:inline-block"><span class="left-text">'+ option +'</span></div>' +
                 '<div style="width: 35%; display:inline-block"><span class="left-text">'+ desc +'</span></div>' +
                 '<div style="width: 30%; display:inline-block"><span class="left-text">'+ photos_html +'</span></div>' +
               '</div>';

               if(need_maintance){
                 temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
               }

               if(!sub_item.feedback.option && !sub_item.feedback.comment && !need_maintance){

                 sub_items_html += '';
               }
               else{
                 sub_items_html += temp_sub_items_html;
                 check_master_item_data_exists = true;
               }

               //sub_items_html = temp_sub_items_html;



            }

            var fgeneral = '';
            // if(Object.keys(master_item.feedback_general).length === 0 && master_item.feedback_general.constructor === Object ){
            //   fgeneral = master_item.feedback_general.comment?master_item.feedback_general.comment:'';
            // }
            if(master_item.feedback_general && master_item.feedback_general.hasOwnProperty('comment')){
              fgeneral = master_item.feedback_general.comment ? master_item.feedback_general.comment : '';
            }

            var photos_bottom_html = '';
            if(master_item.temp_top_photos){

                for(var l =0, pl = master_item.temp_top_photos.length; l < pl ; l++){

                  var photo_date = '';
                  if(master_item.temp_top_photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.temp_top_photos[l].mb_createdAt ){
                    photo_date = master_item.temp_top_photos[l].createdAt;
                  }
                  else{
                    photo_date = master_item.temp_top_photos[l].mb_createdAt;
                  }
                  if(report_settings.show_photo_date_time != 1){
                    photo_date = '';
                  }
                  else{
                    photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                  }


                  if(master_item.temp_top_photos[l].file_name){
                    photos_bottom_html += '<div style="width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px; margin-top: 20px;">' +
                       '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (master_item.temp_top_photos[l].file_name.substr(0, master_item.temp_top_photos[l].file_name.lastIndexOf('.')) || master_item.temp_top_photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                       '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                       '<div><a href="'+ server_image_path +  property_id + '/' + master_item.temp_top_photos[l].file_name + '">Ref#'+ (j + 1) +'</a></div>' +
                       '</div>';

                  }

                }


           }


           if(check_master_item_data_exists){

             master_html +='<div class="chapter">' +
              '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
              '<hr/><div style="margin:0; width:100%;">' +
               '<div style="margin-top: 5px; margin-bottom: 2px; width:100%;">' +
                  top_photos +
                '</div>' +
               ' <div>' +
                  '<span>' +
                   fgeneral +
                  '</span>' +
                '</div>' +
                '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                     '<div class="divtable" style="width:20%; display: inline-block;">&nbsp;</div>' +
                     '<div class="divtable" style="width:15%; display: inline-block;">Condition</div>' +
                     '<div class="divtable" style="width:35%; display: inline-block; text-align: center; ">Comment</div>' +
                     '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                   '<div>' +
                   sub_items_html +
            '</div></div>'+
            '<div style="margin-top: 10px; width:100%; text-align: left;" class="div-img-wrapper">' +
            photos_bottom_html +
            '</div>' +
            '</div></div>';

           }



          }
          else if(master_item.type == 'ITEM' ){
            // item table
            var sub_items_html = '';
            var top_photos = '';
            if(master_item.photos){
              for(var j =0, tl = master_item.photos.length; j < tl ; j++){
                var photo_date = '';
                if(master_item.photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[j].mb_createdAt ){
                  photo_date = master_item.photos[j].createdAt;
                }
                else{
                  photo_date = master_item.photos[j].mb_createdAt;
                }

                if(report_settings.show_photo_date_time != 1){
                  photo_date = '';
                }
                else{
                  photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                }

                top_photos += '<div style="width: 25%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px;">'+
                  '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[j].file_name.substr(0, master_item.photos[j].file_name.lastIndexOf('.')) || master_item.photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
                  '<div style="font-style: italic; color: #a0a0a0;">'+ photo_date +'</div>'+
                  '<div>' +
                  '<div><a href="'+ server_image_path +  property_id + '/' + master_item.photos[j].file_name + '">Ref'+ (j + 1) +'</a></div>' +
                  '</div></div>';

                  if(j > 2){
                    break;
                  }
              }
            }

            var option = '-';
            var desc = '-';
            var need_maintance = '';

            if(Object.keys(master_item.feedback).length === 0 && master_item.feedback.constructor === Object ){
              option = '-';
              desc = '-';
            }
            else{
              option =  master_item.feedback.option? master_item.feedback.option : '-';
              desc = master_item.feedback.comment? master_item.feedback.comment: '-';
              need_maintance = master_item.feedback.description ? (master_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
            }

            var photos_html = '';
            if(master_item.photos){
                for(var l =0, pl = master_item.photos.length; l < pl ; l++){

                  var photo_date = '';
                  if(master_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[l].mb_createdAt ){
                    photo_date = master_item.photos[l].createdAt;
                  }
                  else{
                    photo_date = master_item.photos[l].mb_createdAt;
                  }
                  if(report_settings.show_photo_date_time != 1){
                    photo_date = '';
                  }
                  else{
                    photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                  }



                  if(master_item.photos[l].file_name){
                    photos_html = '<div class="img-inline-wrapper">' +
                       '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[l].file_name.substr(0, master_item.photos[l].file_name.lastIndexOf('.')) || master_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                       '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                       '<div><a href="'+ server_image_path +  property_id + '/' + master_item.photos[l].file_name + '">Ref'+ (j + 1) +'</a></div>' +
                       '</div>';
                       break;
                  }

                }
           }

            var temp_sub_items_html = '<div class="divrow">' +
               '<div style="width: 20%; display:inline-block"><span class="left-text">'+ master_item.master.name +'</span></div>' +
               '<div style="width: 15%; display:inline-block"> <span class="left-text">'+ option +'</span></div>' +
               '<div style="width: 35%; display:inline-block"> <span class="left-text">'+ desc +'</span></div>' +
               '<div style="width: 30%; display:inline-block"> <span class="left-text">'+ photos_html +'</span></div>' +
             '</div>';

             if(need_maintance){
               temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
             }

             if(!master_item.feedback.option && !master_item.feedback.description ){
               sub_items_html += '';
             }
             else{
               sub_items_html += temp_sub_items_html;
               check_master_item_data_exists = true;
             }

             var photos_bottom_html = '';
             if(master_item.photos){
                 for(var l =0, pl = master_item.photos.length; l < pl ; l++){

                   var photo_date = '';
                   if(master_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[l].mb_createdAt ){
                     photo_date = master_item.photos[l].createdAt;
                   }
                   else{
                     photo_date = master_item.photos[l].mb_createdAt;
                   }
                   if(report_settings.show_photo_date_time != 1){
                     photo_date = '';
                   }
                   else{
                     photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                   }


                   if(master_item.photos[l].file_name){
                     photos_bottom_html += '<div style="width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px; margin-top: 20px;">' +
                        '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[l].file_name.substr(0, master_item.photos[l].file_name.lastIndexOf('.')) || master_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                        '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                        '<div><a href="'+ server_image_path +  property_id + '/' + master_item.photos[l].file_name + '">Ref#'+ (j + 1) +'</a></div>' +
                        '</div>';
                   }

                 }


            }

            if(check_master_item_data_exists){

              master_html +='<div class="chapter">' +
               '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
               '<hr/><div style="margin:0; width:100%;">' +
                '<div style="margin-top: 20px; margin-bottom: 20px; width:100%;">' +
                   top_photos +
                 '</div>' +
                ' <div class="rt-2-des">' +
                   '<span>' +
                   '</span>' +
                 '</div>' +
                 '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                      '<div class="divtable" style="width:20%; display: inline-block;">&nbsp;</div>' +
                      '<div class="divtable" style="width:15%; display: inline-block;">Condition</div>' +
                      '<div class="divtable" style="width:35%; display: inline-block; text-align: center;">Comment</div>' +
                      '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                    '<div>' +
                    sub_items_html +
             '</div></div>'+
             '<div style="margin-top: 30px; width:100%; text-align: left;" class="div-img-wrapper">' +
             photos_bottom_html +
             '</div>' +
             '</div></div>';

            }




          } //item end


    }//style 2 end
    else if(report_settings.items_details_layout == 'STYLE 3'){

          if(master_item.type == 'SUB' ){

            var top_photos = '';
            if(master_item.temp_top_photos){

              for(var j =0, tl = master_item.temp_top_photos.length; j < tl ; j++){

                var photo_date = '';
                if(master_item.temp_top_photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.temp_top_photos[j].mb_createdAt ){
                  photo_date = master_item.temp_top_photos[j].createdAt;
                }
                else{
                  photo_date = master_item.temp_top_photos[j].mb_createdAt;
                }
                if(report_settings.show_photo_date_time != 1){
                  photo_date = '';
                }
                else{
                  photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                }

                top_photos += '<div style="width: 25%; padding: 10px; background-color: #e1e1e1; display: inline-block; max-width: 300px;">'+
                  '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.temp_top_photos[j].file_name.substr(0, master_item.temp_top_photos[j].file_name.lastIndexOf('.')) || master_item.temp_top_photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
                  '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                  '<div>' +
                  '<a href="'+ server_image_path +  property_id + '/' + temp_master_items[i].temp_top_photos[j].file_name + '">Ref'+ (j + 1) +'</a>' +
                  '</div></div>';

                  if(j >= 2){
                    break;
                  }
              }
            }


            var sub_items_html = '';
            for(var j =0, sl = master_item.sub.length; j < sl ; j++){ // sub item loop

              var sub_item = master_item.sub[j];

              var option = '-';
              var desc = '-';
              var need_maintance = '';

              if(Object.keys(sub_item.feedback).length === 0 && sub_item.feedback.constructor === Object ){
                //is empty object
                option = '-';
                desc = '-';
              }
              else{
                option =  sub_item.feedback.option? sub_item.feedback.option : '-';
                desc = sub_item.feedback.comment? sub_item.feedback.comment: '-';
                need_maintance = sub_item.feedback.description ? (sub_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
              }


              var photos_html = '';
              if(sub_item.photos){

                  for(var l =0, pl = sub_item.photos.length; l < pl ; l++){

                    var photo_date = '';
                    if(sub_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !sub_item.photos[l].mb_createdAt ){
                      photo_date = sub_item.photos[l].createdAt;
                    }
                    else{
                      photo_date = sub_item.photos[l].mb_createdAt;
                    }
                    if(report_settings.show_photo_date_time != 1){
                      photo_date = '';
                    }
                    else{
                      photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                    }


                    if(sub_item.photos[l].file_name){
                      photos_html = '<div class="img-inline-wrapper">' +
                         '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (sub_item.photos[l].file_name.substr(0, sub_item.photos[l].file_name.lastIndexOf('.')) || sub_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                         '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                         '</div>';
                         break;
                    }

                  }


             }



               var temp_sub_items_html = '<div class="divrow">' +
                 '<div style="width: 20%; display:inline-block"><span class="left-text">'+ sub_item.subitem.item_name +'</span></div>' +
                 '<div style="width: 15%; display:inline-block"><span class="left-text">'+ option +'</span></div>' +
                 '<div style="width: 35%; display:inline-block"><span class="left-text">'+ desc +'</span></div>' +
                 '<div style="width: 30%; display:inline-block"><span class="left-text">'+ photos_html +'</span></div>' +
               '</div>';

               if(need_maintance){
                 temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
               }

               if(!sub_item.feedback.option && !sub_item.feedback.comment && !need_maintance){
                 sub_items_html += '';
               }
               else{
                 sub_items_html += temp_sub_items_html;
                 check_master_item_data_exists = true;
               }


            }

            var fgeneral = '';
            // if(Object.keys(master_item.feedback_general).length === 0 && master_item.feedback_general.constructor === Object ){
            //   fgeneral = master_item.feedback_general.comment?master_item.feedback_general.comment:'';
            // }

            if(master_item.feedback_general && master_item.feedback_general.hasOwnProperty('comment')){
              fgeneral = master_item.feedback_general.comment ? master_item.feedback_general.comment : '';
            }

            if(fgeneral){
              check_master_item_data_exists = true;
            }


            if(check_master_item_data_exists){
              master_html +='<div class="chapter">' +
               '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
               '<hr/><div style="margin:0; width:100%;">' +
                '<div style="margin-top: 30px; margin-bottom: 10px; width:100%;">' +
                   top_photos +
                 '</div>' +
                ' <div>' +
                   '<span>' +
                    fgeneral +
                   '</span>' +
                 '</div>' +
                 '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                      '<div class="divtable" style="width:20%; display: inline-block;">&nbsp;</div>' +
                      '<div class="divtable" style="width:15%; display: inline-block;">Condition</div>' +
                      '<div class="divtable" style="width:35%; display: inline-block; text-align: center;">Comment</div>' +
                      '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                    '<div>' +
                    sub_items_html +
             '</div></div>'+
             '</div></div>';
            }



          }
          else if(master_item.type == 'ITEM' ){
            // item table
            var sub_items_html = '';
            var top_photos = '';
            if(master_item.photos){
              for(var j =0, tl = master_item.photos.length; j < tl ; j++){
                var photo_date = '';
                if(master_item.photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[j].mb_createdAt ){
                  photo_date = master_item.photos[j].createdAt;
                }
                else{
                  photo_date = master_item.photos[j].mb_createdAt;
                }

                if(report_settings.show_photo_date_time != 1){
                  photo_date = '';
                }
                else{
                  photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                }

                top_photos += '<div style="width: 25%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px;">'+
                  '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[j].file_name.substr(0, master_item.photos[j].file_name.lastIndexOf('.')) || master_item.photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
                  '<div style="font-style: italic; color: #a0a0a0;">'+ photo_date +'</div>'+
                  '<div>' +
                  '<a href="'+ server_image_path +  property_id + '/' + master_item.photos[j].file_name + '">Ref'+ (j + 1) +'</a>' +
                  '</div></div>';

                  if(j > 2){
                    break;
                  }
              }
            }

            var option = '-';
            var desc = '-';
            var need_maintance = '';

            if(Object.keys(master_item.feedback).length === 0 && master_item.feedback.constructor === Object ){
              option = '-';
              desc = '-';
            }
            else{
              option =  master_item.feedback.option? master_item.feedback.option : '-';
              desc = master_item.feedback.comment? master_item.feedback.comment: '-';
              need_maintance = master_item.feedback.description ? (master_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
            }

            var photos_html = '';
            if(master_item.photos){
                for(var l =0, pl = master_item.photos.length; l < pl ; l++){

                  var photo_date = '';
                  if(master_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[l].mb_createdAt ){
                    photo_date = master_item.photos[l].createdAt;
                  }
                  else{
                    photo_date = master_item.photos[l].mb_createdAt;
                  }
                  if(report_settings.show_photo_date_time != 1){
                    photo_date = '';
                  }
                  else{
                    photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                  }



                  if(master_item.photos[l].file_name){
                    photos_html = '<div class="img-inline-wrapper">' +
                       '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[l].file_name.substr(0, master_item.photos[l].file_name.lastIndexOf('.')) || master_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                       '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                       '</div>';
                       break;
                  }

                }
           }

            var temp_sub_items_html = '<div class="divrow">' +
               '<div style="width: 20%; display:inline-block"><span class="left-text">'+ master_item.master.name +'</span></div>' +
               '<div style="width: 15%; display:inline-block"> <span class="left-text">'+ option +'</span></div>' +
               '<div style="width: 35%; display:inline-block"> <span class="left-text">'+ desc +'</span></div>' +
               '<div style="width: 30%; display:inline-block"> <span class="left-text">'+ photos_html +'</span></div>' +
             '</div>';

             if(need_maintance){
               temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
             }

            if(!master_item.feedback.option && !master_item.feedback.comment && !need_maintance){
              sub_items_html += '';
            }
            else{
              sub_items_html += temp_sub_items_html;
              check_master_item_data_exists = true;
            }

            if(check_master_item_data_exists){
              master_html +='<div class="chapter">' +
               '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
               '<hr/><div style="margin:0; width:100%;">' +
                '<div style="margin-top: 20px; margin-bottom: 20px; width:100%;">' +
                   top_photos +
                 '</div>' +
                ' <div class="rt-2-des">' +
                   '<span>' +
                   '</span>' +
                 '</div>' +
                 '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                      '<div class="divtable" style="width:20%; display: inline-block;">&nbsp;</div>' +
                      '<div class="divtable" style="width:15%; display: inline-block;">Condition</div>' +
                      '<div class="divtable" style="width:35%; display: inline-block; text-align:center;">Comment</div>' +
                      '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                    '<div>' +
                    sub_items_html +
             '</div></div>'+
             '</div></div>';
            }

          } //item end


    }//style 3 end
    else if(report_settings.items_details_layout == 'STYLE 4'){

        if(master_item.type == 'SUB' ){


          var sub_items_html = '';

          for(var j =0, sl = master_item.sub.length; j < sl ; j++){ // sub item loop

            var sub_item = master_item.sub[j];

            var option = '-';
            var desc = '-';
            var need_maintance = '';

            if(Object.keys(sub_item.feedback).length === 0 && sub_item.feedback.constructor === Object ){
              //is empty object
              option = '-';
              desc = '-';
            }
            else{
              option =  sub_item.feedback.option? sub_item.feedback.option : '-';
              desc = sub_item.feedback.comment? sub_item.feedback.comment: '-';
              need_maintance = sub_item.feedback.description ? (sub_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
            }

             var temp_sub_items_html = '<div class="divrow">' +
               '<div style="width: 30%; display:inline-block"><span class="left-text">'+ sub_item.subitem.item_name +'</span></div>' +
               '<div style="width: 20%; display:inline-block"> <span class="left-text">'+ option +'</span></div>' +
               '<div style="width: 50%; display:inline-block"> <span class="left-text">'+ desc +'</span></div>' +
             '</div>';

             if(need_maintance){
               temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
             }

             if(!sub_item.feedback.option && !sub_item.feedback.comment && !need_maintance){
               sub_items_html += '';
             }
             else{
               sub_items_html += temp_sub_items_html;
               check_master_item_data_exists = true;
             }


          }

          var fgeneral = '';
          // if(Object.keys(master_item.feedback_general).length !== 0 && master_item.feedback_general.constructor === Object ){
          //   fgeneral = master_item.feedback_general.comment?master_item.feedback_general.comment:'';
          // }

          if(master_item.feedback_general && master_item.feedback_general.hasOwnProperty('comment')){
            fgeneral = master_item.feedback_general.comment ? master_item.feedback_general.comment : '';
          }

          if(fgeneral){
            check_master_item_data_exists = true;
          }


          if(check_master_item_data_exists){
            master_html +='<div class="chapter">' +
             '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
             '<hr/><div style="margin-top: 30px; margin-bottom: 10px; width:100%;">' +
              ' <div>' +
                 '<span>' +
                  fgeneral +
                 '</span>' +
               '</div>' +
               '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                    '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                    '<div class="divtable" style="width:20%; display: inline-block;">Condition</div>' +
                    '<div class="divtable" style="width:50%; display: inline-block;">Comment</div>' +
                  '<div>' +
                  sub_items_html +
           '</div></div></div></div>';
          }


        }
        else if(master_item.type == 'ITEM' ){
          // item table
          var sub_items_html = '';

          var option = '-';
          var desc = '-';
          var need_maintance = '';

          if(Object.keys(master_item.feedback).length === 0 && master_item.feedback.constructor === Object ){
            option = '-';
            desc = '-';
          }
          else{
            option =  master_item.feedback.option? master_item.feedback.option : '-';
            desc = master_item.feedback.description? master_item.feedback.description: '-';
            need_maintance = master_item.feedback.description ? (master_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
          }

          var temp_sub_items_html = '<div class="divrow">' +
             '<div style="width: 30%; display:inline-block"><span class="left-text">'+ master_item.master.name +'</span></div>' +
             '<div style="width: 20%; display:inline-block"> <span class="left-text">'+ option +'</span></div>' +
             '<div style="width: 50%; display:inline-block"> <span class="left-text">'+ desc +'</span></div>' +
           '</div>';

           if(need_maintance){
             temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
           }

           if(!master_item.feedback.option && !master_item.feedback.description ){
             sub_items_html += '';
           }
           else{
             sub_items_html += temp_sub_items_html;
             check_master_item_data_exists = true;
           }

        if(check_master_item_data_exists){
          master_html +='<div class="chapter">' +
           '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
           '<hr/><div style="margin-top: 20px; margin-bottom: 20px; width:100%;">' +
            ' <div class="rt-2-des">' +
               '<span>' +
               '</span>' +
             '</div>' +
             '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                  '<div class="divtable" style="width:30%; display: inline-block;">&nbsp;</div>' +
                  '<div class="divtable" style="width:20%; display: inline-block;">Condition</div>' +
                  '<div class="divtable" style="width:50%; display: inline-block;">Comment</div>' +
                '<div>' +
                sub_items_html +
         '</div></div></div></div>';
        }



        } //item end


    }///style 4 end
    else if(report_settings.items_details_layout == 'STYLE 5'){ // start style 5

      var hex = report_settings.table_header_bg_color;
      var lum = 0.4;

      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      }
      lum = lum || 0;

      // convert to decimal and change luminosity
      var color_rgb = "#", colorc, colori;
      for (colori = 0; colori < 3; colori++) {
        colorc = parseInt(hex.substr(colori*2,2), 16);
        colorc = Math.round(Math.min(Math.max(0, colorc + (colorc * lum)), 255)).toString(16);
        color_rgb += ("00"+colorc).substr(colorc.length);
      }

      var table_header_bg_color_light = color_rgb;

      // sails.log(report_settings.table_header_bg_color);
      // sails.log(table_header_bg_color_light);


      if(master_item.type == 'SUB' ){

        var top_photos = '';

        var sub_items_html = '';
        for(var j =0, sl = master_item.sub.length; j < sl ; j++){ // sub item loop

          var sub_item = master_item.sub[j];

          var option = '-';
          var desc = '-';
          var need_maintance = '';

          if(Object.keys(sub_item.feedback).length === 0 && sub_item.feedback.constructor === Object ){
            //is empty object
            option = '-';
            desc = '-';
          }
          else{
            option =  sub_item.feedback.option? sub_item.feedback.option : '-';
            desc = sub_item.feedback.comment? sub_item.feedback.comment: '-';
            need_maintance = sub_item.feedback.description ? (sub_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
          }


          var photos_html = '';
          if(sub_item.photos){

              for(var l =0, pl = sub_item.photos.length; l < pl ; l++){

                var photo_date = '';
                if(sub_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !sub_item.photos[l].mb_createdAt ){
                  photo_date = sub_item.photos[l].createdAt;
                }
                else{
                  photo_date = sub_item.photos[l].mb_createdAt;
                }
                if(report_settings.show_photo_date_time != 1){
                  photo_date = '';
                }
                else{
                  photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
                }


                if(sub_item.photos[l].file_name){
                  photos_html += '<div style="width: 30%; background-color: #ffffff; display: inline-block; margin: 5px; max-width: 300px;">' +
                     '<div style="padding: 1px; background-color: #ffffff; border: 1px solid #000000; display: inline-block; ">' +
                     '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (sub_item.photos[l].file_name.substr(0, sub_item.photos[l].file_name.lastIndexOf('.')) || sub_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                     '</div>' +
                     '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                     '<div>' +
                     '<a href="'+ server_image_path +  property_id + '/' + sub_item.photos[l].file_name + '">Ref'+ (j + 1) +'</a>' +
                     '</div></div>';
                }

              }


         }

          //'<div style="width: 35%; display:inline-block"><span class="left-text">'+ desc +'</span></div>' +
          //'<div style="width: 30%; display:inline-block"><span class="left-text">'+ photos_html +'</span></div>' +
          var temp_sub_items_html_maintaince = '';
          if(need_maintance){
            temp_sub_items_html_maintaince ='<span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 1px; paddin-left: 2px; padding-right: 2px; font-size: 13px;">'+ need_maintance +'</span>';
          }

           var temp_sub_items_html = '<div class="divrow" style="padding:0px; padding-left: 10px; margin-bottom: 15px; border:none;color:' + report_settings.table_header_color + '; background-color:' + table_header_bg_color_light +'">' +
             '<div style="width: 40%; display:inline-block; "><span class="left-text" style="font-size: 13px; color:' + report_settings.table_header_color + ';">'+ sub_item.subitem.item_name  + ' (' +  master_item.master.name +')</span></div>' +
             '<div style="width: 20%; display:inline-block"><span class="left-text" style="font-size: 13px; text-transform: uppercase;color:' + report_settings.table_header_color + ';">'+ option +' </span> condition</div>' +
             '<div style="width: 38%; display:inline-block; text-align: right; margin-right: 2px;">' + temp_sub_items_html_maintaince + '</div>' +
           '</div>';

           temp_sub_items_html = temp_sub_items_html.replace(/'/g, ""); // remove additional trailing quotes

           temp_sub_items_html += photos_html;


           if(!sub_item.feedback.option && !sub_item.feedback.comment && !need_maintance){
             sub_items_html += '';
           }
           else{
             sub_items_html += temp_sub_items_html;
             check_master_item_data_exists = true;
           }


        }//end sub

        var fgeneral = '';
        // if(Object.keys(master_item.feedback_general).length !== 0 && master_item.feedback_general.constructor === Object ){
        //   fgeneral = master_item.feedback_general.comment ? master_item.feedback_general.comment : '';
        // }

        if(master_item.feedback_general && master_item.feedback_general.hasOwnProperty('comment')){
          fgeneral = master_item.feedback_general.comment ? master_item.feedback_general.comment : '';
        }

        if(fgeneral){
          check_master_item_data_exists = true;
        }



        if(photo_data){
          var fould_one_master_photo = false;
          for(var j =0, tl = photo_data.length; j < tl ; j++){

            var photo_date = '';
            if(photo_data[j].mb_createdAt == '0000-00-00 00:00:00' ||  !photo_data[j].mb_createdAt ){
              photo_date = photo_data[j].createdAt;
            }
            else{
              photo_date = photo_data[j].mb_createdAt;
            }
            if(report_settings.show_photo_date_time != 1){
              photo_date = '';
            }
            else{
              photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
            }

            sails.log(master_item.master.name + " - " + photo_data.type);

            if(master_item.master.prop_master_id == photo_data[j].parent_id && photo_data[j].type == 'GENERAL'){

              sails.log('we found genrephotos');
              //we got general item photo
              top_photos = '<div style="width: 200px; height: auto; padding: 10px; background-color: #ffffff; display: inline-block;">'+
                '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (photo_data[j].file_name.substr(0, photo_data[j].file_name.lastIndexOf('.')) || photo_data[j].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                '<div>' +
                '<a href="'+ server_image_path +  property_id + '/' + photo_data[j].file_name + '">Ref'+ (j + 1) +'</a>' +
                '</div></div>';
                fould_one_master_photo = true;
            }


            if(fould_one_master_photo){
              break;
            }


          }

          if(!fould_one_master_photo){

            sails.log("i came here again to search man");

            for(var j =0, tl = master_item.photos.length; j < tl ; j++){

              var photo_date = '';
              if(master_item.photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[j].mb_createdAt ){
                photo_date = master_item.photos[j].createdAt;
              }
              else{
                photo_date = master_item.photos[j].mb_createdAt;
              }
              if(report_settings.show_photo_date_time != 1){
                photo_date = '';
              }
              else{
                photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
              }

              if(j >= 1){
                break;
              }

              top_photos = '<div style="width: 200px; height: auto; padding: 10px; background-color: #ffffff; display: inline-block;">'+
                '<img src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[j].file_name.substr(0, master_item.photos[j].file_name.lastIndexOf('.')) || master_item.photos[j].file_name) + '.jpg'  + '" alt="img" class="rt-2-tbl-img" />' +
                '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                '<div>' +
                '<a href="'+ server_image_path +  property_id + '/' + master_item.photos[j].file_name + '">Ref'+ (j + 1) +'</a>' +
                '</div></div>';
            }
          }

        }



        if(check_master_item_data_exists){

          var stlye5_header = '<div style="width:100%;"><h1 class="sub-heading" style="padding:3px; padding-left: 10px; font-size: 16px;background-color:' + report_settings.table_header_bg_color + ';color:' + report_settings.table_header_color + ';">' + master_item.master.name + '</h1><div>';
          stlye5_header = stlye5_header.replace(/'/g, "");

          master_html +='<div class="chapter">' +
           stlye5_header +
               '<div style="margin:0; width:100%;">' +
                      '<div style="margin-top: 5px; margin-bottom: 5px; width:40%; display: inline-block; vertical-align: top;">' +
                          top_photos +
                       '</div>' +
                       '<div style="margin-top: 5px; margin-bottom: 5px; width:60%; display: inline-block; vertical-align: top;">' +
                           '<span>' +
                            fgeneral +
                           '</span>' +
                       '</div>' +
                '</div><div>' +
                sub_items_html +
                '</div>'+
         '</div>';
        }

        //sails.log(master_html);



      }
      else if(master_item.type == 'ITEM' ){
        // item table
        var sub_items_html = '';
        var top_photos = '';
        if(master_item.photos){
          for(var j =0, tl = master_item.photos.length; j < tl ; j++){
            var photo_date = '';
            if(master_item.photos[j].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[j].mb_createdAt ){
              photo_date = master_item.photos[j].createdAt;
            }
            else{
              photo_date = master_item.photos[j].mb_createdAt;
            }

            if(report_settings.show_photo_date_time != 1){
              photo_date = '';
            }
            else{
              photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
            }

            top_photos += '<div style="width: 25%; padding: 10px; background-color: #ffffff; border: 1px solid #000000; display: inline-block; margin: 5px; max-width: 300px;">'+
              '<img style="width: 100%; height: auto; max-width: 300px;" src="'+ server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[j].file_name.substr(0, master_item.photos[j].file_name.lastIndexOf('.')) || master_item.photos[j].file_name) + '.jpg'  + '" alt="img" />' +
              '<div style="font-style: italic; color: #a0a0a0;">'+ photo_date +'</div>'+
              '<div>' +
              '<a href="'+ server_image_path +  property_id + '/' + master_item.photos[j].file_name + '">Ref'+ (j + 1) +'</a>' +
              '</div></div>';

              if(j > 2){
                break;
              }
          }
        }

        var option = '-';
        var desc = '-';
        var need_maintance = '';

        if(Object.keys(master_item.feedback).length === 0 && master_item.feedback.constructor === Object ){
          option = '-';
          desc = '-';
        }
        else{
          option =  master_item.feedback.option? master_item.feedback.option : '-';
          desc = master_item.feedback.comment? master_item.feedback.comment: '-';
          need_maintance = master_item.feedback.description ? (master_item.feedback.description.toLowerCase() == 'true' ? 'Need maintenance' : '') : '';
        }

        var photos_html = '';
        if(master_item.photos){
            for(var l =0, pl = master_item.photos.length; l < pl ; l++){

              var photo_date = '';
              if(master_item.photos[l].mb_createdAt == '0000-00-00 00:00:00' ||  !master_item.photos[l].mb_createdAt ){
                photo_date = master_item.photos[l].createdAt;
              }
              else{
                photo_date = master_item.photos[l].mb_createdAt;
              }
              if(report_settings.show_photo_date_time != 1){
                photo_date = '';
              }
              else{
                photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
              }



              if(master_item.photos[l].file_name){
                photos_html = '<div class="img-inline-wrapper">' +
                   '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (master_item.photos[l].file_name.substr(0, master_item.photos[l].file_name.lastIndexOf('.')) || master_item.photos[l].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                   '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
                   '</div>';
                   break;
              }

            }
       }

        var temp_sub_items_html = '<div class="divrow">' +
           '<div style="width: 20%; display:inline-block"><span class="left-text">'+ master_item.master.name +'</span></div>' +
           '<div style="width: 15%; display:inline-block"> <span class="left-text">'+ option +'</span></div>' +
           '<div style="width: 35%; display:inline-block"> <span class="left-text">'+ desc +'</span></div>' +
           '<div style="width: 30%; display:inline-block"> <span class="left-text">'+ photos_html +'</span></div>' +
         '</div>';

         if(need_maintance){
           temp_sub_items_html +='<div style="width: 100%; display:block; padding: 10px;"> <span class="left-text" style="background-color:#e2401c; color:#ffffff; padding: 2px;">'+ need_maintance +'</span></div>';
         }

        if(!master_item.feedback.option && !master_item.feedback.comment && !need_maintance){
          sub_items_html += '';
        }
        else{
          sub_items_html += temp_sub_items_html;
          check_master_item_data_exists = true;
        }

        if(check_master_item_data_exists){
          master_html +='<div class="chapter" style="padding:0px; border: none; width:100%;color:' + report_settings.table_header_color + '; background-color:' + report_settings.table_header_bg_color + '; "">' +
           '<h1 class="sub-heading">' + master_item.master.name + '</h1>' +
           '<hr/><div style="margin:0; width:100%;">' +
            '<div style="margin-top: 20px; margin-bottom: 20px; width:100%;">' +
               top_photos +
             '</div>' +
            ' <div class="rt-2-des">' +
               '<span>' +
               '</span>' +
             '</div>' +
             '<div style="border: 0; width: 100%; margin: 0; padding: 0;">' +
                  '<div class="divtable" style="width:20%; display: inline-block;">&nbsp;Item</div>' +
                  '<div class="divtable" style="width:15%; display: inline-block;">Condition</div>' +
                  '<div class="divtable" style="width:35%; display: inline-block; text-align:center;">Description</div>' +
                  '<div class="divtable" style="width:30%; display: inline-block;">Image</div>' +
                '<div>' +
                sub_items_html +
         '</div></div>'+
         '</div></div>';
        }

      } //item end


    }//style 5 end


    //---------------------------------end of styles--------------------------

    // merger photos

    var total_photos = [];
    if(master_item.type == 'SUB'){
      total_photos = master_item.temp_top_photos;
    }
    else if(master_item.type == 'ITEM'){
      total_photos = master_item.photos;
    }

    var total_photo_html = '';

    if(total_photos.length > 0 && report_settings.show_photos != 'NO'){

      var photo_count = 0;
      for(var po =0, pol = total_photos.length; po < pol ; po++){

        var photo_date = '';
        if(total_photos[po].mb_createdAt == '0000-00-00 00:00:00' ||  !total_photos[po].mb_createdAt ){
          photo_date = total_photos[po].createdAt;
        }
        else{
          photo_date = total_photos[po].mb_createdAt;
        }
        if(report_settings.show_photo_date_time != 1){
          photo_date = '';
        }
        else{
          photo_date = photo_date.toISOString().slice(0, 19).replace('T', ' ');
        }

        if(total_photos[po].file_name){

          photo_count += 1; // increase counter

          if(report_settings.photo_collection_layout ==  '2-COL'){

            total_photo_html += '<div style="width: 30%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; margin-top: 20px; max-width: 300px;">' +
                 '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (total_photos[po].file_name.substr(0, total_photos[po].file_name.lastIndexOf('.')) || total_photos[po].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
                 '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
               '</div>';
          }
          else if(report_settings.photo_collection_layout ==  '3-COL'){

            total_photo_html += '<div style="width: 25%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; margin-top: 20px; max-width: 300px;">' +
              '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (total_photos[po].file_name.substr(0, total_photos[po].file_name.lastIndexOf('.')) || total_photos[po].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
              '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
            '</div>';

          }
          else if(report_settings.photo_collection_layout ==  '4-COL'){

            total_photo_html += '<div style="width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; margin-top: 20px; max-width: 300px;">' +
              '<img src="' + server_image_path +  property_id + '/' + 'report_300_' + (total_photos[po].file_name.substr(0, total_photos[po].file_name.lastIndexOf('.')) || total_photos[po].file_name) + '.jpg' + '" alt="img" class="rt-2-tbl-img" />' +
              '<div style="font-style: italic; color: #a0a0a0; text-align: left;">'+ photo_date +'</div>'+
              '<div>' +
              '<a href="'+ server_image_path +  property_id + '/' + total_photos[po].file_name + '">Ref'+ (po + 1) +'</a>' +
              '</div>' +
            '</div>';

          }

        }



        if(report_settings.show_photos == 'LIMIT' && report_settings.show_photos_limit ){

          var limit_photo =  report_settings.show_photos_limit? report_settings.show_photos_limit: 0;

          if(limit_photo){

              if(photo_count >= limit_photo){
                break;
              }
          }

        }


      }


      var photo_page = '';
      photo_page = '<div style="width: 100%;" ><h1 class="sub-heading" style="margin-top: 20px;">'+ master_item.master.name +' - Photos</h1>'+
      '<hr/>' +
      '<div style="margin-top: 20px; width:100%; text-align:left;" class="div-img-wrapper">'+
        total_photo_html +
      '</div></div>';

      merger_photos_html += photo_page;

    }




  }// end of master


    var style_sub_heading_color = report_settings.page_header_color?  report_settings.page_header_color:  '#797979';
    var style_sub_heading_bg = '#ffffff';
    if(report_settings.page_header_layout == 'SOLID' ){
      style_sub_heading_bg = report_settings.base_color? report_settings.base_color : '#ffffff';
    }
    var style_table_header_bg = report_settings.table_header_bg_color?  report_settings.table_header_bg_color:  '#0088CC';
    var style_table_header_txt = report_settings.table_header_color?  report_settings.table_header_color:  '#ffffff';

    var jesus_photos = '';
    if(report_settings.show_photos == 'NO' || report_settings.items_details_layout == 'STYLE 2' ){
      merger_photos_html = '';
    }
    else{
      jesus_photos = '<div class="chapter">' +
      '<div class="heading" style="width:100%; border-bottom: 1px solid #000000;margin-bottom: 40px; margin-top: 40px;">Index of All Photos</div>' +
      merger_photos_html +
      '</div></div>';
    }

    var signature = '';

    if(report_settings.include_singatures == 1){

      var tenant_url ='';
      var lanlord_url = '';
      var clerk_url = '';

      var landlord_img = '';
      var tenant_img = '';
      var clerk_img = '';



      if(signature_data){

      if(Object.keys(signature_data).length === 0 && signature_data.constructor === Object ){
        tenant_url = signature_data.tenant_url;
        lanlord_url = signature_data.lanlord_url;
        clerk_url = signature_data.clerk_url;
      }

      if(lanlord_url){
        landlord_img = '<img src="'+ lanlord_url +'" alt="img" class="rt-2-tbl-img"  style="width: 100px; height: auto;"/>';
      }

      if(tenant_url){
        tenant_img = '<img src="'+ tenant_url +'" alt="img" class="rt-2-tbl-img"  style="width: 100px; height: auto;"/>';
      }

      if(clerk_url){
        clerk_img = '<img src="'+ clerk_url +'" alt="img" class="rt-2-tbl-img"  style="width: 100px; height: auto;"/>';
      }
    }

      signature ='<div class="chapter">' +
        '<h1 class="sub-heading">Declaration</h1>' +
        '<hr/>' +
          '<p class="paratxt">' +
            'Whilst every care has been taken to ensure the accuracy of this schedule, accuracy cannot be guaranteed by the preparer.'+
          '</p>' +
          '<p class="paratxt">' +
            'The Landlord and the Tenant(s) are reminded that it is their responsibility to check the accuracy of this schedule and are advised to sign it in confirmation.' +
          '</p>' +
          '<p class="paratxt">' +
            'This inventory relates only to the furniture, furnishings and all Landlord\'s equipment and contents in the property. It is no guarantee of, or report on, the adequacy of, or safety of any such equipment or contents, merely a record that such items exist in the property at the date of the inventory and the superficial content of same.' +
          '</p>'+
          '<p class="paratxt">' +
            'This is to certify that we the undersigned have carefully checked the foregoing inventory and subject to the marginal notes, consider this to be a fair and correct schedule of condition of the contents therein.' +
          '</p>' +
          '<P class="paratxt">'+
            'The tenant/landlord has 7 days from receipt of this inventory to notify the agent/landlord/inventory company of any discrepancies.' +
          '</p>' +
        '<div>' +

          '<table style="width: 100%; border: 0; margin-top: 40px; font-size: 14px;">' +
             '<thead>' +
               '<th style="width: 50%;"></th>' +
               '<th style="width: 50%;"></th>' +
             '</thead>' +
             '<tbody>' +
                '<tr style="height: 50px;">' +
                  '<td><span style="font-weight: bold; font-size: 18px; color: #555555">Landlord</span></td>' +
                  '<td></td>' +
                '</tr>' +
                '<tr style="height: 80px;">' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 60%; "/>' +
                    '<span>Signature</span><br/>' +
                    landlord_img +
                  '</td>' +
                  '<td></td>' +
                '</tr style="height: 80px;">' +
                '<tr>' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 60%; "/>' +
                    '<span>Print name</span></td>' +
                  '<td></td>' +
                '</tr>' +
                '<tr style="height: 80px;">' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 35%; "/>' +
                    '<span>Date</span></td>' +
                  '<td></td>' +
                '</tr>'+
                '<tr style="height: 70px;">' +
                  '<td><span style="font-weight: bold; font-size: 18px; color: #555555;">Tenant</span></td>' +
                  '<td><span style="font-weight: bold; font-size: 18px; color: #555555;">Clerk</span></td>' +
                '</tr>' +
                '<tr style="height: 50px;">' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 60%; "/>' +
                    '<span>Signature</span><br/>' +
                    tenant_img +
                  '</td>' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 60%; "/>' +
                    '<span>Signature</span><br/>' +
                     clerk_img +
                  '</td>' +
                '</tr>' +
                '<tr style="height: 50px;">' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 60%; "/>' +
                    '<span>Print name</span>' +
                  '</td>' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 60%; "/>' +
                    '<span>Print name</span>' +
                  '</td>' +
                '</tr>' +
                '<tr style="height: 50px;">' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 35%; "/>' +
                    '<span>Date</span>' +
                  '</td>' +
                  '<td>' +
                    '<hr style="border:0; margin:0; padding:0; height:1px; color:#555555; background-color:#555555; width: 35%; "/>' +
                    '<span>Date</span>' +
                  '</td>' +
                '</tr>' +

              '</tbody>' +
            '</table>' +

        '</div>' +
      '</div>';
    }


	 	html = '<!DOCTYPE html>'+
             '<html lang="en"><style type="text/css" media="screen,print">'+
                '<head>' +
                 '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                 '<TITLE>' + property_info.report_type + '</TITLE>' +
                 '<style type="text/css" media="screen,print">' +
                   'html{color:#000;background:#FFF;}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,' +
                   'pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td{margin:0;padding:0;}' +
                   'table{border-collapse:collapse;border-spacing:0;}fieldset,img{border:0;}address,caption,' +
                   'cite,code,dfn,em,strong,th,var{font-style:normal;font-weight:normal;}li{list-style:none;}' +
                   'caption,th{text-align:left;}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal;}' +
                   'q:before,q:after{content:"";}abbr,acronym{border:0;font-variant:normal;}' +
                   'sup{vertical-align:text-top;}sub{vertical-align:text-bottom;}input,textarea,' +
                   'select{font-family:inherit;font-size:inherit;font-weight:inherit;}input,textarea,' +
                   'select{*font-size:100%;}legend{color:#000;}' +
                   '* { overflow: visible !important; }' +
                   'html,body { font-family: serif; font-size:16px; width: 100% }'+
                   '.chapter { width: 100%; display: block; clear: both; page-break-before: always; padding: 5px; margin:0;  margin-top: 5px; margin-bottom: 5px;}'+
                   '.block { display: block; clear: both; padding: 20px;}' +
                   '.heading{ font-size:20px; color: #0088CC; line-height: 20px; margin-bottom: 10px; font-weight: bold;}' +
                   '.sub-heading{ font-size: 18px; margin-top: 10px; color:' + style_sub_heading_color +'; line-height: 18px; font-weight: bold; background-color: ' + style_sub_heading_bg + '; width: 100%; }' +
                   'hr { border:0; margin:0; padding:0; height:1px; color:'+ style_sub_heading_color + '; background-color:'+ style_sub_heading_color + '; margin-top: 7px; margin-bottom: 10px;}' +
                   'thead { display: table-header-group; }' +
                   'tfoot { display: table-row-group; }' +
                   'tr { page-break-inside: avoid; }' +
                   '.format-table { border: 0; width: 100%; margin-bottom: 10px; }' +
                   '.format-table td{ padding: 10px; border-bottom: 1px solid #E5E5E5; }' +
                   '.format-table tr{ font-size: 14px;  padding: 10px;}' +
                   '.format-table thead { background-color: '+ style_table_header_bg +'; }' +
                   '.format-table th { padding: 10px; text-align: left; font-size: 16px; font-weight: bold; color: '+ style_table_header_txt +';}' +
                   '.condtion-tbl th.col1 { width: 50%; } .condtion-tbl th.col2 { width: 50%; }' +
                   '.condtion-tbl th.col3 { width: 70%; } .report-tbl1 th.col1 {width: 20%;}' +
                    '.report-tbl1 th.col2 {width: 25%;}' +
                   '.report-tbl1 th.col3 {width: 40%;}' +
                   '.report-tbl1 th.col4 {width: 15%;}' +
                   '.report-tbl2 th.col1 {width: 20%;}' +
                   '.report-tbl2 th.col2 {width: 20%;}' +
                   '.report-tbl2 th.col3 {width: 40%;}' +
                   '.report-tbl2 th.col4 {width: 20%;}' +
                   '.report-tbl3 th.col1 {width: 20%;}' +
                   '.report-tbl3 th.col2 {width: 40%;}' +
                   '.report-tbl3 th.col3 {width: 40%;}' +
                   '.report-tbl4 th.col1 {width: 30%;}' +
                   '.report-tbl4 th.col2 {width: 50%;}' +
                   '.report-tbl4 th.col3 {width: 20%;}' +
                   '.report-tbl5 th.col1 {width: 25%;}' +
                   '.report-tbl5 th.col2 {width: 35%;}' +
                   '.report-tbl5 th.col3 {width: 40%;}' +
                   '.report-tbl6 th.col1 {width: 45%;}' +
                   '.report-tbl6 th.col2 {width: 450%;}'+
                   '.report-tbl6 th.col3 {width: 10%;}' +
                   '.report-tbl7 th.col1 {width: 30%;}' +
                   '.report-tbl7 th.col2 {width: 70%;}' +
                   '.right-text{ text-align: right;}' +
                   '.img-wrapper{width: 30%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px;}' +
                   '.img-wrapper1{width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px; min-width: 200px; height: auto;}' +
                   '.rt-1-img{ width: 100%; height: auto;  display: inline-block; max-width: 300px;}' +
                   '.img-inline-wrapper{ width: 80%; padding: 10px; background-color: #e1e1e1; display: inline-block; max-width: 300px; }' +
                   '.rt-2-tbl-img{ width: 100%; height: auto; max-width: 300px;}' +
                   '.report-tbl2{ margin-top: 20px;}' +
                   '.rt-2-top-img-wrapper{ margin-bottom: 10px; }' +
                   '.report-tbl3{ margin-top: 20px;}' +
                   '.img-tblrow-wrapper{ width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; max-width: 300px;}' +
                   '.rt-3-tbl-img{ width: 100%; height: auto; max-width: 300px;}' +
                   '.paratxt {font-size: 14px; margin-bottom: 10px; width: 90%;}' +
                   'table, tr, td, th, tbody, thead, tfoot { page-break-inside: avoid !important; }' +
                   'thead, tfoot {display: table-row-group; }' +
                   'table tr img { page-break-after: avoid;}' +
                   '.divtable { margin-top: 30px; width:100%; background-color: '+ style_table_header_bg +'; padding-top: 10px; padding-bottom: 10px; text-align: left; font-size: 16px; font-weight: bold; color: '+ style_table_header_txt +'; }' +
                   '.divrow {width:100%; padding: 10px; border-top: 1px solid #E5E5E5;  page-break-inside: avoid; page-break-after: avoid; display:block; }' +
                   '.divrow-noborder {width:100%; padding: 10px;}' +
                  '.div-img-wrapper {text-align:left; padding-top: 10px; padding-bottom: 10px; width:100%; padding-right: 10px; page-break-inside: avoid; page-break-after: avoid; display:block;}'+
                   '</style></head><body>' +

                      general_notes +
                      general_conditiions_html +
                      meter_html +
                      master_html +
                      jesus_photos +
                      signature +
                '</body></html>';

            res.set({
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': 'filename="report.pdf"'
            });

          	var options = {
              disableSmartShrinking: true,
              encoding : 'utf-8',
              // marginBottom: '10mm',
              // marginTop: '10mm',
              headerHtml: 'http://propertyground.co.uk/header.php?address='+ encodeURIComponent(property_info.address_1 + ' ' + property_info.address_2) +'&type=' + encodeURIComponent(property_info.report_type),
              //headerHtml: 'http://propertyground.co.uk/header.php?address=sara&type=assss',
              footerHtml:  'http://propertyground.co.uk/footer.html',
              //output: 'report.pdf'

            };


            // wkhtmltopdf(html, options,  function (err, stream){
            //   if (err){
            //     sails.log(err);
            //   }
            //
            //   sails.log('file created');
            //
            //   res.download('report.pdf');
            //
            //   //res.attachment('report.pdf');
            //
            //
            // });

            //sails.log(html);
            // var fs = require('fs');
            // var exec = require('child_process').exec;
            // var util = require('util');
            //
            // var htmlFileName = "page.html", pdfFileName = "sara_1.pdf";
            //
            // fs.writeFile(htmlFileName, html, function(err) {
            //   if(err) { throw err; }
            //     util.log("file saved to site.html");
            //
            //     var child = exec("xvfb-run wkhtmltopdf " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
            //     if(err) { throw err; }
            //       util.log(stderr);
            //     });
            //
            // });

            var fs = require('fs');
            var xls_file_path =  '/home/propertyground/public_html/' + user.id + '.xsl';


            var front_photo = '';
            if(property_info.image_url){
              front_photo =  server_image_path +  property_id + '/' + '300_' + (property_info.image_url.substr(0, property_info.image_url.lastIndexOf('.')) || property_info.image_url) + '.jpg';
            }
            else{


              if(total_photos.length > 0 && total_photos[0].file_name){
                front_photo = server_image_path +  property_id + '/' + '300_' + (total_photos[0].file_name.substr(0, total_photos[0].file_name.lastIndexOf('.')) || total_photos[0].file_name) + '.jpg';
              }
              else if(photo_data.length > 0 && photo_data[0].file_name ){
                front_photo = server_image_path +  property_id + '/' + '300_' + (photo_data[0].file_name.substr(0, photo_data[0].file_name.lastIndexOf('.')) || photo_data[0].file_name) + '.jpg';
              }
              sails.log(front_photo);

            }

            var logo_photo = '';
            if(report_settings.logo_url){
              logo_photo =  server_rpt_image_path   + '300_' + (report_settings.logo_url.substr(0, report_settings.logo_url.lastIndexOf('.')) || report_settings.logo_url) + '.jpg';
            }
            else{
              logo_photo = '/home/propertyground/public_html/images/property-ground-logo.png' ;
            }


            sails.log("xls path " + front_photo );

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10) {
                dd = '0'+dd
            }
            if(mm<10) {
                mm = '0'+mm
            }
            var report_date = mm + '/' + dd + '/' + yyyy;
            if(!property_info.report_date || property_info.report_date != '0000-00-00 00:00:00'){
              report_date = property_info.report_date;
              sails.log(report_date);
              var dateParts = new Date(report_date);
              report_date = report_date.toISOString().slice(0, 19).replace('T', ' '); //dateParts.getDate() + '-', dateParts.getMonth()+1 + '-', dateParts.getFullYear();
              sails.log(report_date);
            }


            var xls_str = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<xsl:stylesheet version="2.0"  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:outline="http://wkhtmltopdf.org/outline" xmlns="http://www.w3.org/1999/xhtml">' +
            '<xsl:output doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" indent="yes" />' +
              '<xsl:template match="outline:outline">' +
                '<html> <head> <title>Table of Contents</title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
                  '<style>' +
                      ' html,body { font-family: sans-serif; font-size:12px; }' +
                      ' h1 { text-align: left; font-family: sans-serif; font-size:25px; color: #0088CC; line-height: 28px; margin-bottom: 30px; font-weight: bold; }' +
                      ' .heading { text-align: left; font-family: sans-serif; font-size:25px; color: #0088CC; line-height: 28px; margin-bottom: 30px; font-weight: bold; }' +
                      ' .border-line { border-bottom: 1px dashed #797979;}' +
                      ' span { float: right;}' +
                      ' li { list-style: none; margin-top: 7px; margin-bottom: 25px; }' +
                      ' ul { font-size: 15px; font-family: sans-serif; color: #797979; line-height: 20px; font-weight: bold; }' +
                      ' ul ul {font-size: 80%; } ul {padding-left: 0em;} ul ul {padding-left: 1em;}' +
                      ' a {text-decoration:none; color: #797979;}' +
                      ' .chapter { display: block; clear: both; page-break-after: always; padding: 20px;}' +
                    '</style>' +
                  '</head>' +
                  '<body>' +
                    '<div class="chapter">';

            if(report_settings.front_page_layout == 'TEMPLATE 3'){
              xls_str += '<table style="width: 100%; border: 0; margin-top: 20px;">' +
                 '<thead>' +
                   '<th style="width: 30%;"></th>' +
                   '<th style="width: 70%;"></th>' +
                 '</thead>' +
                 '<tbody>' +
                    '<tr>' +
                      '<td style="text-align: left;">' +
                        '<div style="width: 100%; padding: 10px; background-color: #ffffff; ">' +
                          '<img src="' + logo_photo + '" alt="img" style="width: 100px; height: auto; max-width: 100px;"/>' +
                        '</div>' +
                      '</td>' +
                      '<td style="text-align: right; border-top: 1px solid #2196F3; border-bottom: 1px solid #2196F3; padding: 10px;">' +
                        '<div style="background-color: #ffffff; color: #000000; ">' +
                          '<div style="font-size: 16px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; ">' + company_data.company_name + '</div>' +
                          '<div style="font-size: 16px; margin-bottom: 5px;">' + company_data.address + '</div>' +
                          '<div style="font-size: 16px; margin-bottom: 5px;">' + company_data.telephone + '</div>' +
                        '</div>' +
                      '</td>' +
                    '</tr>' +
                  '</tbody>' +
              '</table>' +
              '<div style="width: 100%; border: 0; margin-top: 45px; text-align:center;">' +
                '<div style="width: 100%; border: 0; text-align:center;">' +
                  '<div style="color: #000000; margin-bottom: 10px;  padding-top: 10px; padding-bottom: 10px; padding-right: 10px; padding-left: 10px; display:inline-block; ">' +
                    '<div style="font-size: 25px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; ">' + property_info.report_type + '</div>' +
                  '</div>' +
                '</div>' +
                '<br/>' +
                '<div style="width: 100%; border: 0; text-align:center;">' +
                  '<div style="padding: 0px; background-color: #ffffff; border-bottom: 4px solid #2196F3; border-top: 4px solid #2196F3; display: inline-block;">' +
                    '<img src="' + front_photo + '" alt="img" style="width: 600px; height: auto; max-height: 400px;  display: inline-block; max-width: 600px;" />' +
                  '</div>' +
                '</div>' +
                '<div style="width: 100%; text-align:center; border-top: 1px solid #2196F3; margin-top: 40px;">' +
                  '<div style="background-color: #ffffff; color: #000000; text-align:left; margin-top: 10px; padding-top: 10px; padding-bottom: 10px; padding-right: 10px; padding-left: 10px; display:inline-block; ">' +
                    '<div style="font-size: 16px; margin-bottom: 5px;">' + property_info.address_1 + ' ' + property_info.address_2 + '</div>' +
                    '<div style="font-size: 16px; margin-bottom: 5px;">' + property_info.city + ' ' + property_info.postalcode + '</div>' +
                    '<div style="font-size: 16px; margin-bottom: 5px;">Prepared by: ' + user.first_name + ' ' + user.last_name + '</div>' +
                    '<div style="font-size: 16px; margin-bottom: 5px;">Date of Inspection: ' + report_date + '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';

            }
            else if(report_settings.front_page_layout == 'TEMPLATE 2'){
              xls_str += '<table style="width: 100%; border: 0; margin-top: 20px;">' +
                 '<thead>' +
                   '<th style="width: 30%;"></th>' +
                   '<th style="width: 70%;"></th>' +
                 '</thead>' +
                 '<tbody>' +
                    '<tr>' +
                      '<td style="text-align: left;">' +
                        '<div style="width: 100%; padding: 10px; background-color: #ffffff; ">' +
                          '<img src="' + logo_photo + '" alt="img" style="width: 100px; height: auto; max-width: 100px;"/>' +
                        '</div>' +
                      '</td>' +
                      '<td style="text-align: right; border-top: 1px solid #2196F3; border-bottom: 1px solid #2196F3; padding: 10px;">' +
                        '<div style="background-color: #ffffff; color: #000000; ">' +
                          '<div style="font-size: 16px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; ">' + company_data.company_name + '</div>' +
                          '<div style="font-size: 16px; margin-bottom: 5px;">' + company_data.address + '</div>' +
                          '<div style="font-size: 16px; margin-bottom: 5px;">' + company_data.telephone + '</div>' +
                        '</div>' +
                      '</td>' +
                    '</tr>' +
                  '</tbody>' +
              '</table>' +
              '<div style="width: 100%; border: 0; margin-top: 45px; text-align:center;">' +
                '<div style="width: 100%; border: 0; text-align:center;">' +
                  '<div style="background-color: #f7f7f7; color: #000000; margin-bottom: 20px;  padding-top: 10px; padding-bottom: 10px; padding-right: 10px; padding-left: 10px; display:inline-block; ">' +
                    '<div style="font-size: 23px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; ">' + property_info.report_type + '</div>' +
                    '<div style="font-size: 18px;">Date of Inspection: ' + report_date + '</div>' +
                    '<div style="font-size: 18px;">Prepared by: '+ user.first_name + ' ' + user.last_name + '</div>' +
                  '</div>' +
                '</div>' +
                '<br/>' +
                '<div style="width: 100%; border: 0; text-align:center;">' +
                  '<div style="padding: 10px; background-color: #ffffff; border: 1px solid #efefef; display: inline-block;">' +
                    '<img src="' + front_photo + '" alt="img" style="width: 100%; height: auto; max-height: 400px; display: inline-block; max-width: 300px;" />' +
                  '</div>' +
                '</div>' +
                '<div style="width: 100%; border: 0; text-align:center;">' +
                  '<div style="background-color: #ffffff; color: #000000; margin-top: 40px; text-align:left; padding-top: 10px; padding-bottom: 10px; padding-right: 10px; padding-left: 10px; display:inline-block; ">' +
                    '<div style="font-size: 16px; margin-bottom: 5px;">'+ property_info.address_1 + ' ' + property_info.address_2 + '</div>' +
                    '<div style="font-size: 16px; margin-bottom: 5px;">'+ property_info.city + ' ' + property_info.postalcode + '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
            }
            else if(report_settings.front_page_layout == 'TEMPLATE 1'){
              xls_str += '<table style="width: 100%; border: 0; margin-top: 20px;">' +
                 '<thead>' +
                   '<th style="width: 30%;"></th>' +
                   '<th style="width: 70%;"></th>' +
                 '</thead>' +
                 '<tbody>' +
                    '<tr>' +
                      '<td style="text-align: left;">' +
                        '<div style="width: 100%; padding: 10px; background-color: #ffffff; ">' +
                          '<img src="' + logo_photo + '" alt="img" style="width: 100px; height: auto; max-width: 100px;"/>' +
                        '</div>' +
                      '</td>' +
                      '<td style="text-align: right; border-top: 1px solid #2196F3; border-bottom: 1px solid #2196F3; padding: 10px;">' +
                        '<div style="background-color: #ffffff; color: #000000; ">' +
                          '<div style="font-size: 16px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; ">' + company_data.company_name + '</div>' +
                          '<div style="font-size: 16px; margin-bottom: 5px;">' + company_data.address + '</div>' +
                          '<div style="font-size: 16px; margin-bottom: 5px;">' +  company_data.telephone + '</div>' +
                        '</div>' +
                      '</td>' +
                    '</tr>' +
                  '</tbody>' +
              '</table>' +
              '<table style="width: 100%; border: 0; margin-top: 100px;">' +
                 '<thead>' +
                   '<th style="width: 50%;"></th>' +
                   '<th style="width: 50%;"></th>' +
                 '</thead>' +
                 '<tbody>' +
                    '<tr>' +
                      '<td style="text-align: right;">' +
                        '<div style="width: 70%; padding: 10px; background-color: #ffffff; border: 1px solid #efefef; display: inline-block; margin: 5px">' +
                          '<img src="' + front_photo + '" alt="img" style="width: 100%; height: auto; max-height: 400px; display: inline-block; max-width: 300px;" />' +
                        '</div>' +
                      '</td>' +
                      '<td style="width: 50%; text-align: left;">' +
                        '<div style="text-align: left; margin-top: 10px; padding-left: 20px; margin-bottom: 30px; ">' +
                          '<img src="' + logo_photo + '" alt="img" style="width: 120px; height: auto; max-width: 120px;"/>' +
                        '</div>' +
                        '<div style="background-color: #f7f7f7; color: #000000; margin-bottom: 20px;  padding-left: 20px; padding-top: 20px; padding-bottom: 20px; padding-right: 10px;  width: 90%;">' +
                          '<div style="font-size: 23px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; ">' + property_info.report_type  + '</div>' +
                          '<div style="font-size: 20px;">Date of Inspection: ' + report_date + '</div>' +
                          '<div style="font-size: 20px;">Address: ' + property_info.address_1 + ' ' + property_info.address_2 + '</div>' +
                          '<div style="font-size: 20px;">' + property_info.city + ' ' + property_info.postalcode + '</div>' +
                        '</div>' +
                      '</td>' +
                    '</tr>' +
                  '</tbody>' +
              '</table>';
            }

            xls_str += '</div>' +
            '<div class="chapter">' +
              '<div class="heading">Table of Contents</div>' +
              '<ul><xsl:apply-templates select="outline:item/outline:item"/></ul>' +
            '</div>' +
          '</body>' +
        '</html>' +
      '</xsl:template>' +
      '<xsl:template match="outline:item">' +
        '<li>' +
          '<xsl:if test="@title!=\'\'">' +
            '<div class="border-line">' +
              '<a>' +
                '<xsl:if test="@link">' +
                  '<xsl:attribute name="href"><xsl:value-of select="@link"/></xsl:attribute>' +
                '</xsl:if>' +
                '<xsl:if test="@backLink">' +
                  '<xsl:attribute name="name"><xsl:value-of select="@backLink"/></xsl:attribute>' +
                '</xsl:if>' +
                '<xsl:value-of select="@title" />' +
              '</a>' +
              '<span> <xsl:value-of select="@page" /> </span>' +
            '</div>' +
          '</xsl:if>' +
          '<ul>' +
            '<xsl:comment>added to prevent self-closing tags in QtXmlPatterns</xsl:comment>' +
            '<xsl:apply-templates select="outline:item"/>' +
          '</ul>' +
        '</li>' +
      '</xsl:template>' +
    '</xsl:stylesheet>';



            sails.log("can view ???");
            sails.log(can_view_report);

            if(can_view_report == 1){
              //report generate ---------------------------------------

              try {
                  fs.truncate(xls_file_path, 0, function() {
                      fs.writeFile(xls_file_path, xls_str, function (err) {
                          if(err){
                            sails.log("Error writing file: " + err);
                          }
                          else{
                            options['toc'] = true;
                            options['xslStyleSheet'] = xls_file_path; //'/home/propertyground/public_html/tocstyle.xsl';
                          }

                          return wkhtmltopdf(html, options).pipe(res);

                      });
                  });
                  //report generate ---------------------------------------
                } catch (err) {
                  // Handle the error here.
                }
          }
          else{
              res.json({ error: 'subscription error' });
          }




        })
        .fail(function(err) {
            console.log(err);
            res.json({ error: err });
        });


      }
    }


  },



}
