const wa = require('@open-wa/wa-automate');
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "db4free.net",
  user: "tripmajalengka",
  password: "tripmajalengka",
  database: "tripmajalengka",
  multipleStatements: true
});

wa.create().then(client => start(client));

function start(client) {
  con.connect(function(err) {
    if (err) throw err;
  client.onMessage(async message => {
    if (message.body === 'Hi') {
    } else if (message.body.startsWith('!cariwisata ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
      .startTyping(message.from);
          con.query("SELECT * FROM OW WHERE OW_NAMA LIKE '%" + wisata + "%' ORDER BY OW_NAMA", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              client.sendText(message.from,`${wisata.OW_NAMA}`);
              client.sendText(message.from,`${wisata.OW_LL}`);
              client.sendText(message.from,`${wisata.DESKRIPSI}`);
          con.query("SELECT OW.KEC_KODE,KEC.KEC_KODE,KEC_NAMA FROM OW INNER JOIN KEC ON OW.KEC_KODE = KEC.KEC_KODE", function (err, result) {
            if (err) throw err;
              client.sendText(message.from,`${wisata.KEC_NAMA}`);
            });
          con.query("SELECT OW.DES_KODE,KEC_KODE,DES.DES_KODE,DES_NAMA FROM OW INNER JOIN DES ON OW.DES_KODE = DES.DES_KODE", function (err, result) {
              if (err) throw err;
              client.sendText(message.from,`${wisata.DES_NAMA}`);
            });
              client.sendText(message.from,`${wisata.CARA_MENCAPAI}`);
              client.sendText(message.from,`${wisata.FASILITAS}`);
              client.sendText(message.from,`${wisata.HAL_PERHATIAN}`);
          });
        });
      client
      .sendText(message.from, '*Waktu tempuh dapat berubah sewaktu waktu'),
        client
        .stopTyping(message.from);
    }
  });
  client.onIncomingCall(async (call) => {
    console.log(call);
    client.sendText(call.peerJid, "Mohon maaf layanan ini tidak bisa menerima panggilan.");
  });
});
}