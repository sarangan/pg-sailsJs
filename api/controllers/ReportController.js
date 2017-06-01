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
          if(user.company_id){

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
              console.log('property_id');
              console.log(property_id);


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

              var general_condition_data = Property_general_condition_link.find( {property_id: property_id, status: 1} )
                .then(function(general_condition_data) {
                    return general_condition_data;
              });



              return [report_settings_data, report_settings_notes_data, property_info_data, general_condition_data ];

          }
          else{
            return res.json({status: 2, text: 'you are not allow to access this info!' });
          }

        })
        .spread(function(report_settings, report_settings_notes, property_info, general_conditions ) {


             var fs = require('fs');
             var wkhtmltopdf = require('wkhtmltopdf');

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
              	       '<p><b>' + report_settings_notes[i].title +
              	       '</b></p><br/><p>' +
              	       report_settings_notes[i].note +
              	       '</p></div>';
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

               general_conditiions_html += '<tr>' +
                 '<td class="col1"><span class="left-text">'+ general_conditions[i].item_name +'</span></td>' +
                 '<td class="col2"><span class="right-text">'+ general_conditions[i].user_input +'</span></td>' +
               '</tr>';
            }

          general_conditiions_html += '</tbody></table></div></div>';
        }
//end genral conditions----------------------------------------------------------------------------------



	 	html = '<!DOCTYPE html>'+
             '<html lang="en"><style type="text/css" media="screen,print">'+
                '<head>' +
                 '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                 '<TITLE>Inventory Report</TITLE>' +
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
                   'html,body { font-family: serif; font-size:14px; }'+
                   '.chapter { display: block; clear: both; page-break-after: always; padding: 20px; margin-top: 30px; margin-bottom: 20px;}'+
                   '.block { display: block; clear: both; padding: 20px;}' +
                   '.heading{ font-size:25px; color: #0088CC; line-height: 28px; margin-bottom: 20px; font-weight: bold;}' +
                   '.sub-heading{ font-size: 25px; color: #797979; line-height: 28px; font-weight: bold;}' +
                   'hr { border:0; margin:0; padding:0; height:1px; color:#797979; background-color:#797979; margin-top: 7px; margin-bottom: 30px;}' +
                   'thead { display: table-header-group; }' +
                   'tfoot { display: table-row-group; }' +
                   'tr { page-break-inside: avoid; }' +
                   '.contents-table, .format-table { border: 0; width: 100%; margin-bottom: 40px; }' +
                   '.contents-table td, .format-table td{ padding: 10px; border-bottom: 1px solid #E5E5E5; }' +
                   '.contents-table tr, .format-table tr{ font-size: 14px;  padding: 10px;}' +
                   '.contents-table thead { background-color: #dcdcdc; }' +
                   '.format-table thead { background-color: #0088CC; }' +
                   '.contents-table th { padding: 10px; text-align: left; font-size: 14px; }' +
                   '.format-table th { padding: 10px; text-align: left; font-size: 16px; color: #ffffff;}' +
                   '.contents-table th.col1 { width: 90%; } .contents-table th.col2 { width: 10%; }' +
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
                   '.report-tbl4 th.col1 {width: 20%;}' +
                   '.report-tbl4 th.col2 {width: 40%;}' +
                   '.report-tbl4 th.col3 {width: 40%;}' +
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
                   '.img-wrapper1{width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px;}' +
                   '.rt-1-img{ width: 100%; height: auto;  display: inline-block; max-width: 300px;}' +
                   '.img-inline-wrapper{ width: 90%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px; }' +
                   '.rt-2-tbl-img{ width: 100%; height: auto; max-width: 300px;}' +
                   '.report-tbl2{ margin-top: 20px;}' +
                   '.rt-2-top-img-wrapper{ margin-bottom: 10px; }' +
                   '.report-tbl3{ margin-top: 20px;}' +
                   '.img-tblrow-wrapper{ width: 20%; padding: 10px; background-color: #e1e1e1; display: inline-block; margin: 5px; max-width: 300px;}' +
                   '.rt-3-tbl-img{ width: 100%; height: auto; max-width: 300px;}' +
                   '.paratxt {font-size: 14px; margin-bottom: 10px;}' +
                   '</style></head><body>' +
                      general_notes +
                      general_conditiions_html +
                '</body></html>';

            res.set({
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': 'filename="report.pdf"'
            });

          	var options = {
              disableSmartShrinking: true,
              encoding : 'utf-8'
            };

            return wkhtmltopdf(html, options).pipe(res);
        })
        .fail(function(err) {
            console.log(err);
            res.json({ error: err });
        });


      }
    }


  },



}
