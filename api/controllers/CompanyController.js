/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	getAll: function(req, res){

			console.log(req.token);

			Company.find().exec(function(err, companies){
				if (err) return res.json(err);

				return res.json(companies);

			});
	},

	get: function(req, res){

		var company_id = req.param('company_id');

		if(!company_id){
			return res.json({status: 2, text: 'company id is missing!' });
		}

		Company.findOne({company_id :  company_id}).exec(function(err, company){

			if(err) return res.json(err);

			return res.json(company);
		});

	},

	add: function(req, res){

		var data = {
			company_name: req.param('company_name'),
			address:  req.param('address'),
			telephone:  req.param('telephone')
		};

		Company.create(data).exec(function(err, createdUser){
			if (err) return res.json(err);

			//import all settings to company
			if(createdUser.company_id){

				 //meter import
				 Meter_type.find().exec(function(err, Meter_types){
					 //console.log(Meter_types);
					 var data = [];
						for(var i=0,l = Meter_types.length; i < l; i++){
							data.push({	company_id: createdUser.company_id, meter_name: Meter_types[i].meter_name});

						}

						Company_meter_link.create(data).exec(function(err, com_meter){
							 if (err) console.log(res.json(err) ) ;
						});
				 });


				 //general condition import
				 General_condition.find().exec(function(err, General_conditions){
					 //console.log(Meter_types);
					 var data = [];
						for(var i=0,l = General_conditions.length; i < l; i++){
							data.push({company_id: createdUser.company_id, item_name: General_conditions[i].item_name, options: General_conditions[i].options, priority: General_conditions[i].priority, type: General_conditions[i].type });

						}

						Company_general_condition_link.create(data).exec(function(err, com_meter){
							 if (err) console.log(res.json(err) ) ;
						});
				 });

				 //master item import
				Master_item.find().then(function(master_items){

					var data_master_items = [];

					for(var i=0, l = master_items.length; i < l; i++){
						data_master_items.push({ original_master_id: master_items[i].master_id, company_id: createdUser.company_id, item_name: master_items[i].item_name, type: master_items[i].type, option: master_items[i].option, priority: master_items[i].priority});
					}

					return Company_masteritem_link.create(data_master_items);

				})
				.catch( function(err){
					// do something when is error
					return res.json(200, { status: 2, error:'update was not successfull'});
				})
				.done(function(){
				    //cleanup
						// sub items import
						var qry = "select sub_item.*, company_masteritem_link.com_master_id as com_master_id from sub_item	inner join  company_masteritem_link on sub_item.master_id = company_masteritem_link.original_master_id where company_masteritem_link.company_id="+ createdUser.company_id + " and company_masteritem_link.original_master_id= sub_item.master_id";
						Sub_item.query(qry, function(err, sub_items){

							var data = [];
							for(var i=0,l = sub_items.length; i < l; i++){
								data.push({com_master_id: sub_items[i].com_master_id, company_id: createdUser.company_id, item_name: sub_items[i].item_name, type: sub_items[i].type, priority: sub_items[i].priority });
							}

							Company_subitem_link.create(data).exec(function(err, com_sub){
								if (err) console.log(res.json(err) ) ;

									return res.json(200, {status: 'successfully updated'});
							});


						});

				});


			}
			else{
				return res.json(200, { status: 2, error:'update was not successfull; company id is missing '});
			}



		});

	},

	update: function(req, res){

		var company_id = req.param('company_id');

		if(!company_id){
			return res.json({status : 2, text: 'company id is missing!' });
		}

		var data = {
			company_name: req.param('company_name'),
			address:  req.param('address'),
			telephone:  req.param('telephone')
		};

		Company.update({company_id: company_id}, data ).exec(function(err, updated){
			if (err) return res.json(err);

			return res.json(200, { status: 1 });

		});

	},

	delete: function(req, res){

		var company_id = req.param('company_id');

		if(!company_id){
			return res.json({status : 2, text: 'company id is missing!' });
		}

		Company.destroy({company_id: company_id}).exec(function(err, deleted){
			if (err) return res.json(err);

			return res.json(200, { status: 1 })

		});

	},

	getTemplate: function(req, res){

		//var Promise = require('bluebird');
		var Promise = require('q');

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						console.log('fuck user', user.company_id);




						Promise.all([
						     Company_masteritem_link.find({ company_id: user.company_id }) ,
						    Company_subitem_link.find({ company_id: user.company_id }),
						    Company_meter_link.find({ company_id: user.company_id }),
								Company_general_condition_link.find({ company_id: user.company_id })
						]).spread(function( master_data, sub_data, meter_data, general_data ){
						    //use the results
								var newJson = {};
								newJson.master = master_data;
								newJson.sub = sub_data;
								newJson.meter = meter_data;
								newJson.general = general_data;
								return res.json({ status: 1, data: newJson });

						}).catch(function(){
						    //handle errors
								console.log(err);
								res.json({ status: 2, error: err });
						}).done(function(){
						    //clean up
						});

					});

					// 	var master_data = Company_masteritem_link.find({ company_id: user.company_id })
          //       .then(function(master_item) {
					//
          //           var new_data = master_item;
          //           delete new_data.createdAt;
          //           delete new_data.updatedAt;
          //           return new_data;
          //   });
					//
					// 	var sub_data = Company_subitem_link.find({ company_id: user.company_id })
          //       .then(function(sub_item) {
          //           var new_data = sub_item;
          //           delete new_data.createdAt;
          //           delete new_data.updatedAt;
          //           return new_data;
          //   });
					//
					// 	var meter_data = Company_meter_link.find({ company_id: user.company_id })
          //       .then(function(meter_item) {
          //           var new_data = meter_item;
          //           delete new_data.createdAt;
          //           delete new_data.updatedAt;
          //           return new_data;
          //   });
					//
					// 	var general_data = Company_general_condition_link.find({ company_id: user.company_id })
          //       .then(function(general_item) {
          //           var new_data = general_item;
          //           delete new_data.createdAt;
          //           delete new_data.updatedAt;
          //           return new_data;
          //   });
					//
					//
					// 	return [master_data, sub_data, meter_data, general_data];
					//
					// })
					// .spread(function(master_data, sub_data, meter_data, general_data) {
					//
		      //       var newJson = {};
		      //       newJson.master = master_data;
		      //       newJson.sub = sub_data;
					// 			newJson.meter = meter_data;
					// 			newJson.general = general_data;
		      //       return res.json({ status: 1, data: newJson });
		      //   })
		      //   .fail(function(err) {
		      //       console.log(err);
		      //       res.json({ status: 2, error: err });
		      //   });



			}
		}


	}






};
