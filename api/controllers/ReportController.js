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


        User.findOne({id :  req.token.sid}).exec(function(err, user){
          if(err) return res.json(err);

          //check if the user is authorize to access this property
          if(user.company_id){

            Report_settings.findOne(company_id: user.company_id).exec(function(err, report){
              if (err) return res.json(err);

              return res.json(200, { status: 1, report_settings: report });
            });


          }
          else{
            return res.json({status: 2, text: 'you are not allow to access this info!' });
          }

        });

      }
    }


  }


}
