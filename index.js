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
      if (message.body === '!daftarwisata' && message.isGroupMsg === false) {
      client
      .simulateTyping(message.from,true);
          con.query("SELECT OW_NAMA FROM OW ORDER BY OW_NAMA", function (err, result) {
            if (err) throw err;
            console.log(result),
            result.forEach(wisata => {
              client.sendText(message.from,`${wisata.OW_NAMA}`);
          });
        });
      client
      .simulateTyping(message.from,false);
      } else if (message.body === '!kategoriwisata' || message.body.startsWith('!kategoriwisata ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
        .simulateTyping(message.from,true);
            con.query("SELECT KATEGORI_NAMA FROM KATEGORI ORDER BY KATEGORI_NAMA", function (err, result) {
              if (err) throw err;
              console.log(result),
              result.forEach(wisata => {
                client.sendText(message.from,`${wisata.KATEGORI_NAMA}`);
            });
          });
            con.query("SELECT OW_NAMA FROM OW INNER JOIN KATEGORI ON KATEGORI.KATEGORI_NAMA = '" + wisata +"' AND OW_KATEGORI.OW_KODE = KATEGORI.KATEGORI_KODE AND OW.OW_KODE = OW_KATEGORI.OW_KODE ORDER BY OW.OW_NAMA", function (err, result) {
              if (err) throw err;
              console.log(result),
              result.forEach(wisata => {
                var kategori = `${wisata.OW_NAMA}`;
                client.sendText(message.from, kategori);
            });
          });
        client
        .simulateTyping(message.from,false);
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
                  con.query("SELECT KEC.KEC_NAMA, DES.DES_NAMA FROM KEC, DES WHERE KEC.KEC_KODE = '" + kecamatan + "' AND DES.DES_KODE = '" + desa + "'", function (err, result) {
                  if (err) throw err;
                  console.log(result);
                  result.forEach(daerah => { 
                    var nama_kecamatan = `${daerah.KEC_NAMA},`;
                    var nama_desa = `${daerah.DES_NAMA}.`;
                    client.sendText(message.from,`Berada di Kecamatan ` + nama_kecamatan + `Desa `+ nama_desa);
                    client.sendText(message.from,`${wisata.DESKRIPSI}`);
                    client.sendText(message.from,`Rute untuk menuju lokasi ${wisata.CARA_MENCAPAI}`);
                    client.sendText(message.from,`Fasilitas yang tersedia ${wisata.FASILITAS}`);
                    client.sendText(message.from,`Hal yang harus diperhatikan ${wisata.HAL_PERHATIAN}`);
                  });
                });
              });
      });
      client
      .simulateTyping(message.from,false);
    } else if (message.body.startsWith('!wisatadaerah ') && message.isGroupMsg === false) {
      let wisata = message.body.split(' ')[1];

      client
      .simulateTyping(message.from,true);
        con.query("SELECT OW_NAMA FROM OW INNER JOIN KEC ON KEC.KEC_NAMA = '" + wisata +"' AND OW.KEC_KODE = KEC.KEC_KODE ORDER BY OW.OW_NAMA", function (err, result) {
          if (err) throw err;
          console.log(result),
          result.forEach(wisata => {
            var kecamatan = `${wisata.OW_NAMA}`;
            client.sendText(message.from, kecamatan);
        });
      });
        con.query("SELECT OW_NAMA FROM OW INNER JOIN DES ON DES.DES_NAMA = '" + wisata +"' AND OW.DES_KODE = DES.DES_KODE ORDER BY OW.OW_NAMA", function (err, result) {
          if (err) throw err;
          console.log(result),
          result.forEach(wisata => {
            var desa = `${wisata.OW_NAMA}`;
            client.sendText(message.from, desa);
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
      1. !daftarwisata
      2. !kategoriwisata atau !kategoriwisata 'jenis wisata'
      3. !cariwisata 'nama wisata'
      4. !wisatadaerah 'nama daerah'
      *Tanpa tanda petik*`)
    }
  });
  client.onIncomingCall(async (call) => {
    console.log(call);
    client.sendText(call.peerJid, "Mohon maaf layanan ini tidak bisa menerima panggilan.");
  });
});
}