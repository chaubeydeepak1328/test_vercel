const express = require('express');
const path = require("path");


const static_path = path.join(__dirname, "/public/");
const app = express()
const PORT = 8000;
const nodeMailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();



app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post("/send", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const subj = req.body.subject;
        const query = req.body.query;

        const mailsend = async () => {
            let config = {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            };

            let transporter = nodeMailer.createTransport(config);

            let MailGenerator = new Mailgen({
                theme: "default",
                product: {
                    name: "Mailgen",
                    link: 'https://mailgen.js'
                }
            });

            let message = {
                from: process.env.EMAIL,
                to: process.env.RECEIVER,
                subject: subj,
                html: `<div class="contaier">
                <p>Name: ${name}</p>
                <p>from: ${email}</p>
                <p>query:</p>
                <p>${query}</p>
            </div>`
            };

            try {
                 const mailsended = await transporter.sendMail(message);
                res.status(201).sendFile(path.join(__dirname, 'index.html'));
            }
            catch (err) {
                console.log(err);
                res.status(500).send(err);
            }
        };
        await mailsend();
    } catch (err) {
        res.status(400).send(err);
    }


})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})
