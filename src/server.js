const mailjet = require('node-mailjet');

const mailjetClient = mailjet.apiConnect('08f764edff523855f85d55f92115e99b', '92dc422f957370545b3397ed72869a45'); // API Key-ul și Secret Key-ul tău

const request = mailjetClient.post('send', { version: 'v3.1' }).request({
  Messages: [
    {
      From: {
        Email: 'cristian_cercel@yahoo.com',  // Adresa ta de expeditor
        Name: 'Numele Tău123',  // Numele tău
      },
      To: [
        {
          Email: 'cristian.cercel@wizrom.ro',  // Adresa destinatarului
          Name: 'Destinatar123',  // Numele destinatarului
        },
      ],
      Subject: 'Subiectul mesajului',
      TextPart: 'Acesta test123 este corpul mesajului trimis prin Mailjet! Trimis din fisierul server.js de cristi',
      HTMLPart: '<h3>Acesta este corpul mesajului trimis prin Mailjet!</h3>',
    },
  ],
});

request
  .then((result) => {
    console.log('Email trimis cu succes:', result.body);
  })
  .catch((err) => {
    console.error('Eroare la trimiterea e-mailului:', err);
  });
