(function(mail) {
  var mailer = require("nodemailer"),
  smtpTransport = mailer.createTransport({
//        host: "localhost",
          host: "smtp.gmail.com",
          service: 'gmail',
        auth: {

            user: "noreplytext445@gmail.com",
            pass: "noreply445"
        }
    }),
  fromEmail = "No reply <noreplytext445@gmail.com>";
  return mail.exports = {
  sendMail : function(emailto,subject,emailHtml){

    var mail = {
        from: fromEmail,
        to: emailto,
//        cc: "shivamsehgalg786@gmail.com",

        subject: subject,
        //text: "Hello",
        html: emailHtml
    }
    smtpTransport.sendMail(mail, function(error, response){

        smtpTransport.close();
        if(error==null){
          return true;
        }else{
          return false;
        }
    });



  }
  };

})(module);
