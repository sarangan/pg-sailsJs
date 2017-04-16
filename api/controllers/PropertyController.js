/**
 * PropertyController
 *
 * @description :: Server-side logic for managing properties
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	syncmob: function(req, res){


		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						//console.log('company id receving', user.company_id);

						// return res.json({ status: 1, data:  req.param('data') });

						var synid = req.param('sync');
						var key = req.param('key');
						var table = req.param('table');

						var data =  req.param('data');
						delete data.id;
						delete data.sync;

						//console.log(data);

						if(req.param('table') &&  req.param('task') ){

							 if( req.param('task') == 'INSERT'){

								 //	var dataPropertyInfo = req.param('data');

									switch (req.param('table')) {
										case 'property':

														Property.create(data).exec(function(err, property){
															if (err) return res.json(err);
															if(property.property_id){
																	return res.json({ status: 1, synid: synid, key: key, table: table  });
															}
														});
											break;


										case 'property_info':

													Property_info.create(data).exec(function(err, propertyInfo){
														if (err) return res.json(err);
														if(propertyInfo.property_id){
																return res.json({ status: 1,  synid: synid, key: key, table: table, data: propertyInfo  });
														}
													});
												break;

										case 'property_masteritem_link':

													Property_masteritem_link.create(data).exec(function(err, property_masteritem){
														if (err) return res.json(err);
														if(property_masteritem.property_id){
																return res.json({ status: 1,  synid: synid, key: key, table: table  });
														}
													});
												break;

									case 'property_subitem_link':

												Property_subitem_link.create(data).exec(function(err, property_subitem){
													if (err) return res.json(err);
													if(property_subitem.property_id){
															return res.json({ status: 1,  synid: synid, key: key, table: table  });
													}
												});
											break;


									case 'property_meter_link':

												Property_meter_link.create(data).exec(function(err, property_meter){
													if (err) return res.json(err);
													if(property_meter.property_id){
															return res.json({ status: 1,  synid: synid, key: key, table: table  });
													}
												});
											break;

								case 'property_general_condition_link':

											Property_general_condition_link.create(data).exec(function(err, property_general_condition_link){
												if (err) return res.json(err);
												if(property_general_condition_link.prop_general_id){
														return res.json({ status: 1,  synid: synid, key: key, table: table  });
												}
											});
										break;

								case 'property_feedback':

											Property_feedback.create(data).exec(function(err, property_feedback){
												if (err) return res.json(err);
												if(property_feedback.prop_feedback_id){
														return res.json({ status: 1,  synid: synid, key: key, table: table  });
												}
											});
										break;


								case 'property_sub_feedback_general':

											Property_sub_feedback_general.create(data).exec(function(err, property_sub_feedback_general){
												if (err) return res.json(err);
												if(property_sub_feedback_general.prop_sub_feedback_general_id){
														return res.json({ status: 1,  synid: synid, key: key, table: table  });
												}
											});
										break;


								case 'property_sub_voice_general':

											 Property_sub_voice_general.create(data).exec(function(err, property_sub_voice_general_data){
											 	if (err) return res.json(err);
											 	 if(property_sub_voice_general_data.prop_sub_feedback_general_id){
											 	 		return res.json({ status: 1,  synid: synid, key: key, table: table  });
											 	 }
											 });
										break;

								case 'photos':
											console.log('photos uploading');
											Photos.create(data).exec(function(err, photos){
												if (err) return res.json(err);
												if(photos.photo_id){
														return res.json({ status: 1,  synid: synid , key: key, table: table, data: data  });
												}
											});
										break;


										default:
											return res.json({ status: 2, err: 'no table found' });
									}





							 }

						 }




				});

			}
		}

	},

	uploadphoto: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						//console.log( req.param('data') );
						console.log('Uploading photos');

						// return res.json({ status: 1, data:  req.param('data') });
						var d = new Date();
						var current_year = d.getFullYear();
						var uploadToDir = '../public/resources_' + current_year;

						var fs = require('fs');
						
						// if (!fs.existsSync(uploadToDir)){
						//     fs.mkdirSync(uploadToDir);
						// }
						var path = require('path');

						req.file('photo').upload(
							{
								 dirname: '../public/images',//'./assets/images',
								  maxBytes: 10000000
							},
							function (err, files) {

						      	if (err){
									console.log(err);
									return res.json(err);
								}

							
							 var data = JSON.parse(req.param('data') );
							 delete data.id;
							 delete data.sync;

							 data['img_url'] = files[0].fd;
							 data['file_name'] = path.basename(files[0].fd);//files[0].filename;

							 //console.log(files[0]);
							 console.log(files[0].fd);
							 console.log(files[0].filename);

							  //var ImagesDirArr = __dirname.split('/'); // path to this controller
						      //ImagesDirArr.pop();
						      //ImagesDirArr.pop();

						      //var path = ImagesDirArr.join('/'); // path to root of the project
						      var _src = files[0].fd             // path of the uploaded file  

						      var ImagesDirArr = __dirname.split('/'); // path to this controller
						        ImagesDirArr.pop();
						        ImagesDirArr.pop();

						        // the destination path
						      var _dest = ImagesDirArr.join('/')  +'/assets/images/'+ path.basename(files[0].fd); //files[0].filename 

						        // not preferred but fastest way of copying file
						      fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));


							Photos.create(data).exec(function(err, photos){
								if (err) return res.json(err);
								 if(photos.photo_id){
									return res.json({
										message: files.length + ' file(s) uploaded successfully!',
										files: files,
										data: data
									});

								 }
							});

				  		});


				  		//new method

				  		/*var uploadToDir = '../public/images'; 
						req.file('photo').upload({
						    saveAs:function(file, cb) {
						        cb(null,uploadToDir+'/'+file.filename);
						    }
						},function whenDone(err,files){
						    if (err) return res.serverError(err);
						    if( files.length > 0 ){

						        var ImagesDirArr = __dirname.split('/'); // path to this controller
						        ImagesDirArr.pop();
						        ImagesDirArr.pop();

						        var path = ImagesDirArr.join('/'); // path to root of the project
						        var _src = files[0].fd             // path of the uploaded file  

						        // the destination path
						        var _dest = path+'/assets/images/'+files[0].filename 

						        // not preferred but fastest way of copying file
						        fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));
						        //return res.json({msg:"File saved", data: files});

						        console.log('file uploaded!');

						         var data = JSON.parse(req.param('data') );
								 delete data.id;
								 delete data.sync;

								 data['img_url'] = files[0].fd;
								 data['file_name'] = files[0].filename;

								Photos.create(data).exec(function(err, photos){
									if (err) return res.json(err);

									console.log('photo saved');

									 if(photos.photo_id){
										return res.json({
											message: files.length + ' file(s) uploaded successfully!',
											files: files,
											data: data
										});

									 }
								});




						    }
						});*/



				});

			}

		}

	},

	uploadvoice: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						console.log('Uploading voices shit');


						// return res.json({ status: 1, data:  req.param('data') });

						req.file('voice').upload(
							{
								 dirname: './assets/images',
								  maxBytes: 10000000
							},
							function (err, files) {


								if (err){

									console.log( 'this is uploading error');

									console.log(err);
									return res.json(err);
								}

							 	var data = JSON.parse(req.param('data') );
							 	delete data.id;
							 	delete data.sync;

							 data['voice_url'] = files[0].fd;

							 console.log( data );
							 console.log('Uploading voices');



							 Property_sub_voice_general.create(data).exec(function(err, property_sub_voice_general_data){
								if (err) return res.json(err);
								 if(property_sub_voice_general_data.prop_sub_feedback_general_id){

										 return res.json({
											'message': files.length + ' file(s) uploaded successfully!',
											'files': files,
											'data': data
										});

								 }
							 });



						//console.log(files);




					});



				});

			}

		}

	},

	uploadpropertyimg: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						console.log('Uploading property photos');

						// return res.json({ status: 1, data:  req.param('data') });

						req.file('photo').upload(
							{
								 dirname: './assets/images',
								  maxBytes: 10000000
							},
							function (err, files) {

							if (err){
								console.log(err);
								return res.json(err);
							}

							 var data = JSON.parse(req.param('data') );
							 var property_id = data.property_id;

							 var dataPropertyInfo = {
								 image_url: files[0].fd
							 };

							 Property_info.update({property_id: property_id }, dataPropertyInfo ).exec(function afterwards(err, updated){
										if (err) return res.json(err);
										//return res.json(200, { status: 1, property_id: updated.property_id});

										return res.json({
											message: files.length + ' file(s) uploaded successfully!',
											files: files,
											data: updated
										});

								});

					});

				});

			}

		}

	},


/*
	uploadsignature: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						console.log('Uploading property photos');

						// return res.json({ status: 1, data:  req.param('data') });

						req.file('photo').upload(
							{
								 dirname: './assets/images'
							},
							function (err, files) {

							if (err){
								console.log(err);
								return res.json(err);
							}

							 var data = JSON.parse(req.param('data') );
							 var property_id = data.property_id;

							 var dataPropertyInfo = {
								 sign_url: files[0].fd
							 };

							 Property_info.update({property_id: property_id }, dataPropertyInfo ).exec(function afterwards(err, updated){
										if (err) return res.json(err);
										//return res.json(200, { status: 1, property_id: updated.property_id});

										return res.json({
											message: files.length + ' file(s) uploaded successfully!',
											files: files,
											data: updated
										});

								});

					});

				});

			}

		}

	},
*/

		//get inspections list
		inspections: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

							console.log('user', user.company_id);

							Property_info.query("select property_info.*, DATE_FORMAT(property_info.createdAt,'%d/%m/%Y') as created_date from property_info inner join property on property_info.property_id = property.property_id where property.company_id="+ user.company_id, function(err, properties){
								return res.json(properties);
							});

					});

				}
			}


		},

		getProperty: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									//good to go from here
									Property_info.query("select property_info.*, DATE_FORMAT(property_info.createdAt,'%d/%m/%Y') as created_date, property.description from property_info inner join property on property_info.property_id = property.property_id where property.property_id='"+ property_id + "'", function(err, property){
										return res.json({status: 1, property: property[0]});
									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}

		},

		getConditions: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									//good to go from here
									Property_general_condition_link.query("select property_general_condition_link.*, company_general_condition_link.item_name, company_general_condition_link.options, company_general_condition_link.type from property_general_condition_link inner join company_general_condition_link on property_general_condition_link.com_general_id = company_general_condition_link.com_general_id where property_general_condition_link.status=1 and property_general_condition_link.property_id="+ property_id + " order by property_general_condition_link.priority", function(err, general){
										return res.json({status: 1, conditions: general});
									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}

		},

		add: function(req, res){

			//console.log(req.token);

			var data = {
				description:  req.param('description'),
				mb_createdAt: new Date()
			};
			const uuidV4 = require('uuid/v4');
			var property_id = uuidV4();

			sails.log(property_id);

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						data['property_id'] = property_id;
						data['company_id'] = user.company_id;
						data['description'] = req.param('description');


						var dataPropertyInfo = {
								address_1: req.param('address_1'),
								address_2: req.param('address_2'),
								city: req.param('city'),
								postalcode: req.param('postalcode'),
								report_type: req.param('report_type'),
								report_date: req.param('report_date'),
								image_url: req.param('image_url')
						};

						Property.create(data).exec(function(err, propertyInfo){
							if (err) return res.json(err);

							if(propertyInfo.property_id){

								dataPropertyInfo['property_id'] = propertyInfo.property_id;

								// Sync.create({
								// 	syn_id: uuidV4(),
								// 	property_id: propertyInfo.property_id,
								// 	table_name: 'property',
								// 	key_id: propertyInfo.property_id,
								// 	task: 'INSERT',
								// 	pk_name: 'property_id',
								// 	status: 1
								// }).exec(function(err, syc_details){
			 				// 		if (err) console.log(res.json(err) );
			 				// 	});

								Property_info.create(dataPropertyInfo).exec(function(err, dataProperty){
									if(err) return res.json(err);
									//return res.json(200, { status: 1, property_id: propertyInfo.property_id});

									// Sync.create({
									// 	syn_id: uuidV4(),
									// 	property_id: propertyInfo.property_id,
									// 	table_name: 'property_info',
									// 	key_id: propertyInfo.property_id,
									// 	task: 'INSERT',
									// 	pk_name: 'property_id',
									// 	status: 1
									// }).exec(function(err, syc_details){
			 					// 		 if (err) console.log(res.json(err) ) ;
			 					// 	});

								});

							//signature import
							var dataSignature = {
									sign_id: uuidV4(),
									property_id: propertyInfo.property_id,
									comment: '',
									tenant_url: '',
									lanlord_url: '',
									clerk_url: ''
							};

	 						Signatures.create(dataSignature).exec(function(err, signature){
	 							 if (err) console.log(res.json(err) ) ;

	 						// 	 Sync.create({
								// 	syn_id: uuidV4(),
								// 	property_id: propertyInfo.property_id,
								// 	table_name: 'signatures',
								// 	key_id: signature.sign_id,
								// 	task: 'INSERT',
								// 	pk_name: 'sign_id',
								// 	status: 1
								// }).exec(function(err, syc_details){
		 					// 		 if (err) console.log(res.json(err) ) ;
		 					// 	});

	 						});



							//meter import
			 				 Company_meter_link.find({status: 1}).exec(function(err, Meter_types){
			 					 var data = [];
			 						for(var i=0,l = Meter_types.length; i < l; i++){
			 							data.push({
			 								prop_meter_id: uuidV4(),
			 								property_id: propertyInfo.property_id,
			 								com_meter_id: Meter_types[i].com_meter_id,
			 								meter_name: Meter_types[i].meter_name,
			 								reading_value: '',
			 								status: 1,
			 							});
			 						}

			 						Property_meter_link.create(data).exec(function(err, prop_meter){
			 							 if (err) console.log(res.json(err) ) ;

			 						// 	 Sync.create({
										// 	syn_id: uuidV4(),
										// 	property_id: propertyInfo.property_id,
										// 	table_name: 'property_meter_link',
										// 	key_id: prop_meter.prop_meter_id,
										// 	task: 'INSERT',
										// 	pk_name: 'prop_meter_id',
										// 	status: 1
										// }).exec(function(err, syc_details){
				 					// 		 if (err) console.log(res.json(err) ) ;
				 					// 	});

			 						});
			 				 });


							 	//general condition import
								Company_general_condition_link.find({status: 1}).exec(function(err, General_conditions){
									var data = [];
									 for(var i=0,l = General_conditions.length; i < l; i++){
										 data.push({
										 	prop_general_id: uuidV4(),
										 	property_id: propertyInfo.property_id,
										 	com_general_id: General_conditions[i].com_general_id,
										 	item_name: General_conditions[i].item_name,
										 	options: General_conditions[i].options,
										 	type: General_conditions[i].type,
										 	priority: General_conditions[i].priority,
										 	user_input: '',
										 	comment: '',
										 	status: 1
										 	 });
									 }

									 Property_general_condition_link.create(data).exec(function(err, prop_general_condition){
											if (err) console.log(res.json(err) ) ;

										// Sync.create({
										// 	syn_id: uuidV4(),
										// 	property_id: propertyInfo.property_id,
										// 	table_name: 'property_general_condition_link',
										// 	key_id: prop_general_condition.prop_general_id,
										// 	task: 'INSERT',
										// 	pk_name: 'prop_general_id',
										// 	status: 1
										// }).exec(function(err, syc_details){
				 					// 		 if (err) console.log(res.json(err) ) ;
				 					// 	});

									 });
								});


								//master items inport
							 Company_masteritem_link.find({status: 1}).then(function(master_items){

								 var data_master_items = [];
								 for(var i=0, l = master_items.length; i < l; i++){

								 	var prop_master_id = uuidV4();

									 data_master_items.push({
									 	prop_master_id: prop_master_id,
									 	property_id: propertyInfo.property_id,
									 	com_master_id: master_items[i].com_master_id,
									 	type: 'DEFAULT',
									 	com_type: master_items[i].type,
									 	option: master_items[i].option,
									 	self_prop_master_id: '0',
									 	name: master_items[i].item_name,
									 	priority: master_items[i].priority,
									 	total_num: 0,
									 	status: 1
									 });

									//  Sync.create({
									// 	syn_id: uuidV4(),
									// 	property_id: propertyInfo.property_id,
									// 	table_name: 'property_masteritem_link',
									// 	key_id: prop_master_id,
									// 	task: 'INSERT',
									// 	pk_name: 'prop_master_id',
									// 	status: 1
									// }).exec(function(err, syc_details){
			 					// 		 if (err) console.log(res.json(err) ) ;
			 					// 	});


								 }
								 return Property_masteritem_link.create(data_master_items);

							 })
							 .catch( function(err){
			 					// do something when is error
			 					return res.json(200, { status: 2, error:'update was not successfull'});
			 				})
							.done(function(){


								Company_subitem_link.find({status: 1 }).exec(function(err, sub_items ){
									var data_sub_items = [];
									for(var i=0,l = sub_items.length; i < l; i++){
										data_sub_items.push({
											prop_subitem_id: uuidV4(),
											property_id: propertyInfo.property_id,
											com_subitem_id: sub_items[i].com_subitem_id,
											item_name: sub_items[i].item_name,
											type: sub_items[i].type,
											priority: sub_items[i].priority,
											status: 1
										});
									}

									Property_subitem_link.create(data_sub_items).exec(function(err, prop_subs){
										 if (err) console.log(res.json(err) );

										// Sync.create({
										// 	syn_id: uuidV4(),
										// 	property_id: propertyInfo.property_id,
										// 	table_name: 'property_subitem_link',
										// 	key_id: prop_subs.prop_subitem_id,
										// 	task: 'INSERT',
										// 	pk_name: 'prop_subitem_id',
										// 	status: 1
										// }).exec(function(err, syc_details){
				 					// 		 if (err) console.log(res.json(err) ) ;
				 					// 	});

										 return res.json(200, { status: 1, property_id: propertyInfo.property_id});
										 //return res.json(200, {status: 'successfully updated'});
									});

								});


							});

						}
						else{
							return res.json(200, { status: 2, error:'update was not successfull; property id is missing '});
						}

					});


				});

			}
		}

		},
		edit: function(req, res){

			var dataPropertyInfo = {
					address_1: req.param('address_1'),
					address_2: req.param('address_2'),
					city: req.param('city'),
					postalcode: req.param('postalcode'),
					report_type: req.param('report_type'),
					report_date: req.param('report_date'),
					image_url: req.param('image_url')
			};

			var data = {
				description:  req.param('description')
			};


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									Property_info.update({property_id: req.param('property_id')}, dataPropertyInfo ).exec(function afterwards(err, updated){
											if (err) return res.json(err);
											//return res.json(200, { status: 1, property_id: updated.property_id});
									});

									Property.update({property_id: req.param('property_id')}, data ).exec(function afterwards(err, updated){
											if (err) return res.json(err);
											return res.json(200, { status: 1, property_id: updated.property_id});
									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}




		},

		uploadlogo: function(req, res){

			console.log(sails.config.appPath, '/assets/images/props_logo');

			// req.file('fileName').upload({
			//   dirname: require('path').resolve(sails.config.appPath, '/assets/images/props_logo')
			// },function (err, uploadedFiles) {
			//   if (err) return res.negotiate(err);
			//
			//   return res.json({
			//     message: uploadedFiles.length + ' file(s) uploaded successfully!'
			//   });
			// });

			uploadFile.upload({ dirname: '../../assets/images'},function onUploadComplete (err, files) {
    // Earlier it was ./assets/images .. Changed to ../../assets/images
    //	Files will be uploaded to ./assets/images
    // Access it via localhost:1337/images/file-name


	    	if (err) return res.serverError(err);
	    	//	IF ERROR Return and send 500 error

	    	console.log(files);
	    	res.json({status:200,file:files});
	    });

		},

		//this is to get property template
		getTemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									//good to go from here
									//var qry = "select property_masteritem_link.*, company_masteritem_link.item_name, company_masteritem_link.type, company_masteritem_link.option from property_masteritem_link inner join company_masteritem_link on property_masteritem_link.com_master_id = company_masteritem_link.com_master_id where property_masteritem_link.type='DEFAULT' and property_masteritem_link.property_id =" + property_id + " order by property_masteritem_link.com_master_id, company_masteritem_link.option ";
									var qry = "select property_masteritem_link.* from property_masteritem_link where property_masteritem_link.type='DEFAULT' and property_masteritem_link.status=1 and property_masteritem_link.property_id ='" + property_id + "' order by property_masteritem_link.priority, property_masteritem_link.option ";
									Property_masteritem_link.query(qry, function(err, prop_tempalte){

										return res.json({status: 1, template: prop_tempalte});

									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		saveTemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){


									var nums = req.param('nums');
									var options = req.param('options');

									//console.log(nums);
									//	var update_data = {total_num: 3 };



									 if(nums){

									 	for(var i=0, l = nums.length; i < l ; i++){
									 		var update_data = {total_num: nums[i].total_num };

											//sails.log.debug( nums[i].prop_master_id,  nums[i].total_num);

											Property_masteritem_link.update( {prop_master_id: nums[i].prop_master_id, com_master_id: nums[i].com_master_id } , update_data).exec(function(err, com_sub){
												if (err) console.log(err);


												// Sync.create({
												// 	syn_id: uuidV4(),
												// 	property_id: propertyInfo.property_id,
												// 	table_name: 'property_subitem_link',
												// 	key_id: prop_subs.prop_subitem_id,
												// 	task: 'INSERT',
												// 	pk_name: 'prop_subitem_id',
												// 	status: 1
												// }).exec(function(err, syc_details){
						 						// 		 if (err) console.log(res.json(err) ) ;
						 						// 	});


												Company_masteritem_link.findOne({com_master_id: com_sub[0].com_master_id } ).exec(function(err, com_master_item){


													var total_num = com_sub[0].total_num;

													if(total_num > 0){
														const uuidV4 = require('uuid/v4');

														for(var j=1; j <= total_num; j++){

															var num_data = {
																prop_master_id: uuidV4(),
																property_id: property_id,
																com_master_id: com_sub[0].com_master_id,
																type: 'SELF',
																com_type: com_sub[0].com_type,
																option: com_sub[0].option,
																self_prop_master_id: com_sub[0].prop_master_id,
																name: com_master_item.item_name + ' ' + (j).toString(),
																priority: 1,
																total_num: 0,
																status: 1
															};

															Property_masteritem_link.create(num_data).exec(function(err, prop_master_num){
																if (err) console.log(err);

																// Sync.create({
																// 	syn_id: uuidV4(),
																// 	property_id: propertyInfo.property_id,
																// 	table_name: 'property_subitem_link',
																// 	key_id: prop_subs.prop_subitem_id,
																// 	task: 'INSERT',
																// 	pk_name: 'prop_subitem_id',
																// 	status: 1
																// }).exec(function(err, syc_details){
										 						// 		 if (err) console.log(res.json(err) ) ;
										 						// 	});

															});


														}
													}


												});


											});

									 	}

									}

									 if(options){

										for(var i=0, l = options.length; i < l; i++){

											var update_data = {status: options[i].status };

											Property_masteritem_link.update( {prop_master_id: options[i].prop_master_id }, update_data).exec(function(err, com_sub){
												if (err) console.log(err);

												//	console.log(com_sub);
											});

										}

									}

									return res.json(200, {status: 1, text: 'successfully updated'});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}



		},

		//this is to get property template
		getRoomlist: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									//good to go from here
									//var qry = "select property_masteritem_link.*, company_masteritem_link.item_name, company_masteritem_link.type as template_type, company_masteritem_link.option from property_masteritem_link left join company_masteritem_link on property_masteritem_link.com_master_id = company_masteritem_link.com_master_id where !(company_masteritem_link.option ='NUM' and property_masteritem_link.type ='DEFAULT') and property_masteritem_link.property_id ="+ property_id +" order by property_masteritem_link.priority, property_masteritem_link.prop_master_id, company_masteritem_link.option";

									var qry = "select property_masteritem_link.*,  property_masteritem_link.com_type as template_type, (select count(photos.photo_id) from photos where photos.parent_id = property_masteritem_link.prop_master_id or photos.item_id = property_masteritem_link.prop_master_id ) as image_count from property_masteritem_link where NOT(property_masteritem_link.option ='NUM' and property_masteritem_link.type ='DEFAULT') and property_masteritem_link.property_id ='"+ property_id +"' and property_masteritem_link.status = 1 order by property_masteritem_link.priority";
									Property_masteritem_link.query(qry, function(err, prop_room){
										//console.log(prop_room);
										return res.json({status: 1, roomlist: prop_room, property_id: property_id });

									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		//this is to get property template
		getgeneralconditionlist: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){


									var qry = "select property_general_condition_link.* from property_general_condition_link where property_general_condition_link.status=1 and property_general_condition_link.property_id='"+ property_id +"' order by property_general_condition_link.priority";
									Property_general_condition_link.query(qry, function(err, prop_gen){
										//console.log(prop_room);
										return res.json({status: 1, gen_list: prop_gen, property_id: property_id });

									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		//this is to get property template
		updategeneralcondition: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									var gen_list =  req.param('gen_list');
									for(var i = 0, l = gen_list.length; i < l ; i++ ){

										var general_id = gen_list[i]['prop_general_id'];
										var data = {
											'comment' : gen_list[i]['comment'],
											'user_input' :  gen_list[i]['user_input']
										}

										Property_general_condition_link.update({prop_general_id: general_id }, data ).exec(function afterwards(err, updated){
												if (err) return res.json(err);
										});

									}

									return res.json(200, { status: 1, text: 'successfully updated' });


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		addConditionComment: function(req, res){

				if( req.token.hasOwnProperty('sid') ){
					if(req.token.sid){

						var condition_id = req.param('condition_id');

						if(!condition_id){
							return res.json({status: 2, text: 'id is missing!' });
						}
						else{
							var data = {
								comment:  req.param('comment')
							};

							Property_general_condition_link.update({prop_general_id: condition_id }, data ).exec(function afterwards(err, updated){
									if (err) return res.json(err);
									return res.json(200, { status: 1, text: 'successfully updated' });
							});

						}

					}
				}

		},

		getConditionComment: function(req, res){

				if( req.token.hasOwnProperty('sid') ){
					if(req.token.sid){

						var condition_id = req.param('condition_id');

						if(!condition_id){
							return res.json({status: 2, text: 'id is missing!' });
						}
						else{

							Property_general_condition_link.findOne({prop_general_id: condition_id }).exec(function afterwards(err, general_condition){
									if (err) return res.json(err);
									return res.json(200, { status: 1, general_condition: general_condition });
							});

						}

					}
				}

		},

		getMeterList: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									
										var qry = "SELECT property_meter_link.prop_meter_id, property_meter_link.property_id, property_meter_link.com_meter_id, property_meter_link.meter_name, property_meter_link.reading_value, property_feedback.prop_feedback_id, property_feedback.comment, property_feedback.description FROM property_meter_link LEFT JOIN property_feedback ON property_meter_link.prop_meter_id = property_feedback.item_id where property_meter_link.status = 1 and property_meter_link.property_id='" + property_id +"'" ;
										
										Property_meter_link.query(qry, function(err, meter_items){

											return res.json({status: 1, meter_items: meter_items});

										});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

				//this is to get meter items
		updatemeterlist: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){


									var meter_list =  req.param('data');
									for(var i = 0, l = meter_list.length; i < l ; i++ ){

										//sails.log(meter_list[i]);

										var data_feedback =  meter_list[i];
										var prop_feedback_id ='';

										if(data_feedback.hasOwnProperty('prop_feedback_id') ){
											prop_feedback_id = data_feedback['prop_feedback_id'];
											delete data_feedback['prop_feedback_id'];
										}

										var insert_data = {
											'option' : '',
											'comment' : data_feedback['comment'],
											'description' : data_feedback['description']										
										};

										if(prop_feedback_id){

											Property_feedback.update({prop_feedback_id: prop_feedback_id }, insert_data ).exec(function afterwards(err, updated){
												if (err) return res.json(err);
												//return res.json(200, { status: 1, text: 'successfully updated' });						
											});

											Property_meter_link.update({ prop_meter_id: data_feedback['prop_meter_id'] }, {reading_value: data_feedback['reading_value']} ).exec(function afterwards(err, updated){
												if (err) return res.json(err);
												//return res.json(200, { status: 1, text: 'successfully updated' });
											});


										}
										else{

											const uuidV4 = require('uuid/v4');
											prop_feedback_id = uuidV4();
											
											var insert_data = {
												'prop_feedback_id' : prop_feedback_id,
												'property_id' : property_id,
												'item_id' : data_feedback['prop_meter_id'],
												'option' : '',
												'comment' : (data_feedback['comment']? data_feedback['comment'] : ''),
												'description' : (data_feedback['description']? data_feedback['description'] : ''),
												'parent_id' : data_feedback['prop_meter_id'],
												'type' : 'METER'									
											};

											//sails.log(insert_data);

											Property_feedback.create( insert_data ).exec(function afterwards(err, updated){
												if (err){
													sails.log(err);
													return res.json(err);
												} 
													
												//return res.json(200, { status: 1, text: 'successfully inserted' });
											});

											Property_meter_link.update({ prop_meter_id: data_feedback['prop_meter_id'] }, {reading_value: (data_feedback['reading_value']? data_feedback['reading_value']: '') } ).exec(function afterwards(err, updated){
												if (err){
													sails.log(err);
													return res.json(err);
												}
												//return res.json(200, { status: 1, text: 'successfully updated' });
											});


										}

									}

									return res.json(200, { status: 1, text: 'successfully updated' });


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		getSingleItem: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									if(req.param('prop_master_id') ){
										//good to go from here
										var qry = "select property_feedback.* from property_feedback where property_feedback.item_id='" + req.param('prop_master_id') + "' and property_feedback.type='" + req.param('type') + "'";
										Property_feedback.query(qry, function(err, single_item){

											return res.json({status: 1, single_item: single_item});

										});
									}
									else{
										return res.json({status: 2, text: 'id is missing!' });
									}


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}

		},

		//this is to update single item
		updateSingleItem: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									var data_feedback =  req.param('data');
									var prop_feedback_id ='';
									if(data_feedback.hasOwnProperty('prop_feedback_id') ){

										prop_feedback_id = data_feedback['prop_feedback_id'];

										delete data_feedback['prop_feedback_id'];
									}

									if(prop_feedback_id){

										sails.log('updatre');

										Property_feedback.update({prop_feedback_id: prop_feedback_id }, data_feedback ).exec(function afterwards(err, updated){
												if (err) return res.json(err);

												return res.json(200, { status: 1, text: 'successfully updated' });

										});


									}
									else{

										sails.log('insert');

										const uuidV4 = require('uuid/v4');
										prop_feedback_id = uuidV4();
										data_feedback['prop_feedback_id'] = prop_feedback_id;
										data_feedback['property_id'] = property_id;

										Property_feedback.create( data_feedback ).exec(function afterwards(err, updated){
												if (err) return res.json(err);

												return res.json(200, { status: 1, text: 'successfully inserted' });

										});


									}


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		getSubItemsList: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');
					var prop_master_id = req.param('prop_master_id');

					if(!property_id || !prop_master_id){
						return res.json({status: 2, text: 'id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									//good to go from here

									var qry = "select property_subitem_link.*, property_masteritem_link.prop_master_id, property_masteritem_link.name as master_item_name,company_subitem_link.com_master_id, property_feedback.prop_feedback_id, property_feedback.comment, property_feedback.description, property_feedback.option from property_subitem_link INNER JOIN company_subitem_link on property_subitem_link.com_subitem_id = company_subitem_link.com_subitem_id INNER JOIN property_masteritem_link ON company_subitem_link.com_master_id = property_masteritem_link.com_master_id LEFT JOIN property_feedback on property_subitem_link.prop_subitem_id = property_feedback.item_id where property_subitem_link.status =1 and property_masteritem_link.prop_master_id ='" + prop_master_id +"' and property_subitem_link.property_id='" + property_id +"' order by property_subitem_link.priority";
									
									Property_subitem_link.query(qry, function(err, sub_items){

										//return res.json({status: 1, sub_items: sub_items});
										var gen_sub_item_id = '';
										for(var i =0, l = sub_items.length; i < l ; i++){
											if(sub_items[i].type == 'GENERAL'){
												gen_sub_item_id = sub_items[i].prop_subitem_id;
											}
										}

										if(gen_sub_item_id){

																						
										    Property_sub_feedback_general.findOne({item_id: gen_sub_item_id }).exec(function afterwards(err, comments){
										    	return res.json({status: 1, sub_items: sub_items, gen_comment:comments });
										    });
									    
										}
										else{
											
											return res.json({status: 1, sub_items: sub_items, gen_comment:'' });
										}


									});

									// var Promise = require('bluebird');

									// var subitemQueryAsync =  Promise.promisifyAll(Property_subitem_link);

									// //subitemQueryAsync.query(qry)
									// subitemQueryAsync.queryAsync(qry)
									// 	.then( function(sub_items){

									// 		sails.log('initial list of sub items  ' +  sub_items.length );
											
									// 		var gen_sub_item_id = '';
									// 		for(var i =0, l = sub_items.length; i < l ; i++){
									// 			if(sub_items[i].type == 'GENERAL'){
									// 				gen_sub_item_id = sub_items[i].prop_subitem_id;
									// 			}
									// 		}

									// 		var comments = null;

									// 		if(gen_sub_item_id){

									// 			comments = Property_sub_feedback_general.find({ item_id: gen_sub_item_id }).then(function(comments){
									// 		        return comments;
									// 		    });
											    
									// 		}

									// 		return [ sub_items, comments];

									// 	}).spread(function( sub_items, comments){

									// 		sails.log('last promise');
									// 		return res.json({status: 1, sub_items: sub_items, gen_comment:comments });

									// 	}).fail( function(err){
									// 		sails.log(err);
								 //            // do something when is error
								 //            if(err) return res.json(err);
								 //        });



										/*Property_subitem_link
										 .query(qry)
										 .then(function(sub_items){
										 //act on result

										 	var gen_sub_item_id = '';
											for(var i =0, l = sub_items.length; i < l ; i++){
												if(sub_items[i].type == 'GENERAL'){
													gen_sub_item_id = sub_items[i].prop_subitem_id;
												}
											}

											if(gen_sub_item_id){

												Property_sub_feedback_general.find({ item_id: gen_sub_item_id }).then(function(comments){

													return res.json({status: 1, sub_items: sub_items, gen_comment:comments });

												});

											}
											else{
												return res.json({status: 1, sub_items: sub_items, gen_comment:'' });
											}




										 })
										 .catch(function(error){
										 //handle error
										 })
										 .done(function(){
										 //clean up
										 });

*/

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		//this is to update sub items
		updatesubitems: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									const uuidV4 = require('uuid/v4');

									var sub_list =  req.param('sub_list');
									for(var i = 0, l = sub_list.length; i < l ; i++ ){

										//sails.log(meter_list[i]);

										var data_feedback =  sub_list[i];
										var prop_feedback_id ='';

										if(data_feedback.hasOwnProperty('prop_feedback_id') ){
											prop_feedback_id = data_feedback['prop_feedback_id'];
											delete data_feedback['prop_feedback_id'];
										}

										var update_data = {
											'option' : data_feedback['option'],
											'comment' : data_feedback['comment'],
											'description' : data_feedback['description']										
										};

										if(prop_feedback_id){

											Property_feedback.update({prop_feedback_id: prop_feedback_id }, update_data ).exec(function afterwards(err, updated){
												if (err) return res.json(err);
												//return res.json(200, { status: 1, text: 'successfully updated' });						
											});

										}
										else{

											
											prop_feedback_id = uuidV4();
											
											var insert_data = {
												'prop_feedback_id' : prop_feedback_id,
												'property_id' : property_id,
												'item_id' : data_feedback['prop_subitem_id'],
												'option' : (data_feedback['option']? data_feedback['option'] : ''),
												'comment' : (data_feedback['comment']? data_feedback['comment'] : ''),
												'description' : (data_feedback['description']? data_feedback['description'] : ''),
												'parent_id' : data_feedback['prop_master_id'],
												'type' : 'SUB'									
											};

											//sails.log(insert_data);

											Property_feedback.create( insert_data ).exec(function afterwards(err, updated){
												if (err){
													sails.log(err);
													return res.json(err);
												} 
													
												//return res.json(200, { status: 1, text: 'successfully inserted' });
											});

											
										}


										if(data_feedback['type'] == 'GENERAL'){

											// START insert and update general comment 
											var data_general_comment =  req.param('gen_comment');

											if(data_general_comment){

												if(data_general_comment.hasOwnProperty('prop_sub_feedback_general_id') ){

													var gen_data = {
														comment: data_general_comment['comment']
													}

													Property_sub_feedback_general.update({ prop_sub_feedback_general_id: data_general_comment['prop_sub_feedback_general_id'] }, gen_data ).exec(function afterwards(err, updated){
														if (err) return res.json(err);
														//return res.json(200, { status: 1, text: 'successfully updated' });
													});

												}
												else{

													//const uuidV4 = require('uuid/v4');
													var prop_sub_feedback_general_id = uuidV4();

													var gen_data = {

														comment: data_general_comment['comment'],
														prop_sub_feedback_general_id: prop_sub_feedback_general_id,
														property_id: property_id,
														item_id: data_feedback['prop_subitem_id'],
														parent_id: req.param('prop_master_id')
													}

													Property_sub_feedback_general.update(gen_data).exec(function afterwards(err, updated){
														if (err) return res.json(err);
														//return res.json(200, { status: 1, text: 'successfully updated' });
													});

												}
											

											}

											
											// END insert and update general comment

										}
										

									}

																		
									return res.json(200, { status: 1, text: 'successfully updated' });


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}


		},

		getSignaturesList: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									//good to go from here
									var qry = "select signatures.* from signatures where signatures.property_id='"+ property_id + "'";
									Signatures.query(qry, function(err, sign_list){

										return res.json({status: 1, signatures: sign_list});

									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}


				}
			}

		},

		//this is to get company template
		getcompanytemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){
					
					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id){

							
							var qry = "select company_masteritem_link.* from company_masteritem_link where company_masteritem_link.company_id ="+ user.company_id +" order by company_masteritem_link.priority";
							Company_masteritem_link.query(qry, function(err, template_list){
								//console.log(prop_room);
								return res.json({status: 1, template: template_list });

							});

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

						


					});

				}


			}


		},

		//this is to update company template
		updatecompanytemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){
					
					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);
						

						//check if the user is authorize to access this property
						if(user.company_id){

							
							var master_item =  req.param('master_item');
							
							for(var i = 0, l = master_item.length; i < l ; i++ ){

								var master_id = master_item[i]['com_master_id'];
								var data = {
									'item_name' : master_item[i]['item_name'],
									'status' :  master_item[i]['status']
								}

								Company_masteritem_link.update({com_master_id: master_id }, data ).exec(function afterwards(err, updated){
										if (err) sails.log( err );
								});

							}

							return res.json(200, { status: 1, text: 'successfully updated' });
						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

						


					});

				}


			}


		},

		//this is to insert company template
		insertcompanytemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var master_item =  req.param('master_item');

							master_item['company_id'] = user.company_id;
							master_item['status'] = 1;
							master_item['original_master_id'] = 0;
							master_item['priority'] = 1;

							if(master_item['type'] == 'ITEM'){
								master_item['option'] = 'OPT';
							}
							else if(master_item['type'] == 'SUB'){
								master_item['option'] = 'NUM';
							}

							Company_masteritem_link.create(master_item).exec(function afterwards(err, updated){
								if (err) return res.json(err);

								return res.json(200, { status: 1, text: 'successfully updated' });
							});							


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

					});

				}
			}

		},

		//this is to delete master item template
		deletecompanytemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var com_master_id =  req.param('master_id');

							
							if(com_master_id){

								var qry = "delete from company_masteritem_link where company_masteritem_link.company_id ="+ user.company_id +" and company_masteritem_link.com_master_id=" + com_master_id;
								Company_masteritem_link.query(qry, function(err, template_list){
									//console.log(prop_room);
									return res.json(200, { status: 1, text: 'successfully deleted' });

								});

								
							}
							else{

								return res.json({status: 2, text: 'you cannot delete this item!' });
							}
														
														


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

						
					});

				}
			}


		},


		// to get company general condition template		
		getgeneralconditiontemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id){


							var qry = "select company_general_condition_link.* from company_general_condition_link where company_general_condition_link.status = 1 and company_general_condition_link.company_id="+ user.company_id +" order by company_general_condition_link.priority";
							Company_general_condition_link.query(qry, function(err, com_gen){
								//console.log(prop_room);
								return res.json({status: 1, gen_list: com_gen });

							});

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}


					});



				}
			}


		},

		
		//this is to get property template
		updategeneralconditiontemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var gen_list =  req.param('gen_list');
							for(var i = 0, l = gen_list.length; i < l ; i++ ){

								var general_id = gen_list[i]['com_general_id'];
								var data = {
									'item_name' : gen_list[i]['item_name'],
									'options' :  gen_list[i]['options']
								}

								Company_general_condition_link.update({com_general_id: general_id }, data ).exec(function afterwards(err, updated){
										if (err) return res.json(err);
								});

							}

							return res.json(200, { status: 1, text: 'successfully updated' });


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

						
					});

				}
			}


		},

		//this is to get property template
		insertgeneralconditiontemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var gen_item =  req.param('gen_item');

							gen_item['company_id'] = user.company_id;
							gen_item['status'] = 1;

							Company_general_condition_link.create(gen_item).exec(function afterwards(err, updated){
								if (err) return res.json(err);

								return res.json(200, { status: 1, text: 'successfully updated' });
							});							


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

					});


				}
			}


		},

		//this is to get property template
		deletegeneralconditiontemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var gen_id =  req.param('general_id');

							var data = {
								status : 2
							};

							if(gen_id){
								Company_general_condition_link.update({com_general_id: gen_id }, data).exec(function afterwards(err, updated){
									if (err) return res.json(err);

									return res.json(200, { status: 1, text: 'successfully deleted' });
								});
							}
							else{

								return res.json({status: 2, text: 'you cannot delete this item!' });
							}
														
														


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

						
					});

				}
			}


		},

		//get sub items list template
		getsubitemstmplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id && req.param('com_master_id') ){


							var qry = "select company_subitem_link.* from company_subitem_link where company_subitem_link.status = 1 and company_subitem_link.com_master_id="+ req.param('com_master_id') +" and company_subitem_link.company_id="+ user.company_id +" order by company_subitem_link.priority";
							Company_subitem_link.query(qry, function(err, com_sub){
								//console.log(prop_room);
								return res.json({status: 1, sub_items: com_sub });

							});

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}


					});



				}
			}
		},

		//this is to update sub items template
		updatesubitemstemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var sub_items =  req.param('sub_items');
							for(var i = 0, l = sub_items.length; i < l ; i++ ){

								var sub_id = sub_items[i]['com_subitem_id'];
								var data = {
									'item_name' : sub_items[i]['item_name']
								}

								Company_subitem_link.update({com_subitem_id: sub_id }, data ).exec(function afterwards(err, updated){
										if (err) return res.json(err);
								});

							}

							return res.json(200, { status: 1, text: 'successfully updated' });


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

					});

				}
			}

		},

		//this is to insert new sub item template 
		insertsubitemtemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var sub_item =  req.param('sub_item');

							sub_item['company_id'] = user.company_id;
							sub_item['status'] = 1;

							Company_subitem_link.create(sub_item).exec(function afterwards(err, updated){
								if (err) return res.json(err);

								return res.json(200, { status: 1, text: 'successfully updated' });
							});							


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

					});


				}
			}


		},

		//this is to get property template
		deletesubitemstemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var sub_id =  req.param('sub_id');

							var data = {
								status : 2
							};

							if(sub_id){
								Company_subitem_link.update({com_subitem_id: sub_id }, data).exec(function afterwards(err, updated){
									if (err) return res.json(err);

									return res.json(200, { status: 1, text: 'successfully deleted' });
								});
							}
							else{

								return res.json({status: 2, text: 'you cannot delete this item!' });
							}
														
														


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

						
					});

				}
			}


		},

		//get meter items list template
		getmeterlisttemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id ){


							var qry = "select company_meter_link.* from company_meter_link where company_meter_link.status = 1 and company_meter_link.company_id="+ user.company_id ;
							Company_meter_link.query(qry, function(err, com_meter){
								//console.log(prop_room);
								return res.json({status: 1, meter_list: com_meter });

							});

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}


					});



				}
			}
		},

		//this is to update sub items template
		updatemeterlisttemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var meter_list =  req.param('meter_list');
							for(var i = 0, l = meter_list.length; i < l ; i++ ){

								var meter_id = meter_list[i]['com_meter_id'];
								var data = {
									'meter_name' : meter_list[i]['meter_name']
								}

								Company_meter_link.update({com_meter_id: meter_id }, data ).exec(function afterwards(err, updated){
										if (err) return res.json(err);
								});

							}

							return res.json(200, { status: 1, text: 'successfully updated' });


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

					});

				}
			}

		},

		//this is to insert new sub item template 
		insertmeteritemtemplate: function(req, res){


			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var meter_item =  req.param('meter_item');

							meter_item['company_id'] = user.company_id;
							meter_item['status'] = 1;

							Company_meter_link.create(meter_item).exec(function afterwards(err, updated){
								if (err) return res.json(err);

								return res.json(200, { status: 1, text: 'successfully updated' });
							});							


						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}

					});


				}
			}


		},

		//this is to get property template
		deletemeteritemtemplate: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id){

							var meter_id =  req.param('meter_id');

							var data = {
								status : 2
							};

							if(meter_id){
								Company_meter_link.update({com_meter_id: meter_id }, data).exec(function afterwards(err, updated){
									if (err) return res.json(err);

									return res.json(200, { status: 1, text: 'successfully deleted' });
								});
							}
							else{

								return res.json({status: 2, text: 'you cannot delete this item!' });
							}

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}
						
					});

				}
			}

		},

		
		getPhotosByMaster: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');
					var master_id = req.param('master_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									
									Photos.find({property_id: property_id, parent_id: master_id }).exec(function(err, photos){
										if(err) return res.json(err);

										return res.json({status: 1, photos: photos});
									});


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}

		},

		getPhotos: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');
					var item_id = req.param('item_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									
									Photos.find({property_id: property_id, item_id: item_id }).exec(function(err, photos){
										if(err) return res.json(err);

										return res.json({status: 1, photos: photos});
									});					


								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this property!' });
								}

							});



						});

					}




				}
			}

		},

		//this to update photo drag and drop 
		updatephotodnd: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id){

							var photo_id =  req.param('photo_id');
							var item_id =  req.param('item_id');

							if(photo_id && item_id){

								var data = {
									item_id: item_id,
									type: 'SUB' 
								}

								Photos.update({photo_id: photo_id }, data).exec(function afterwards(err, updated){
									if (err) return res.json(err);

									return res.json(200, { status: 1, text: 'successfully updated' });
								});
							}
							else{

								return res.json({status: 2, text: 'data is missing for update' });
							}

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}
						
					});

				}
			}

		},

		//this to update photo drag and drop 
		photodelete: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);

						//check if the user is authorize to access this property
						if(user.company_id){

							var photo_id =  req.param('photo_id');

							if(photo_id ){

								/*Photos.findOne({ photo_id: photo_id }).exec(function(err, photo){
									if(err) return res.json(err);
									var file_path = photo.img_url;
									if(file_path){
									}
								});*/


								var qry = "delete from photos where photo_id'"+ photo_id + "'" ;
								Photos.query(qry, function(err, photo){
									if (err) return res.json(err);

									return res.json({status: 1, text: 'successfully deleted' });

								});


							}
							else{

								return res.json({status: 2, text: 'data is missing' });
							}

						}
						else{
							return res.json({status: 2, text: 'you are not allow to access this property!' });
						}
						
					});

				}
			}

		},

		uploadfile: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						//console.log( req.param('data') );
						console.log('Uploading photos');

						// return res.json({ status: 1, data:  req.param('data') });
						var d = new Date();
						var current_year = d.getFullYear();
						var uploadToDir = '../public/resources_' + current_year;

						var fs = require('fs');
						
						// if (!fs.existsSync(uploadToDir)){
						//     fs.mkdirSync(uploadToDir);
						// }
						var path = require('path');

						req.file('photo').upload(
							{
								 dirname: '../public/images',//'./assets/images',
								  maxBytes: 10000000
							},
							function (err, files) {

						      	if (err){
									console.log(err);
									return res.json(err);
								}

							console.log('uploaded'); 

							console.log(req.param('property_id'));


							 //console.log(files[0]);
							 console.log(files[0].fd);
							 console.log(files[0].filename);

							 const uuidV4 = require('uuid/v4');

							 var data = {
							 	photo_id: uuidV4(),
							  	property_id : req.param('property_id'),
							  	item_id : req.param('item_id'),
							  	parent_id: req.param('parent_id'),
							  	type: req.param('type'),
							  	img_url: files[0].fd,
							  	file_name: path.basename(files[0].fd)
							  }


						      var _src = files[0].fd             // path of the uploaded file  

						      var ImagesDirArr = __dirname.split('/'); // path to this controller
						        ImagesDirArr.pop();
						        ImagesDirArr.pop();

						        // the destination path
						      var _dest = ImagesDirArr.join('/')  +'/assets/images/'+ path.basename(files[0].fd); //files[0].filename 

						        // not preferred but fastest way of copying file
						      fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));


							Photos.create(data).exec(function(err, photos){
								if (err) return res.json(err);
								 if(photos.photo_id){
									return res.json({
										message: files.length + ' file(s) uploaded successfully!',
										files: files,
										data: data,
										status: 1
									});

								 }
							});

				  		});


				  		



				});

			}

		}

	}





};
