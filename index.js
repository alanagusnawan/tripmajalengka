const wa = require('@open-wa/wa-automate');
const mysql = require('mysql');

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
          con.query("SELECT * FROM OW WHERE OW_NAMA || OW_LL LIKE '%" + wisata + "%' ORDER BY OW_NAMA || OW_LL", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              var kecamatan = `${wisata.KEC_KODE}`;
              var desa = `${wisata.DES_KODE}`;
              client.sendText(message.from,`${wisata.OW_NAMA} atau ${wisata.OW_LL}`),
              con.query("SELECT * FROM KEC WHERE KEC_KODE = '" + kecamatan + "'", function (err, result) {
              if (err) throw err;
              console.log(result);
              result.forEach(kec => { 
                var nama_kecamatan = `${kec.KEC_NAMA},`;
              con.query("SELECT * FROM DES WHERE DES_KODE = '" + desa + "'", function (err, result) {
                if (err) throw err;
                console.log(result);
                result.forEach(des => { 
                var nama_desa = `${des.DES_NAMA}.`;
              client.sendText(message.from,`Berada di Kecamatan ` + nama_kecamatan + `Desa `+ nama_desa);
              client.sendText(message.from,`${wisata.DESKRIPSI}`);
              client.sendText(message.from,`Rute untuk menuju lokasi ${wisata.CARA_MENCAPAI}`);
              client.sendText(message.from,`Fasilitas yang tersedia ${wisata.FASILITAS}`);
              client.sendText(message.from,`Hal yang harus diperhatikan ${wisata.HAL_PERHATIAN}`);
          });});});
        });
      });
        });
      client
      .simulateTyping(message.from,false);
    } else if (message.body.startsWith('!wisatadaerahkecamatan ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
      .simulateTyping(message.from,true);
          con.query("SELECT OW_NAMA FROM OW INNER JOIN KEC ON KEC.KEC_NAMA = '" + wisata +"' AND OW.KEC_KODE = KEC.KEC_KODE ORDER BY OW.OW_NAMA", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              client.sendText(message.from,`${wisata.OW_NAMA}`);
      });
        });
      client
      .simulateTyping(message.from,false);
    } else if (message.body.startsWith('!wisatadaerahdesa ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
      .simulateTyping(message.from,true);
          con.query("SELECT OW_NAMA FROM OW INNER JOIN DES ON DES.DES_NAMA = '" + wisata +"' AND OW.DES_KODE = DES.DES_KODE ORDER BY OW.OW_NAMA", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              client.sendText(message.from,`${wisata.OW_NAMA}`);
      });
        });
      client
      .simulateTyping(message.from,false);
    } else if (message.body.startsWith('!wisata ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
      .simulateTyping(message.from,true);
          con.query("SELECT OW_NAMA FROM OW INNER JOIN KATEGORI ON KATEGORI.KATEGORI_NAMA = '" + wisata +"' AND OW_KATEGORI.OW_KODE = KATEGORI.KATEGORI_KODE AND OW.OW_KODE = OW_KATEGORI.OW_KODE ORDER BY OW.OW_NAMA", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              client.sendText(message.from,`${wisata.OW_NAMA}`);
      });
        });
      client
      .simulateTyping(message.from,false);
    } else {
      client.sendText(message.from,`Mohon maaf kata yang anda masukan salah berikut adalah kata yang benar :
      1.!cariwisata 'nama wisata'
      2.!wisatadaerahkecamatan 'nama kecamatan'
      3.!wisatadaerahdesa 'nama desa'`)
    }
  });
  client.onIncomingCall(async (call) => {
    console.log(call);
    client.sendText(call.peerJid, "Mohon maaf layanan ini tidak bisa menerima panggilan.");
  });
});
}
