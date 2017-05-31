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

            // var newJson = {};
            // newJson.report_settings = report_settings;
            // newJson.report_settings_notes = report_settings_notes;
            // return res.json({ status: 1, data: newJson });
             var fs = require('fs');
             var wkhtmltopdf = require('wkhtmltopdf');
             var html ="<h1>Test</h1><p>Hello world</p>";
            //
            // //res.attachment('report.pdf');
            //res.set('Content-disposition', 'attachment; filename=report.pdf');
            //
            res.set({
                           'Content-Type': 'application/octet-stream',
                           'Content-Disposition': 'filename="report.pdf"'
            });

            //return wkhtmltopdf( html, { pageSize: 'letter' })
            //.pipe(fs.createWriteStream('report.pdf'));

           return wkhtmltopdf(html).pipe(res);


            /*
            working set
            var fs = require('fs');
            var exec = require('child_process').exec;
            var util = require('util');

            var dummyContent = '<!doctype html><html><head><title>Test</title><meta charset="utf-8"></head><body><p>Hello world!</p></body></html>';
	          var htmlFileName = "page.html", pdfFileName = "page.pdf";

            fs.writeFile(htmlFileName, dummyContent, function(err) {
          		if(err) { throw err; }
          		util.log("file saved to site.html");

              var child = exec("xvfb-run wkhtmltopdf " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
                if(err) { throw err; }
                util.log(stderr);
              });


          	});
            */




        })
        .fail(function(err) {
            console.log(err);
            res.json({ error: err });
        });


      }
    }


  },



}
