const sgMail = require('@sendgrid/mail')

// sgMail.setApiKey('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')
sgMail.setApiKey('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')
const sendWelcomeEmail = (email)=>{
    sgMail.send({
        to : email,
        from: 'yash.gautam113@gmail.com',
        Subject : 'Thanks for Signing Up',
        // text: `Welcome, ${name}. We are glad that you joined us for upcoming event. You may become college ambassador for your College ${CollegeName}. Goodies are waiting for you!!! Click here to verify your email ${link}`
        text : 'hi'
    })
}

const delemail = (email,name)=>{
    sgMail.send({
        to : email,
        from : 'yash.gautam113@gmail.com',
        subject : `${name} We respect your descision. If you ever feel to comeback you are most welcome. Have a nice Day `
    })
}

module.exports = {
    sendWelcomeEmail,
    delemail,
}