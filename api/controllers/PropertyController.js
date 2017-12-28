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

						var table = req.param('table');
						var data =  req.param('data');
						data = JSON.parse(data);
						delete data.sync;

						//console.log(data);

						if(req.param('table') ){


								 //	var dataPropertyInfo = req.param('data');

									switch (req.param('table')) {
										case 'property':

														Property.findOne({property_id: data.property_id }).exec(function(err, property_details){
															if(err) return res.json(err);


																if(property_details){

																	delete data['property_id'];

																	Property.update({property_id: property_details.property_id }, data ).exec(function afterwards(err, updated){
																			if (err) return res.json(err);

																			return res.json({ status: 1, text: 'successfully updated' });

																	});


																}
																else{

																	Property.create(data).exec(function(err, property){
																		if (err) return res.json(err);
																		if(property.property_id){
																				return res.json({ status: 1, text: 'successfully created' });
																		}
																	});

																}



														});

														break;


										case 'property_info':

													Property_info.findOne({property_id: data.property_id }).exec(function(err, propertyinfo_details){
														if(err) return res.json(err);

														if(propertyinfo_details){

															delete data['property_id'];

															Property_info.update({property_id: propertyinfo_details.property_id }, data ).exec(function afterwards(err, updated){
																	if (err) return res.json(err);

																	return res.json({ status: 1, text: 'successfully updated' });

															});

														}
														else{

															Property_info.create(data).exec(function(err, propertyInfo){
																if (err) return res.json(err);
																if(propertyInfo.property_id){
																		return res.json({ status: 1, text: 'successfully created' });
																}
															});

														}

													});


												break;

										case 'property_masteritem_link':

													Property_masteritem_link.findOne({prop_master_id: data.prop_master_id }).exec(function(err, property_masteritem){
														if(err) return res.json(err);

														if(property_masteritem){

															delete data['prop_master_id'];

															Property_masteritem_link.update({prop_master_id: property_masteritem.prop_master_id }, data ).exec(function afterwards(err, updated){
																	if (err) return res.json(err);

																	return res.json({ status: 1, text: 'successfully updated' });

															});

														}
														else{

															Property_masteritem_link.create(data).exec(function(err, property_masteritem){
																if (err) return res.json(err);
																if(property_masteritem.prop_master_id){
																		return res.json({ status: 1, text: 'successfully created' });
																}
															});

														}

													});

												break;

									case 'property_subitem_link':


												Property_subitem_link.findOne({prop_subitem_id: data.prop_subitem_id }).exec(function(err, property_subitem){
													if(err) return res.json(err);

													if(property_subitem){

														delete data['prop_subitem_id'];

														Property_subitem_link.update({prop_subitem_id: property_subitem.prop_subitem_id }, data ).exec(function afterwards(err, updated){
																if (err) return res.json(err);

																return res.json({ status: 1, text: 'successfully updated' });

														});

													}
													else{

														Property_subitem_link.create(data).exec(function(err, property_subitem){
															if (err) return res.json(err);
															if(property_subitem.prop_subitem_id){
																	return res.json({ status: 1, text: 'successfully created' });
															}
														});

													}

												});


											break;

									case 'property_general_condition_link':

												Property_general_condition_link.findOne({prop_general_id: data.prop_general_id }).exec(function(err, property_general_condition_link){
													if(err) return res.json(err);


													if(property_general_condition_link ){

														delete data['prop_general_id'];

														Property_general_condition_link.update({prop_general_id: property_general_condition_link.prop_general_id }, data ).exec(function afterwards(err, updated){
																if (err) return res.json(err);

																return res.json({ status: 1, text: 'successfully updated' });

														});

													}
													else{

														Property_general_condition_link.create(data).exec(function(err, property_general_condition_link){
															if (err) return res.json(err);
															if(property_general_condition_link.prop_general_id){
																	return res.json({ status: 1, text: 'successfully created' });
															}
														});

													}

												});

											break;


									case 'property_meter_link':


												Property_meter_link.findOne({prop_meter_id: data.prop_meter_id }).exec(function(err, property_meter){
													if(err) return res.json(err);

													if( property_meter){

														delete data['prop_meter_id'];

														Property_meter_link.update({prop_meter_id: property_meter.prop_meter_id }, data ).exec(function afterwards(err, updated){
																if (err) return res.json(err);

																return res.json({ status: 1, text: 'successfully updated' });

														});

													}
													else{

														Property_meter_link.create(data).exec(function(err, property_meter){
															if (err) return res.json(err);
															if(property_meter.prop_meter_id){
																	return res.json({ status: 1, text: 'successfully created' });
															}
														});

													}

												});


											break;



								case 'property_feedback':


											Property_feedback.findOne({prop_feedback_id: data.prop_feedback_id }).exec(function(err, property_feedback){
												if(err) return res.json(err);

												if(property_feedback){

													delete data['prop_feedback_id'];

													Property_feedback.update({prop_feedback_id: property_feedback.prop_feedback_id }, data ).exec(function afterwards(err, updated){
															if (err) return res.json(err);

															return res.json({ status: 1, text: 'successfully updated' });

													});

												}
												else{

													Property_feedback.create(data).exec(function(err, property_feedback){
														if (err) return res.json(err);
														if(property_feedback.prop_feedback_id){
																return res.json({ status: 1, text: 'successfully created' });
														}
													});

												}

											});


										break;


								case 'property_sub_feedback_general':

											Property_sub_feedback_general.findOne({prop_sub_feedback_general_id: data.prop_sub_feedback_general_id }).exec(function(err, property_sub_feedback_general){
												if(err) return res.json(err);

												if(property_sub_feedback_general ){

													delete data['prop_sub_feedback_general_id'];

													Property_sub_feedback_general.update({prop_sub_feedback_general_id: property_sub_feedback_general.prop_sub_feedback_general_id }, data ).exec(function afterwards(err, updated){
															if (err) return res.json(err);

															return res.json({ status: 1, text: 'successfully updated' });

													});

												}
												else{

													Property_sub_feedback_general.create(data).exec(function(err, property_sub_feedback_general){
														if (err) return res.json(err);
														if(property_sub_feedback_general.prop_sub_feedback_general_id){
																return res.json({ status: 1, text: 'successfully created' });
														}
													});

												}

											});


										break;

								case 'signatures':

													Signatures.findOne({sign_id: data.sign_id }).exec(function(err, signatures){
														if(err) return res.json(err);

														if(signatures){

															delete data['sign_id'];

															Signatures.update({sign_id: signatures.sign_id }, data ).exec(function afterwards(err, updated){
																	if (err) return res.json(err);

																	return res.json({ status: 1, text: 'successfully updated' });

															});

														}
														else{

															Signatures.create(data).exec(function(err, signatures){
																if (err) return res.json(err);
																if(signatures.sign_id){
																		return res.json({ status: 1, text: 'successfully created' });
																}
															});

														}

													});


												break;


										default:
											return res.json({ status: 2, err: 'no table found' });
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

						console.log('Uploading photos');

						var fs = require('fs');
						var path = require('path');
						var im = require('imagemagick');

						var ImagesDirArr = __dirname.split('/'); // path to this controller
            ImagesDirArr.pop();
            ImagesDirArr.pop();

						var data = JSON.parse(req.param('data') );
						var upload_path =  ImagesDirArr.join('/')  + '/assets/images/' + data.property_id + '/';

						if(fs.existsSync( upload_path )){
              sails.log('folder exists');

							req.file('photo').upload(
									{
										dirname: '../public/images',
										maxBytes: 10000000
									},
								function (err, files) {

							    	if (err){
											console.log(err);
											return res.json(err);
										}

									 	delete data.id;
										delete data.sync;

							      var _src = files[0].fd; // path of the uploaded file
							      var _dest = upload_path + path.basename(files[0].fd); // destination path

										data['img_url'] = _dest;
										data['file_name'] = path.basename(files[0].fd);

						      	fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));



										im.resize({
		                  srcPath: _src,
		                  dstPath: upload_path + '300_' + path.basename(files[0].fd),
		                  width: 300
		                }, function(err, stdout, stderr){
		                  if (err) throw err;
		                  console.log('resized fit within 300px');
		                });

										im.resize({
		                  srcPath: _src,
		                  dstPath: upload_path + '600_' + path.basename(files[0].fd),
		                  width: 600
		                }, function(err, stdout, stderr){
		                  if (err) throw err;
		                  console.log('resized fit within 600px');
		                });

										im.crop({
											srcPath: _src,
											dstPath: upload_path + 'report_300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
											width: 300,
											height: 300,
										}, function(err, stdout, stderr){
											if (err) throw err;
											sails.log('cropped fit within 300px');
										});


										Photos.create(data).exec(function(err, photos){
											if (err) return res.json(err);

											if(photos.photo_id){
												return res.json({
														status: 1,
														message: files.length + ' file(s) uploaded successfully!',
														files: files,
														data: data
												});
											}

										});

					  		});


            }
						else{
							var mkdirp = require('mkdirp');
	            mkdirp(upload_path , function(err) {
	              // path exists unless there was an error
	              if (err){
									sails.log(err);
									return res.json(err);
								}
	              else{

									sails.log('folder created');

									req.file('photo').upload(
											{
												dirname: '../public/images',
												maxBytes: 10000000
											},
										function (err, files) {

									    	if (err){
													console.log(err);
													return res.json(err);
												}

											 	delete data.id;
												delete data.sync;

									      var _src = files[0].fd; // path of the uploaded file
									      var _dest = upload_path + path.basename(files[0].fd); // destination path
												data['img_url'] = _dest;
											 	data['file_name'] = path.basename(files[0].fd);

								      	fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

												im.resize({
				                  srcPath: _src,
				                  dstPath: upload_path + '300_' + path.basename(files[0].fd),
				                  width: 300
				                }, function(err, stdout, stderr){
				                  if (err) throw err;
				                  console.log('resized fit within 300px');
				                });

												im.resize({
				                  srcPath: _src,
				                  dstPath: upload_path + '600_' + path.basename(files[0].fd),
				                  width: 600
				                }, function(err, stdout, stderr){
				                  if (err) throw err;
				                  console.log('resized fit within 600px');
				                });

												im.crop({
													srcPath: _src,
													dstPath: upload_path + 'report_300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
													width: 300,
													height: 300,
												}, function(err, stdout, stderr){
													if (err) throw err;
													sails.log('cropped fit within 300px');
												});


												Photos.create(data).exec(function(err, photos){
													if (err) return res.json(err);

													if(photos.photo_id){
														return res.json({
																status: 1,
																message: files.length + ' file(s) uploaded successfully!',
																files: files,
																data: data
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

	uploadvoice: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						console.log('Uploading voices');

						var fs = require('fs');
						var path = require('path');

						var ImagesDirArr = __dirname.split('/'); // path to this controller
						ImagesDirArr.pop();
						ImagesDirArr.pop();

						var property_id = req.param('property_id');
						var upload_path =  ImagesDirArr.join('/')  + '/assets/images/' + property_id + '/';

						if(fs.existsSync( upload_path )){
              sails.log('folder exists');

							req.file('voice').upload(
							{
								 dirname: '../public/images',
								  maxBytes: 10000000
							},
							function (err, files) {

								if (err){
									console.log('voice file uploading error');
									console.log(err);
									return res.json(err);
								}

								console.log(files[0].fd);
							 	console.log(files[0].filename);

								var _src = files[0].fd; // path of the uploaded file

							  var _dest = upload_path + path.basename(files[0].fd);
								var data = {};
								data['prop_sub_feedback_general_id'] = req.param('prop_sub_feedback_general_id');
								data['property_id'] = req.param('property_id');
								data['item_id'] = req.param('item_id');
								data['parent_id'] = req.param('parent_id');
								data['mb_createdAt'] = req.param('mb_createdAt');
								data['voice_url'] = _dest;
								data['file_name'] = path.basename(files[0].fd);

							  fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

								Property_sub_voice_general.create(data).exec(function(err, property_sub_voice_general_data){
									if (err) return res.json(err);
									if(property_sub_voice_general_data.prop_sub_feedback_general_id){
										return res.json({
											'status' : 1,
											'message': 'file(s) uploaded successfully!'
										});
									}
								});
							});


            }
						else{

							var mkdirp = require('mkdirp');
	            mkdirp(upload_path , function(err) {

	              if (err){
									sails.log(err);
									return res.json(err);
								}
	              else{
									sails.log('folder created!');

									req.file('voice').upload(
									{
										 dirname: '../public/images',
										  maxBytes: 10000000
									},
									function (err, files) {

										if (err){
											console.log('voice file uploading error');
											console.log(err);
											return res.json(err);
										}

										var data = {};
										data['prop_sub_feedback_general_id'] = req.param('prop_sub_feedback_general_id');
										data['property_id'] = req.param('property_id');
										data['item_id'] = req.param('item_id');
										data['parent_id'] = req.param('parent_id');
										data['mb_createdAt'] = req.param('mb_createdAt');

										console.log(files[0].fd);
									 	console.log(files[0].filename);

										var _src = files[0].fd; // path of the uploaded file

									  var _dest = upload_path + path.basename(files[0].fd);
										data['voice_url'] = _dest;
										data['file_name'] = path.basename(files[0].fd);

									  fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

										Property_sub_voice_general.create(data).exec(function(err, property_sub_voice_general_data){
											if (err) return res.json(err);
											if(property_sub_voice_general_data.prop_sub_feedback_general_id){
												return res.json({
													'status' : 1,
													'message': 'file uploaded successfully!',
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

	uploadpropertyimg: function(req, res){

		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

						console.log('Uploading property photos');

						var fs = require('fs');
            var im = require('imagemagick');
            var path = require('path');

						var ImagesDirArr = __dirname.split('/'); // path to this controller
            ImagesDirArr.pop();
            ImagesDirArr.pop();

						var property_id = req.param('property_id') ;
            var upload_path =  ImagesDirArr.join('/')  + '/assets/images/' + property_id + '/';

						if(fs.existsSync( upload_path )){
              console.log('folder exists');

							req.file('photo').upload(
								{
									dirname: '../public/images',
									maxBytes: 10000000
								},
								function (err, files) {

									if (err){
										sails.log(err);
										return res.json(err);
									}

									var dataPropertyInfo = {
									 	image_url: path.basename(files[0].fd)
									};

									var _src = files[0].fd             // path of the uploaded file
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

									im.crop({
										srcPath: _src,
										dstPath: upload_path + 'report_300x700_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
										width: 300,
										height: 700,
									}, function(err, stdout, stderr){
										if (err) throw err;
										sails.log('cropped fit within 300px');
									});

								 	Property_info.update({property_id: property_id }, dataPropertyInfo ).exec(function afterwards(err, updated){
											if (err) return res.json(err);
											return res.json({
												status: 1,
												message: files.length + ' file(s) uploaded successfully!',
												files: files,
												data: updated
											});
									});

							});


            }
						else{


							var mkdirp = require('mkdirp');
	            mkdirp(upload_path , function(err) {
	              // path exists unless there was an error
	              if (err){
									sails.log(err);
									return res.json(err);
								}
	              else{
									sails.log('folder created!');

									req.file('photo').upload(
										{
											dirname: '../public/images',
											maxBytes: 10000000
										},
										function (err, files) {

											if (err){
												sails.log(err);
												return res.json(err);
											}


											var dataPropertyInfo = {
											 	image_url: path.basename(files[0].fd)
											};

											var _src = files[0].fd             // path of the uploaded file
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

											im.crop({
												srcPath: _src,
												dstPath: upload_path + 'report_300x700_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
												width: 300,
												height: 700,
											}, function(err, stdout, stderr){
												if (err) throw err;
												sails.log('cropped fit within 300px');
											});

										 	Property_info.update({property_id: property_id }, dataPropertyInfo ).exec(function afterwards(err, updated){
													if (err) return res.json(err);
													return res.json({
														status: 1,
														message: files.length + ' file(s) uploaded successfully!',
														files: files,
														data: updated
													});
											});

									});



								}

	            });


						}



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

							Property_info.query("select property_info.*, DATE_FORMAT(property_info.createdAt,'%d/%m/%Y') as created_date, (SELECT sum(property_masteritem_link.total_num) FROM property_masteritem_link where property_masteritem_link.option = 'NUM' and property_masteritem_link.property_id = property_info.property_id ) as total_rooms from property_info inner join property on property_info.property_id = property.property_id where property.company_id="+ user.company_id, function(err, properties){

								if(err) return res.json(err);

								return res.json(properties);

							});

					});

				}
			}


		},

		recentprops: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

							console.log('user', user.company_id);

							Property_info.query("select property_info.*, property.description, DATE_FORMAT(property_info.createdAt,'%d/%m/%Y') as created_date, (SELECT sum(property_masteritem_link.total_num) FROM property_masteritem_link where property_masteritem_link.option = 'NUM' and property_masteritem_link.property_id = property_info.property_id ) as total_rooms, (select count(photos.photo_id) from photos where property_id = property_info.property_id) as total_photos from property_info inner join property on property_info.property_id = property.property_id where property_info.locked = 0 and property.company_id="+ user.company_id +" order by property_info.createdAt DESC limit 6 ", function(err, properties){

								if(err) return res.json(err);

								Subscriptions.query("select subscriptions.*, DATE_FORMAT(subscriptions.createdAt,'%d/%m/%Y') as alt_created_date, subscription_plan.title, subscription_plan.price, subscription_plan.months, subscription_plan.reports, subscription_plan.type, (SELECT count(gold_report_log.g_report_id) FROM gold_report_log where gold_report_log.month = MONTH(subscriptions.createdAt) and gold_report_log.year = YEAR(subscriptions.createdAt) and gold_report_log.company_id= subscriptions.company_id) as total_gold_reports, (select sliver_report_log.status from sliver_report_log where sliver_report_log.company_id = subscriptions.company_id order by sliver_report_log.s_report_id DESC limit 1 ) as total_sliver_reports from subscriptions inner join subscription_plan on subscriptions.splan_id = subscription_plan.splan_id where subscriptions.company_id="+ user.company_id +" order by subscriptions.subs_id DESC limit 1", function(err, plans){

									if(err){
										return res.json({properties: properties});
									}
									else{
										return res.json({properties: properties, plans: plans });
									}

								});




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

									if(req.param('gotImg') == 'YES' ){

										var fs = require('fs');
				            var im = require('imagemagick');
				            var path = require('path');

				            var ImagesDirArr = __dirname.split('/'); // path to this controller
				            ImagesDirArr.pop();
				            ImagesDirArr.pop();

				            var upload_path =  ImagesDirArr.join('/')  + '/assets/images/' +  propertyInfo.property_id + '/';

										if(fs.existsSync( upload_path )){
				              sails.log('folder exists');

											req.file('logo').upload(
												{
													 dirname: '../public/images',
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

													var _src = files[0].fd; // path of the uploaded file
													var _dest =  upload_path + path.basename(files[0].fd); // the destination path
													dataPropertyInfo['image_url'] = path.basename(files[0].fd);

													fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

													im.resize({
														srcPath: _src,
														dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
														width: 300
													}, function(err, stdout, stderr){
														sails.log(err);
														if (err) throw err;
														sails.log('resized fit within 300px');
													});

													im.resize({
														srcPath: _src,
														dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
														width: 600
													}, function(err, stdout, stderr){
														if (err) throw err;
														sails.log('resized fit within 600px');
													});

													im.crop({
														srcPath: _src,
														dstPath: upload_path + 'report_300x700_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
														width: 300,
														height: 700,
													}, function(err, stdout, stderr){
														if (err) throw err;
														sails.log('cropped fit within 300px');
													});

													//update main process //

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
														 Company_meter_link.find({status: 1, company_id: user.company_id}).exec(function(err, Meter_types){
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
															Company_general_condition_link.find({status: 1, company_id: user.company_id}).exec(function(err, General_conditions){
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
														 Company_masteritem_link.find({status: 1, company_id: user.company_id}).then(function(master_items){

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


															Company_subitem_link.find({status: 1, company_id: user.company_id }).exec(function(err, sub_items ){
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


													//update main process //




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
					                       dirname: '../public/images',
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

					                      var _src = files[0].fd; // path of the uploaded file
					                      var _dest =  upload_path + path.basename(files[0].fd); // the destination path
																dataPropertyInfo['image_url'] = path.basename(files[0].fd);
					                      fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

					                      im.resize({
					                        srcPath: _src,
					                        dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
					                        width: 300
					                      }, function(err, stdout, stderr){
					                        if (err) throw err;
					                        sails.log('resized fit within 300px');
					                      });

																im.resize({
					                        srcPath: _src,
					                        dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
					                        width: 600
					                      }, function(err, stdout, stderr){
					                        if (err) throw err;
					                        sails.log('resized fit within 600px');
					                      });

																//update main process //

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
													 				 Company_meter_link.find({status: 1, company_id: user.company_id}).exec(function(err, Meter_types){
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
																		Company_general_condition_link.find({status: 1, company_id: user.company_id}).exec(function(err, General_conditions){
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
																	 Company_masteritem_link.find({status: 1, company_id: user.company_id}).then(function(master_items){

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


																		Company_subitem_link.find({status: 1, company_id: user.company_id }).exec(function(err, sub_items ){
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


																//update main process //




															});



													}

												});

										}





									}
									else{ // no for img
										//update main process //

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
											 Company_meter_link.find({status: 1, company_id: user.company_id}).exec(function(err, Meter_types){
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
												Company_general_condition_link.find({status: 1, company_id: user.company_id}).exec(function(err, General_conditions){
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
											 Company_masteritem_link.find({status: 1, company_id: user.company_id}).then(function(master_items){

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


												Company_subitem_link.find({status: 1, company_id: user.company_id }).exec(function(err, sub_items ){
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


										//update main process //

									}






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


									if(req.param('gotImg') == 'YES' ){

										var fs = require('fs');
				            var im = require('imagemagick');
				            var path = require('path');

				            var ImagesDirArr = __dirname.split('/'); // path to this controller
				            ImagesDirArr.pop();
				            ImagesDirArr.pop();

				            var upload_path =  ImagesDirArr.join('/')  + '/assets/images/' + property_id + '/';

										if(fs.existsSync( upload_path )){
				              sails.log('folder exists');


											req.file('logo').upload(
		                    {
		                       dirname: '../public/images',
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

													im.resize({
		                        srcPath: _src,
		                        dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
		                        width: 600
		                      }, function(err, stdout, stderr){
		                        if (err) throw err;
		                        sails.log('resized fit within 600px');
		                      });

													im.crop({
														srcPath: _src,
														dstPath: upload_path + 'report_300x700_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
														width: 300,
														height: 700,
													}, function(err, stdout, stderr){
														if (err) throw err;
														sails.log('cropped fit within 300px');
													});

													dataPropertyInfo['image_url'] = path.basename(files[0].fd);
													Property_info.update({property_id: req.param('property_id')}, dataPropertyInfo ).exec(function afterwards(err, updated){
															if (err) return res.json(err);
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
				                       dirname: '../public/images',
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

															im.resize({
				                        srcPath: _src,
				                        dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
				                        width: 600
				                      }, function(err, stdout, stderr){
				                        if (err) throw err;
				                        sails.log('resized fit within 600px');
				                      });

															im.crop({
																srcPath: _src,
																dstPath: upload_path + 'report_300x700_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
																width: 300,
																height: 700,
															}, function(err, stdout, stderr){
																if (err) throw err;
																sails.log('cropped fit within 300px');
															});

															dataPropertyInfo['image_url'] = path.basename(files[0].fd);
															Property_info.update({property_id: req.param('property_id')}, dataPropertyInfo ).exec(function afterwards(err, updated){
																	if (err) return res.json(err);
															});


				                  });


												}

											});

										}



									}
									else{
										Property_info.update({property_id: req.param('property_id')}, dataPropertyInfo ).exec(function afterwards(err, updated){
												if (err) return res.json(err);
												//return res.json(200, { status: 1, property_id: updated.property_id});
										});
									}




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
								if(user.company_id ==  property_details.company_id  && user.type ==  'ADMIN' ){

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
								if(user.company_id ==  property_details.company_id && user.type ==  'ADMIN' ){


									var nums = req.param('nums');
									var options = req.param('options');

									//console.log(nums);
									//	var update_data = {total_num: 3 };



									 if(nums){

									 	for(var i=0, l = nums.length; i < l ; i++){

											var update_data = {total_num: 0 };
											if(nums[i].total_num){
												update_data = {total_num: nums[i].total_num };
											}


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

									return res.json({status: 1, text: 'successfully updated'});

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
		sortroomlist: function(req, res){

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

									var room_list =  req.param('room_list');
									for(var i = 0, l = room_list.length; i < l ; i++ ){

										var prop_master_id = room_list[i]['prop_master_id'];
										var data = {
											'priority' : (i + 1)
										}

										Property_masteritem_link.update({prop_master_id: prop_master_id }, data ).exec(function afterwards(err, updated){
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

		//this is to update property template
		updatemasteritem: function(req, res){

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

									var data =  req.param('data');
									var prop_master_id = req.param('prop_master_id');

									Property_masteritem_link.update({prop_master_id: prop_master_id }, data ).exec(function afterwards(err, updated){
											if (err) return res.json(err);
											return res.json(200, { status: 1, text: 'successfully deleted' });
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

		//this is to copy property template
		copyroomdetails: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

					var property_id = req.param('property_id');

					if(!property_id){
						return res.json({status: 2, text: 'property id is missing!' });
					}
					else{

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							//sails.log('copy itemes', user.company_id);

							Property.findOne({property_id: property_id }).exec(function(err, property_details){
								if(err) return res.json(err);

								//check if the user is authorize to access this property
								if(user.company_id ==  property_details.company_id ){

									var room_name =  req.param('room_name');
									var prop_master_id = req.param('prop_master_id');

									Property_masteritem_link.findOne({prop_master_id: prop_master_id }).exec(function afterwards(err, master_items){
											if (err) return res.json(err);

											// sails.log('master item find itemes');
											// sails.log(master_items);

											if(master_items){
												const uuidV4 = require('uuid/v4');
												var master_data = {};
												var insert_prop_master_id =  uuidV4();
												master_data["prop_master_id"] = insert_prop_master_id;
												master_data["property_id"] =  property_id;
												master_data['com_master_id'] = master_items.com_master_id;
												master_data["type"] =  master_items.type;
												master_data["com_type"] =   master_items.com_type;
												master_data["self_prop_master_id"] =   master_items.self_prop_master_id;
												master_data["name"] =  room_name;
												master_data["priority"] =   master_items.priority;
												master_data["total_num"] =  master_items.total_num;
												master_data["status"] =  1;

												Property_masteritem_link.create(master_data).exec(function afterwards(err, updated_master_items){
													if (err) return res.json(err);

													// sails.log('master item create new record');
													// sails.log(updated_master_items);

													//we have upadated the master details
													if(updated_master_items){

														var query = "select property_subitem_link.*, property_masteritem_link.prop_master_id, property_masteritem_link.name as master_item_name, company_subitem_link.com_master_id from property_subitem_link inner join company_subitem_link on property_subitem_link.com_subitem_id = company_subitem_link.com_subitem_id inner JOIN property_masteritem_link on company_subitem_link.com_master_id = property_masteritem_link.com_master_id where property_subitem_link.status =1 and property_masteritem_link.prop_master_id ='" + prop_master_id + "' and property_masteritem_link.property_id ='" + property_id + "'  and property_subitem_link.property_id = property_masteritem_link.property_id order by property_subitem_link.type";

														Property_subitem_link.query(query, function(err, prop_full_details){
															if (err) return res.json(err);

															//sails.log('sub items found');
															//sails.log(prop_full_details);

															//going to loop through the property full details

															if(prop_full_details){

																for (var i = 0; i < prop_full_details.length; i++) {

																	if(prop_full_details[i].type =='GENERAL' ){

																		//sails.log('copy GENERAL feedback');
																		Property_sub_feedback_general.findOne({item_id: prop_full_details[i].prop_subitem_id,  parent_id: prop_master_id }).exec(function afterwards(err, feedback_general){
																				if (err) return res.json(err);

																				// sails.log('prop feedback general find');
																				//
																				// sails.log(feedback_general);

																				if(feedback_general){
																					//sails.log('feed back general object ok');

																					var prop_sub_feedback_general_id = uuidV4();
																					var property_sub_feedback_general_data = {
																						prop_sub_feedback_general_id: prop_sub_feedback_general_id,
																						property_id: property_id,
																						item_id: feedback_general.item_id,
																						parent_id: insert_prop_master_id,
																						comment: feedback_general.comment
																					};

																					Property_sub_feedback_general.create(property_sub_feedback_general_data).exec(function afterwards(err, updated_items){																						if (err) return res.json(err);
																						if (err) return res.json(err);
																						//sails.log('prop feedback general create ');
																					});


																				}

																		});


																	}
																	else{


																		//sails.log('copy other feedback');
																		Property_feedback.findOne({item_id: prop_full_details[i].prop_subitem_id,  parent_id: prop_master_id }).exec(function afterwards(err, feedback_data){
																				if (err) return res.json(err);
																				// sails.log('prop feedback find');
																				// sails.log(feedback_data);
																				if(feedback_data){
																					var prop_feedback_id = uuidV4();
																					var property_feedback_data = {
																						prop_feedback_id: prop_feedback_id,
																						property_id: property_id,
																						item_id: feedback_data.item_id,
																						parent_id: insert_prop_master_id,
																						option: feedback_data.option,
																						maintenance_opt: feedback_data.maintenance_opt,
																						comment: feedback_data.comment,
																						type: feedback_data.type,
																						description: feedback_data.description,
																					};

																					Property_feedback.create(property_feedback_data).exec(function afterwards(err, updated_items){
																						if (err) return res.json(err);
																						//sails.log('prop feedback create ');
																					});

																				}

																		});


																	}


																}// end of for loop


															}


														});

													return res.json(200, { status: 1, text: 'successfully updated' });
													}

												});

											}

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

		//soert general condition

		sortgeneralcondition: function(req, res){

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
											'priority' : (i + 1)
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

										//sails.log('updatre');

										Property_feedback.update({prop_feedback_id: prop_feedback_id }, data_feedback ).exec(function afterwards(err, updated){
												if (err) return res.json(err);

												return res.json(200, { status: 1, text: 'successfully updated' });

										});


									}
									else{

										//sails.log('insert');

										const uuidV4 = require('uuid/v4');
										prop_feedback_id = uuidV4();
										data_feedback['prop_feedback_id'] = prop_feedback_id;
										data_feedback['property_id'] = property_id;

										Property_feedback.create( data_feedback ).exec(function afterwards(err, updated){
												if (err) return res.json(err);

												//sails.log(updated);

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

									var qry = "select property_subitem_link.*, property_masteritem_link.prop_master_id, property_masteritem_link.name as master_item_name,company_subitem_link.com_master_id, property_feedback.prop_feedback_id, property_feedback.comment, property_feedback.description, property_feedback.option from property_subitem_link INNER JOIN company_subitem_link on property_subitem_link.com_subitem_id = company_subitem_link.com_subitem_id INNER JOIN property_masteritem_link ON company_subitem_link.com_master_id = property_masteritem_link.com_master_id LEFT JOIN (SELECT property_feedback.prop_feedback_id, property_feedback.item_id, property_feedback.comment, property_feedback.description, property_feedback.option, property_feedback.parent_id FROM property_feedback WHERE property_feedback.parent_id = '" + prop_master_id + "' ) as property_feedback on property_subitem_link.prop_subitem_id = property_feedback.item_id where property_subitem_link.status =1 and property_masteritem_link.prop_master_id ='" + prop_master_id +"' and property_subitem_link.property_id='" + property_id + "' order by property_subitem_link.priority";

									Property_subitem_link.query(qry, function(err, sub_items){

										//return res.json({status: 1, sub_items: sub_items});
										var gen_sub_item_id = '';
										for(var i =0, l = sub_items.length; i < l ; i++){
											if(sub_items[i].type == 'GENERAL'){
												gen_sub_item_id = sub_items[i].prop_subitem_id;
												sails.log('found general id ' +  gen_sub_item_id);
											}
										}

										if(gen_sub_item_id){


										    Property_sub_feedback_general.findOne({item_id: gen_sub_item_id, parent_id: prop_master_id,  property_id: property_id }).exec(function afterwards(err, comments){
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
														sails.log('updated general comment');
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



													Property_sub_feedback_general.create(gen_data).exec(function afterwards(err, updated){
														if (err) return res.json(err);
														//return res.json(200, { status: 1, text: 'successfully updated' });
														sails.log('genral comment updated');
														sails.log(updated);
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
									//var qry = "select signatures.* from signatures where signatures.property_id='"+ property_id + "'";

									Signatures.findOne({property_id: property_id }).exec(function(err, sign_list){
										if(err) return res.json(err);
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

		//this is to update single item
		updateSignaturesList: function(req, res){

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

									var data_signs =  req.param('data');

									var sign_id ='';

									Signatures.findOne({property_id: property_id }).exec(function(err, sign_details){
										if(err) return res.json(err);



										if(sign_details){
											if(sign_details.hasOwnProperty('sign_id') ){
												sign_id = sign_details['sign_id'];
											}
										}


										if(sign_id){

											if(data_signs.hasOwnProperty('sign_id') ){
												//sign_id = data_signs['sign_id'];
												delete data_signs['sign_id'];
											}

											Signatures.update({property_id: property_id }, data_signs ).exec(function afterwards(err, updated){
													if (err) return res.json(err);

													return res.json(200, { status: 1, text: 'successfully updated' });

											});


										}
										else{

											const uuidV4 = require('uuid/v4');
											sign_id = uuidV4();
											data_signs['sign_id'] = sign_id;
											data_signs['property_id'] = property_id;

											Signatures.create( data_signs ).exec(function afterwards(err, updated){
													if (err) return res.json(err);
													//sails.log(updated);
													return res.json(200, { status: 1, text: 'successfully inserted' });
											});

										}

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

		//sort general condition
		sortcompanytemplate: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var master_list =  req.param('master_list');
							for(var i = 0, l = master_list.length; i < l ; i++ ){

								var com_master_id = master_list[i]['com_master_id'];
								var data = {
									'priority' : (i + 1)
								}

								Company_masteritem_link.update({com_master_id: com_master_id }, data ).exec(function afterwards(err, updated){
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

		//sort general condition
		sortgeneralconditiontemplate: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var gen_list =  req.param('gen_list');
							for(var i = 0, l = gen_list.length; i < l ; i++ ){

								var com_general_id = gen_list[i]['com_general_id'];
								var data = {
									'priority' : (i + 1)
								}

								Company_general_condition_link.update({com_general_id: com_general_id }, data ).exec(function afterwards(err, updated){
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

		//this is to delete sub item template
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

		//sort sub items template
		sortsubitemstemplate: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){


					User.findOne({id :  req.token.sid}).exec(function(err, user){
						if(err) return res.json(err);

						console.log('user', user.company_id);


						//check if the user is authorize to access this property
						if(user.company_id){

							var sub_items =  req.param('sub_items');
							for(var i = 0, l = sub_items.length; i < l ; i++ ){

								var com_subitem_id = sub_items[i]['com_subitem_id'];
								var data = {
									'priority' : (i + 1)
								}

								Company_subitem_link.update({com_subitem_id: com_subitem_id }, data ).exec(function afterwards(err, updated){
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


								var qry = "delete from photos where photo_id ='"+ photo_id + "'" ;
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

						sails.log('Uploading photos');

						var fs = require('fs');
            var im = require('imagemagick');
            var path = require('path');

						var ImagesDirArr = __dirname.split('/'); // path to this controller
						ImagesDirArr.pop();
						ImagesDirArr.pop();

						var upload_path =  ImagesDirArr.join('/')  + '/assets/images/' + req.param('property_id') + '/';

						if(fs.existsSync( upload_path )){
              sails.log('folder exists');

							req.file('photo').upload(
								{
									 dirname: '../public/images',
									  maxBytes: 10000000
								},
								function (err, files) {

							     	if (err){
											sails.log(err);
											return res.json(err);
										}

							 			console.log(files[0].fd);
								 		console.log(files[0].filename);
								 		const uuidV4 = require('uuid/v4');

										var _src = files[0].fd;  // path of the uploaded file
									 	var _dest = upload_path + path.basename(files[0].fd); // the destination path

										var data = {
										 		photo_id: req.param('photo_id') ? req.param('photo_id') : uuidV4(),
										  	property_id : req.param('property_id'),
										  	item_id : req.param('item_id'),
										  	parent_id: req.param('parent_id'),
										  	type: req.param('type'),
										  	img_url: _dest,
										  	file_name: path.basename(files[0].fd)
										};


							      fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

										//resize
										im.resize({
											srcPath: _src,
											dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
											width: 600
										}, function(err, stdout, stderr){
											if (err) throw err;
											sails.log('resized fit within 600px');
										});


										im.resize({
										 srcPath: _src,
										 dstPath:  upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
										 quality: 0.6,
										 width: 300
									 	}, function(err, stdout, stderr){
										 		if (err) throw err;
										 			 sails.log('resized fit within 300px');
										});

										im.crop({
											srcPath: _src,
											dstPath: upload_path + 'report_300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
											width: 300,
											height: 300,
											quality: 0.6,
										}, function(err, stdout, stderr){
											if (err) throw err;
											sails.log('cropped fit within 300px');

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
						else{

								var mkdirp = require('mkdirp');
								mkdirp(upload_path , function(err) {

									if(err){
										sails.log(err);
										return res.json(err);
									}
									else{
										sails.log('folder created!');

										req.file('photo').upload(
											{
												 dirname: '../public/images',
												  maxBytes: 10000000
											},
											function (err, files) {

										     	if (err){
														sails.log(err);
														return res.json(err);
													}

										 			console.log(files[0].fd);
											 		console.log(files[0].filename);
											 		const uuidV4 = require('uuid/v4');
													var _src = files[0].fd;  // path of the uploaded file
										      var _dest = upload_path + path.basename(files[0].fd); // the destination path

													var data = {
													 		photo_id: req.param('photo_id') ? req.param('photo_id') : uuidV4(),
													  	property_id : req.param('property_id'),
													  	item_id : req.param('item_id'),
													  	parent_id: req.param('parent_id'),
													  	type: req.param('type'),
													  	img_url: _dest,
													  	file_name: path.basename(files[0].fd)
													};


										      fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

													//resize

													im.resize({
														srcPath: _src,
														dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
														width: 300
													}, function(err, stdout, stderr){
														if (err) throw err;
														sails.log('resized fit within 300px');
													});


													im.resize({
													 srcPath: _src,
													 dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
													 width: 600
												 }, function(err, stdout, stderr){
													 if (err) throw err;
													 sails.log('resized fit within 600px');
												 });


												 im.crop({
													 srcPath: _src,
													 dstPath: upload_path + 'report_300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
													 width: 300,
													 height: 300,
													 quality: 0.6,
												 }, function(err, stdout, stderr){
													 if (err) throw err;
													 sails.log('cropped fit within 300px');


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

							});

						}






				});

			}

		}

	},

	getvoices: function(req, res){

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


									Property_sub_voice_general.find({property_id: property_id, parent_id: master_id }).exec(function(err, voices){
										if(err) return res.json(err);

										return res.json({status: 1, voices: voices});
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

		getusers: function(req, res){

				if( req.token.hasOwnProperty('sid') ){
					if(req.token.sid){

							User.findOne({id :  req.token.sid}).exec(function(err, user){
								if(err) return res.json(err);

								console.log('user', user.company_id);

									//check if the user is authorize to access this property
									if(user.type ==  'ADMIN' ){

										User.find({company_id: user.company_id }).exec(function(err, users){
												if(err) return res.json(err);

												return res.json({status: 1, users: users});
										});

									}
									else{
										return res.json({status: 2, text: 'you are not allow to access this function!' });
									}

							});


					}
				}
		},

		removeuser: function(req, res){

				if( req.token.hasOwnProperty('sid') ){
					if(req.token.sid){

							User.findOne({id :  req.token.sid}).exec(function(err, user){
								if(err) return res.json(err);

								console.log('user', user.company_id);

									//check if the user is authorize to access this property
									if(user.type ==  'ADMIN' ){

										var user_id = req.param('user_id');

										if(!user_id){
											return res.json({status: 2, text: 'user id is missing!' });
										}
										else if(user_id == user.id){
											return res.json({status: 2, text: 'Please contact the PropertyGround administrator, You cannot remove Administrator account!' });
										}
										else{
											var qry = "delete from user where user.company_id ="+ user.company_id +" and user.id=" + user_id;

											User.query(qry, function(err, user){
												//console.log(prop_room);

												EmailService.sendEmail({
				 		 							 to: user.email,
				 		 							 subject: 'PropertyGround account has been suspended',
				 									 text: "Hello" + user.first_name + "\n Your account has been removed from PropertyGround!\nYou may need to connect your administrator for further details.\n Thank you.\nPropertyGround Team." ,
				 									 html: '<b>Hello '+ user.first_name + '</b><br/>Your account has been removed from PropertyGround!<br/>You may need to connect your administrator for further details.<br/>Thank you.<br/><b>PropertyGround Team</b>'
				 		 						 }, function (err) {
				 		 						 });

												return res.json({ status: 1, text: 'successfully deleted' });



											});

										}

									}
									else{
										return res.json({status: 2, text: 'you are not allow to access this function!' });
									}

							});


					}
				}
		},

		registeruser: function(req, res){

				if( req.token.hasOwnProperty('sid') ){
					if(req.token.sid){

							User.findOne({id :  req.token.sid}).exec(function(err, user){
								if(err) return res.json(err);

								console.log('user', user.company_id);

									//check if the user is authorize to access this property
									if(user.type ==  'ADMIN' ){

										var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

										if (req.param('password') !== req.param('confirmPassword')) {
											return res.json({status: 2, text: 'Password doesn\'t match' });
										}
										else if(!re.test(req.param('email') )  && req.param('email') ){
											return res.json({status: 2, text: 'Invalid email address!' });
										}
										else{

											var data = {
												email: req.param('email'),
												password: req.param('password'),
												type: 'USER',
												company_id:  user.company_id,
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




									}
									else{
										return res.json({status: 2, text: 'you are not allow to access this function!' });
									}

							});


					}
				}
		},

		changepassword: function(req, res){


				if( req.token.hasOwnProperty('sid') ){
					if(req.token.sid){

						if(req.param('oldpassword') && req.param('password') && req.param('confirmPassword') ){


							User.findOne({id :  req.token.sid}).exec(function(err, user){
								if(err) return res.json(err);
								console.log('user', user.company_id);

								User.validPassword(req.param('oldpassword') , user, function(err, valid) {
					        if (err) {
										return res.json({status: 2, text: 'forbidden' });
					        }

					        if (!valid) {
					          return res.json({ status: 2, text: 'invalid username or password'});
					        }
									else if (req.param('password') !== req.param('confirmPassword')) {
										return res.json({status: 2, text: 'Password doesn\'t match' });
							    }
									else{

										var data = {
											password: req.param('password'),
										}

										User.update({id: user.id }, data).exec(function afterwards(err, updated){
											if (err) return res.json(err);

											EmailService.sendEmail({
												 to: user.email,
												 subject: 'Your password changed',
												 text: "Hello" + user.first_name + "\n Your account password has changed recently!\nYou may need to connect your administrator if you see feel anything suspicious.\n Thank you.\nPropertyGround Team." ,
												 html: '<b>Hello '+ user.first_name + '</b><br/>Your account password has changed recently!<br/>You may need to connect your administrator if you see feel anything suspicious.<br/>Thank you.<br/><b>PropertyGround Team</b>'
											 }, function (err) {
											 });

											return res.json({ status: 1, text: 'successfully updated', token: sailsTokenAuth.issueToken({sid: user.id})  });

										});

									}

					      });

							});

						}
						else{
							return res.json({status: 2, text: 'missing required fileds' });
						}


					}

				}

		},

		susbcriptions: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Subscriptions.query("select subscriptions.*, DATE_FORMAT(subscriptions.createdAt,'%d/%m/%Y') as alt_created_date, subscription_plan.title, subscription_plan.price, subscription_plan.months, subscription_plan.reports, subscription_plan.type, (SELECT count(gold_report_log.g_report_id) FROM gold_report_log where gold_report_log.month = MONTH(subscriptions.createdAt) and gold_report_log.year = YEAR(subscriptions.createdAt) and gold_report_log.company_id= subscriptions.company_id) as total_gold_reports, (select sliver_report_log.status from sliver_report_log where sliver_report_log.company_id = subscriptions.company_id order by sliver_report_log.s_report_id DESC limit 1 ) as total_sliver_reports from subscriptions inner join subscription_plan on subscriptions.splan_id = subscription_plan.splan_id where subscriptions.company_id="+ user.company_id +" order by subscriptions.subs_id DESC limit 1", function(err, plans){

								return res.json({status: 1, plans: plans});

							});


						});


				}
			}

		},

		payments: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

								//check if the user is authorize to access this property
								if(user.type ==  'ADMIN' ){

									Payments.find({company_id: user.company_id }).exec(function(err, payments){
											if(err) return res.json(err);

											return res.json({status: 1, payments: payments});
									});

								}
								else{
									return res.json({status: 2, text: 'you are not allow to access this function!' });
								}

						});


				}
			}


		},

		finishSync: function(req, res){

			if( req.token.hasOwnProperty('sid') ){
				if(req.token.sid){

						User.findOne({id :  req.token.sid}).exec(function(err, user){
							if(err) return res.json(err);

							console.log('user', user.company_id);

							Property_info.findOne({property_id: req.param('property_id') }).exec(function(err, propertyinfo_details){
								if(err) return res.json(err);

								sails.log('sails finished sync');
								sails.log(propertyinfo_details);

								if(propertyinfo_details){


									EmailService.sendEmail({
										 to: user.email,
										 subject: propertyinfo_details.address_1 + ' - Property successfully synced!',
										 text: "Hello" + user.first_name + "\n Your "+ propertyinfo_details.address_1 + " - Property has been successfully synced with server!.\n You can access your property details from http://propertyground.co.uk dashboard. \nThank you.\nPropertyGround Team." ,
										 html: '<b>Hello '+ user.first_name + '</b><br/>Your "+ propertyinfo_details.address_1 + " - Property has been successfully synced with server!<br/>You can access your property details from http://propertyground.co.uk dashboard.<br/>Thank you.<br/><b>PropertyGround Team</b>'
									 }, function (err) {
									 });

									 return res.json({ status: 1, text: 'successfully sent mail'  });


								}
								else{
									return res.json({ status: 2, text: 'could not sent mail'  });
								}

							});


						});


				}
			}

		},


};
