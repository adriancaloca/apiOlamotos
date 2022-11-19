const nodemailer = require('nodemailer');

const sendMail = async (req, res) => {
    try {
        const { name, subject, mail, num, msg } = req.body;
        
        let transport = nodemailer.createTransport({
            host: 'smtp.ionos.mx',
            port: 465,
            auth: {
              user: 'contacto@olamotos.mx',
              pass: 'olamotos2022.'
            }
         });
         const mailOptions = {
            from: 'contacto@olamotos.mx', // Sender address
            to: 'adriancaloca1998@gmail.com', // List of recipients
            subject: 'Un cliente quiere comunicarse contigo!', // Subject line
            text: `
            El cliente ${name} quiere contactarse contigo.
            Asunto: ${subject}
            Mensaje: ${msg}
            Correo electronico: ${mail}
            Número de contacto: ${num}`
       };
       transport.sendMail(mailOptions, function(err, info) {
           if (err) {
           } else {
           }
       });
        const responseAPI = {msg: "success"}
        res.json(responseAPI)
    } catch (e) {
        res.status(500);
        res.send("Error al envial correo:  "+ e);
    }
};

export const methods = {
    sendMail
};