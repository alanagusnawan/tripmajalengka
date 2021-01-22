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
    console.log("KOneksi Berhasil")
  client.onMessage(async message => {
    if (err) throw err;
    if (message.body === 'Hi') {
    } else if (message.body.startsWith('!cariwisata ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
      .simulateTyping(message.from,true);
          con.query("SELECT * FROM OW WHERE OW_NAMA LIKE '%" + wisata + "%' ORDER BY OW_NAMA", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              client.sendText(message.from,`${wisata.OW_NAMA} atau ${wisata.OW_LL}
              
            bertempat di `
              + con.query("SELECT KEC_NAMA FROM KEC WHERE KEC_KODE = ${wisata.KEC_KODE}", function (err, result) {
                if (err) throw err;
                result.forEach(kec => { + 
              `${kec.KEC_NAMA},`
            });}),
            + con.query("SELECT DES.DES_NAMA FROM OW INNER JOIN DES ON OW.DES_KODE = DES.DES_KODE", function (err, result) {
              if (err) throw err;
              result.forEach(des => { + 
                `${des.DES_NAMA}.`
              });}),
            );
              client.sendText(message.from,`${wisata.DESKRIPSI}`);
              client.sendText(message.from,`${wisata.CARA_MENCAPAI}`);
              client.sendText(message.from,`${wisata.FASILITAS}`);
              client.sendText(message.from,`${wisata.HAL_PERHATIAN}`);
          });
        });
      client
      .simulateTyping(message.from,false);
    }
  });
  client.onIncomingCall(async (call) => {
    console.log(call);
    client.sendText(call.peerJid, "Mohon maaf layanan ini tidak bisa menerima panggilan.");
  });
});
}