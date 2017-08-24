/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	authenticate: function(req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(200, {err: 'username and password required'});
    }

    User.findOneByEmail(email, function(err, user) {
      if (!user) {
        return res.json(200, {err: 'invalid username or password'});
      }

      User.validPassword(password, user, function(err, valid) {
        if (err) {
          return res.json(200, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(200, {err: 'invalid username or password'});
        } else {
          res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
        }
      });
    })
  },

  register: function(req, res) {
    //TODO: Do some validation on the input
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		sails.log('i am in auth');
    if (req.param('password') !== req.param('confirmPassword')) {
			return res.json({status: 2, text: 'Password doesn\'t match' });
    }
   	else if(!re.test(req.param('email') )  && req.param('email') ){
			return res.json({status: 2, text: 'Invalid email address!' });
		}
		else if(!req.param('company_name') ){
			return res.json({status: 2, text: 'Please provide your company name' });
		}
		else{

			var comapany_data = {
				company_name : req.param('company_name'),
				address : req.param('address'),
				telephone : req.param('telephone'),
			};

			Company.create( comapany_data ).exec(function afterwards(err, company){

				sails.log(err);
					if (err) return res.json(err);

					if(company.company_id){
						var company_id = company.company_id;


						//add default report
						Report_settings.create({company_id: company_id}).exec(function afterwards(err, updated){
							if (err) return res.json(err);
						});

						var general_notes = {
			        '1': "Check-in Report",
			        '2': "Check-out Report",
			        '3': "Inventory Report",
			        '4': "Inventory and Check-in Report",
			        '5': "Midterm Inspection Report",
			        '6': "Interim Report",
			        '7': "General Overview Report",
			        '8': "Condition Report"
			      };

						for (var key in general_notes) {
			        if (general_notes.hasOwnProperty(key)) {

			          var temp_notes = {
			                note_title: general_notes[key],
			                title: general_notes[key],
			                note: '',
			                included: 0,
											company_id: company_id
			              };

								Report_settings_notes.create(temp_notes).exec(function updated(err, updated){
									if (err) return res.json(err);
								});

			        }
			      }

						//meter import
						Meter_type.find().exec(function(err, Meter_types){
							//console.log(Meter_types);
							var data = [];
							 for(var i=0,l = Meter_types.length; i < l; i++){
								 data.push({	company_id: company_id, meter_name: Meter_types[i].meter_name});

							 }

							 Company_meter_link.create(data).exec(function(err, com_meter){
									if (err) sails.log(res.json(err) ) ;
							 });
						});


						//general condition import
						General_condition.find().exec(function(err, General_conditions){
							//console.log(Meter_types);
							var data = [];
							 for(var i=0,l = General_conditions.length; i < l; i++){
								 data.push({company_id: company_id, item_name: General_conditions[i].item_name, options: General_conditions[i].options, priority: General_conditions[i].priority, type: General_conditions[i].type });

							 }

							 Company_general_condition_link.create(data).exec(function(err, com_meter){
									if (err) sails.log(res.json(err) ) ;
							 });
						});

						//master item import
					 Master_item.find().then(function(master_items){

						 var data_master_items = [];

						 for(var i=0, l = master_items.length; i < l; i++){
							 data_master_items.push({ original_master_id: master_items[i].master_id, company_id: company_id, item_name: master_items[i].item_name, type: master_items[i].type, option: master_items[i].option, priority: master_items[i].priority});
						 }

						 return Company_masteritem_link.create(data_master_items);

					 })
					 .catch( function(err){
						 // do something when is error
						 //return res.json(200, { status: 2, error:'update was not successfull'});
						 return res.json({status: 2, text: 'update was not successfull' });
					 })
					 .done(function(){
							 //cleanup
							 // sub items import
							 var qry = "select sub_item.*, company_masteritem_link.com_master_id as com_master_id from sub_item	inner join  company_masteritem_link on sub_item.master_id = company_masteritem_link.original_master_id where company_masteritem_link.company_id="+ company_id + " and company_masteritem_link.original_master_id= sub_item.master_id";
							 Sub_item.query(qry, function(err, sub_items){

								 var data = [];
								 for(var i=0,l = sub_items.length; i < l; i++){
									 data.push({com_master_id: sub_items[i].com_master_id, company_id: company_id, item_name: sub_items[i].item_name, type: sub_items[i].type, priority: sub_items[i].priority });
								 }

								 Company_subitem_link.create(data).exec(function(err, com_sub){
									 if (err) console.log(res.json(err) ) ;

										 //return res.json(200, {status: 'successfully updated'});
								 });


							 });

					 });



						var data = {
							email: req.param('email'),
							password: req.param('password'),
							type: 'ADMIN',
							company_id: company_id,
							first_name:  req.param('first_name'),
							last_name:  req.param('last_name'),
							contact:  req.param('contact'),
							status: 1
						};


						User.create(data).exec(function(err, user) {
				      if (err) {
				        res.json(200, {err: err});
				        return;
				      }
				      if (user) {
				        //res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id}), status: 1, text: 'successfully updated' } );

								 EmailService.sendEmail({
		 							 to: req.param('email'),
		 							 subject: 'Welcome to PropertyGround!',
									 text: "Hey " + req.param('first_name') + "\n Thanks for signing up, and welcome to PropertyGround!\nYou may customize your own proerty templates and reports." ,
									 html: '<b>Hey '+ req.param('first_name') + '</b><br/> Thanks for signing up, and welcome to PropertyGround!<br/>You may customize your own proerty templates and reports.'
		 						 }, function (err) {
		 						 });


								res.json({ status: 1, text: 'successfully updated' } );
				      }
				    });


					}

			});

		}

  },
	forgetpassword: function(req, res) {
    var email = req.param('email');

    if (!email ) {
      return res.json({status: 2, text: 'email required'});
    }
		else{

			User.findOneByEmail(email, function(err, user) {

	      if (!user) {
	        return res.json({status: 2, text: 'invalid email'});
	      }
				else{

					var password = '';
					var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	 				for (var i = 9; i > 0; --i){
						password += chars[Math.floor(Math.random() * chars.length)];
					}

					var data = {
						password: password,
					}

					User.update({id: user.id }, data).exec(function afterwards(err, updated){
						if (err) return res.json(err);

						EmailService.sendEmail({
							 to: user.email,
							 subject: 'Reset password',
							 text: "Hello" + user.first_name + ",\n Your new password is : " + password +  "\nWe have reset your account password.\nYou may use this password to login to PropertyGround dashboard and change your password.\n Thank you.\nPropertyGround Team." ,
							 html: '<b>Hello '+ user.first_name + '</b><br/>Your new password is : ' + password + '<br/>We have reset your account password.<br/>You may use this password to login to PropertyGround dashboard and change your password.<br/>Thank you.<br/><b>PropertyGround Team</b>'
						 }, function (err) {
						 });

						var token = sailsTokenAuth.issueToken({sid: user.id});

						return res.json({ status: 1, text: 'password reset successfully' } );

					});


				}


	    });

		}


  },

};
