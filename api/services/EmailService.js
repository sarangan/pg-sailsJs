var nodemailer = require('nodemailer');

module.exports = {

  sendEmail: function (options, done) {

    let transporter = nodemailer.createTransport({
        host: 'whuk-46393.whukhost.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'info@propertyground.co.uk',
            pass: 'shannira123@A'
        }
    });

    sails.log('email');
    sails.log(options.email);

    let mailOptions = {
        from: '"PropertyGround" <info@propertyground.co.uk>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.bodytext, // plain text body
        html: options.bodyhtml // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          sails.log(err);
          return done(err);
        }

        sails.log('Message %s sent: %s', info.messageId, info.response);
        return done();
    });

  }

};
