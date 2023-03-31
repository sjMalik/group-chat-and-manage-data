const sgMail = require('@sendgrid/mail');

const config = require('../../config');

sgMail.setApiKey(config.get('sendGrid:API_KEY'));

const userCreationMessage = `Hi {first_name} {last_name}<br> 
Your account successfully created. <br> 
Please find the password below <br> 
Password: <strong>{password}</strong> <br><br>
N.B. Please Change your password after login`;

exports.sendAccountCreationMail = (email, first_name, last_name, password) => {
    if(config.get('sendGrid:API_KEY') !== ''){
        let message = {
            to: email,
            from: config.get('sendGrid:noReplyMail'),
            subject: 'Account Creation Confirmation',
            html: format(userCreationMessage, {
                first_name: first_name,
                last_name: last_name,
                password: password
            })
        };
        return sgMail.send(message);
    }else{
        return
    }
}