const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   GroupSettingChange,
   waChatKey,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal") 
const moment = require("moment-timezone") 
const fs = require("fs") 
const { color, bgcolor } = require('./lib/color')
const { help } = require('./lib/help')
const { donasi } = require('./lib/donasi')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:饾悜饾悩饾悗饾悕饾悇\n' 
            + 'ORG: Owner RYOBOT;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=6282157581762:+62 821-5758-1762\n' 
            + 'END:VCARD' 
prefix = '#'
blocked = []          

/********** LOAD FILE **************/

/********** END FILE ***************/
  
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const bulan = arrayBulan[moment().format('MM') - 1]
const config = {
    XBOT: '鉂夝潗戰潗橉潗庰潗侌潗庰潗撯潐', 
    instagram: 'https://instagram.com/ff.ryone', 
    nomer: 'wa.me/6282157581762',
    youtube: 'Comming soon', 
    whatsapp: 'Comming soon', 
    tanggal: `TANGGAL: ${moment().format('DD')} ${bulan} ${moment().format('YYYY')}`,
    waktu: time
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}


const { tanggal, waktu, instagram, whatsapp, youtube, nomer, ontime } = config



const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code is ready, subrek dulu yak ambipi team`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();

// client.on('user-presence-update', json => console.log(json.id + ' presence is => ' + json.type)) || console.log(`${time}: Bot by ig:@affis_saputro123`)

client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Hallo @${num.split('@')[0]}\Selamat datang di group *${mdata.subject}* yang betah ya di sini`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
	icture(`${num.split('@')[0]}@c.us`)

				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `akhirnya beban group berkurang 饾煭,bye bye馃コ @${num.split('@')[0]} jasamu akan di kubur dalam虏`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '鉂潡鉂� 饾棯饾棓饾棞饾棫, 饾椆饾棶饾棿饾椂 饾椊饾椏饾椉饾榾饾棽饾榾',
				success: '锔忊潿 鉁� 鉂� 饾榾饾槀饾棸饾棸饾棽饾榾饾榾 馃枻',
				error: {
					stick: 'Yah gagal ;(, coba ulangi ^_^',
					Iv: '饾棤饾棶饾棶饾棾 饾椆饾椂饾椈饾椄 饾榿饾椂饾棻饾棶饾椄 饾槂饾棶饾椆饾椂饾棻鈽癸笍'
				},
				only: {
					group: '鉂潡鉂� 饾棜饾棩饾棦饾棬饾棧 饾棦饾棥饾棢饾棳 ',
					ownerG: '鉂潡鉂� 饾棦饾棯饾棥饾棙饾棩 饾棦饾棥饾棢饾棳 ',
					ownerB: '鉂潡鉂�  饾悜饾悩饾悗饾悕饾悇 饾棦饾棥饾棢饾棳 ',
					admin: '鉂潡鉂� 饾棓饾棗饾棤饾棞饾棥 饾棦饾棥饾棢饾棳 ',
					Badmin: '鉂潡鉂� 饾棔饾棦饾棫 饾棝饾棓饾棩饾棬饾棪 饾棟饾棓饾棗饾棞 饾棓饾棗饾棤饾棞饾棥 '
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["6282157581762@s.whatsapp.net"] 
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'bisakah':
					bisakah = body.slice(1)
					const bisa =['Bisa','Tidak Bisa','Coba Ulangi']
					const keh = bisa[Math.floor(Math.random() * bisa.length)]
					client.sendMessage(from, 'Pertanyaan : *'+bisakah+'*\n\nJawaban : '+ keh, text, { quoted: mek })
					break
				case 'kapan':
					kapankah = body.slice(1)
					const kapan =['Besok','Lusa','Tadi','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi']
					const koh = kapan[Math.floor(Math.random() * kapan.length)]
					client.sendMessage(from, 'Pertanyaan : *'+kapankah+'*\n\nJawaban : '+ koh, text, { quoted: mek })
					break
           case 'apakah':
					apakah = body.slice(1)
					const apa =['Iya','Tidak','Bisa Jadi','Coba Ulangi']
					const kah = apa[Math.floor(Math.random() * apa.length)]
					client.sendMessage(from, 'Pertanyaan : *'+apakah+'*\n\nJawaban : '+ kah, text, { quoted: mek })
					break
				case 'rate':
					rate = body.slice(1)
					const ra =['4','9','17','28','34','48','59','62','74','83','97','100','29','94','75','82','41','39']
					const te = ra[Math.floor(Math.random() * ra.length)]
					client.sendMessage(from, 'Pertanyaan : *'+rate+'*\n\nJawaban : '+ te+'%', text, { quoted: mek })
					break
          case 'speed':
          case 'ping':
            await client.sendMessage(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
				case 'help':
				case 'menu':
					hisil = fs.readFileSync('./assets/menuimg.jpg')
					client.sendMessage(from, hisil, image, {quoted: mek, caption: help(prefix), text})
					break
				case 'donasi':
				case 'donate':
					client.sendMessage(from, donasi(), text)
				break
				case 'Iri':
		        case 'iri?':
                case 'iri':
                   client.sendMessage(from, 'sound' + 'iri.mp3', {quoted: mek, ptt:true})
               break
            case 'nulis': 
				case 'tulis': ini
					if (args.length < 1) return reply('aku suruh nulis apa kak?')
                                        if (!isUser) return reply(mess.only.daftarB)
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nulis?text=halo&apikey=BotWeA`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
            case 'bcgc':
					client.updatePresence(from, Presence.composing) 
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('.......')
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of groupMembers) {
							client.sendMessage(_.jid, buff, image, {caption: `*銆� 饾懝饾拃饾懚饾懇饾懚饾懟 銆�*\n*Group* : ${groupName}\n\n${body.slice(6)}`})
						}
						reply('')
					} else {
						for (let _ of groupMembers) {
							sendMess(_.jid, `*銆� 饾懝饾拃饾懚饾懇饾懚饾懟 銆�*\n*Group* : ${groupName}\n\n${body.slice(6)}`)
						}
						reply('Suksess broadcast group')
					}
            case 'abgjago':
            case 'abangjago':
                client.sendMessage(from, 'sound' + 'abangjago'+'mp3', {quoted: mek, ptt:true})
                break
            case 'tarekses':
            case 'tariksis':
            case 'tareksis':
            case 'tareeksis':
            case 'tareekses':
                client.sendMessage(from, './sound'+'/tarekses.mp3', {quoted: mek, ptt:true})
                break
            case 'welotka':
            case 'welutka':
            case 'kangcopet':
                client.sendMessage(dari, './sound'+'welot'+'mp3',{quoted: mek, ptt:true})
                break
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `*Nama bot* : ${me.name}\n*OWNER* : *饾悜饾悩饾悗饾悕饾悇*\n*AUTHOR* : 饾悜饾悩饾悗饾悕饾悇\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist': 
					teks = '饾棔饾棢饾棦饾棖饾棡 饾棢饾棞饾棪饾棫 :\n'
					for (let block of blocked) {
						teks += `鈹ｂ灑 @${block.split('@')[0]}\n`
					}
					teks += `饾棫饾椉饾榿饾棶饾椆 : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
          case 'logowolf':
					var gh = body.slice(11)
					var teks1 = gh.split("|")[0];
					var teks2 = gh.split("|")[1];
					if (args.length < 1) return reply(`teksnya mana? contoh ${prefix}logowolf Aris|Ganss`)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=wolflogo1&text1=${teks1}&text2=${teks2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
                case 'hidetag':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply('kamu siapa?')
					var value = body.slice(9)
					var group = await client.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: mek
					}
					client.sendMessage(from, options, text)
					break
                case 'quotemaker':
					var gh = body.slice(12)
					var quote = gh.split("|")[0];
					var wm = gh.split("|")[1];
					var bg = gh.split("|")[2];
					const pref = `Usage: \n${prefix}quotemaker teks|watermark|theme\n\nEx :\n${prefix}quotemaker ini contoh|bicit|random`
					if (args.length < 1) return reply(pref)
					reply(mess.wait)
					anu = await fetchJson(`https://terhambar.com/aw/qts/?kata=${quote}&author=${wm}&tipe=${bg}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {caption: 'Nih Woe', quoted: mek})
					break
                 case 'nulis': 
				case 'tulis': ini
					if (args.length < 1) return reply('饾悮饾悿饾惍 饾惉饾惍饾惈饾惍饾悺 饾惂饾惍饾惀饾悽饾惉 饾悮饾惄饾悮 饾悿饾悮饾悿?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
                 case 'ytmp3':
					if (args.length < 1) return reply('Urlnya mana um?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
                                        if (!isDaftar) return reply(mess.only.daftarB)
     					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/yta?url=${args[0]}&apiKey=BotWeA`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
                 case 'phlogo':
					var gh = body.slice(9)
					var gbl1 = gh.split("|")[0];
					var gbl2 = gh.split("|")[1];
					if (args.length < 1) return reply('Teksnya mana um')
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/textpro?theme=pornhub&text1=${gbl1}&text2=${gbl2}`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image, {quoted: mek})
					break
                case 'truth':
					const trut =['Pernah suka sama siapa aja? berapa lama?','Kalau boleh atau kalau mau, di gc/luar gc siapa yang akan kamu jadikan sahabat?(boleh beda/sma jenis)','apa ketakutan terbesar kamu?','pernah suka sama orang dan merasa orang itu suka sama kamu juga?','Siapa nama mantan pacar teman mu yang pernah kamu sukai diam diam?','pernah gak nyuri uang nyokap atau bokap? Alesanya?','hal yang bikin seneng pas lu lagi sedih apa','pernah cinta bertepuk sebelah tangan? kalo pernah sama siapa? rasanya gimana brou?','pernah jadi selingkuhan orang?','hal yang paling ditakutin','siapa orang yang paling berpengaruh kepada kehidupanmu','hal membanggakan apa yang kamu dapatkan di tahun ini','siapa orang yang bisa membuatmu sange','siapa orang yang pernah buatmu sange','(bgi yg muslim) pernah ga solat seharian?','Siapa yang paling mendekati tipe pasangan idealmu di sini','suka mabar(main bareng)sama siapa?','pernah nolak orang? alasannya kenapa?','Sebutkan kejadian yang bikin kamu sakit hati yang masih di inget','pencapaian yang udah didapet apa aja ditahun ini?','kebiasaan terburuk lo pas di sekolah apa?']
					const ttrth = trut[Math.floor(Math.random() * trut.length)]
					truteh = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
					client.sendMessage(from, truteh, image, { caption: '*Truth*\n\n'+ ttrth, quoted: mek })
					break
				case 'dare':
					const dare =['Kirim pesan ke mantan kamu dan bilang "aku masih suka sama kamu','telfon crush/pacar sekarang dan ss ke pemain','pap ke salah satu anggota grup','Bilang "KAMU CANTIK BANGET NGGAK BOHONG" ke cowo','ss recent call whatsapp','drop emot "馃馃挩" setiap ngetik di gc/pc selama 1 hari','kirim voice note bilang can i call u baby?','drop kutipan lagu/quote, terus tag member yang cocok buat kutipan itu','pake foto sule sampe 3 hari','ketik pake bahasa daerah 24 jam','ganti nama menjadi "gue anak lucinta luna" selama 5 jam','chat ke kontak wa urutan sesuai %batre kamu, terus bilang ke dia "i lucky to hv you','prank chat mantan dan bilang " i love u, pgn balikan','record voice baca surah al-kautsar','bilang "i hv crush on you, mau jadi pacarku gak?" ke lawan jenis yang terakhir bgt kamu chat (serah di wa/tele), tunggu dia bales, kalo udah ss drop ke sini','sebutkan tipe pacar mu!','snap/post foto pacar/crush','teriak gajelas lalu kirim pake vn kesini','pap mukamu lalu kirim ke salah satu temanmu','kirim fotomu dengan caption, aku anak pungut','teriak pake kata kasar sambil vn trus kirim kesini','teriak " anjimm gabutt anjimmm " di depan rumah mu','ganti nama jadi " BOWO " selama 24 jam','Pura pura kerasukan, contoh : kerasukan maung, kerasukan belalang, kerasukan kulkas, dll']
					const der = dare[Math.floor(Math.random() * dare.length)]
					tod = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
					client.sendMessage(from, tod, image, { quoted: mek, caption: '*Dare*\n\n'+ der })
					break				
				case 'waifu':
				   anu = await fetchJson(`https://arugaz.herokuapp.com/api/waifu`)
				   buf = await getBuffer(anu.image)
				   texs = ` *anime name* : ${anu.name} \n*deskripsi* : ${anu.desc} \n*source* : ${anu.source}`
				   client.sendMessage(from, buf, image, { quoted: mek, caption: `${texs}`})
				break
				case 'anime':
					teks = body.slice(7)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/anime?query=${teks}`, {method: 'get'})
					reply('anime nya ni '+teks+' adalah :\n\n'+anu.title)
					break
                case 'neko':
                    anu = await fetchJson(`https://arugaz.herokuapp.com/api/nekonime` , {method: 'get'})
                    buf = await getBuffer(anu.result)
                    client.sendMessage(from, buf, image, { quoted: mek, caption: 'ih wibu'})
                break
                case 'dewabatch':
                    teks = body.slice(11)
                    anu = await fetchJson(`https://arugaz.herokuapp.com/api/dewabatch?q=${teks}` , {method: 'get'})
                    thum = await getBuffer(anu.thumb)
                    client.sendMessage(from, thum, image, {quoted: mek, caption: `${anu.result}`})
                 break
                case 'bug':
                     const pesan = body.slice(5)
                      if (pesan.length > 300) return client.sendMessage(from, 'Maaf Teks Terlalu Panjang, Maksimal 300 Teks', msgType.text, {quoted: mek})
                        var nomor = mek.participant
                       const teks1 = `*[REPORT]*\nNomor : @${nomor.split("@s.whatsapp.net")[0]}\nPesan : ${pesan}`
                      var options = {
                         text: teks1,
                         contextInfo: {mentionedJid: [nomor]},
                     }
                    client.sendMessage('6282157581762@s.whatsapp.net', options, text, {quoted: mek})
                    reply('Masalah telah di laporkan ke owner BOT, laporan palsu/main2 tidak akan ditanggapi.')
                    break
                case 'ssweb':
					if (args.length < 1) return reply('Urlnya mana om')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/screenshotweb?url=${teks}`)
					buff = await getBuffer(anu.gambar)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
                case 'bucin':
					gatauda = body.slice(7)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc)
					break
		        case 'persengay':
					gatauda = body.slice(11)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					reply(anu.desc+anu.persen)
					break	
				case 'quotes':
					gatauda = body.slice(8)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/randomquotes`, {method: 'get'})
					reply(anu.quotes)
					break		
				case 'cerpen':
					gatauda = body.slice(8)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/cerpen`, {method: 'get'})
					reply(anu.result.result)
					break
				case 'chord':
					if (args.length < 1) return reply('teks nya mana om')
					tels = body.slice(7)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/chord?q=${tels}`, {method: 'get'})
					reply(anu.result)
					break
                case 'lirik':
                    if (args.length < 1) return reply('judul lagu nya mana om')
                    teha = body.slice(7)
                    anu = await fetchJson(`https://arugaz.herokuapp.com/api/lirik?judul=${teha}` , {method: 'get'})
                    reply(anu.result)
                break
                case 'pokemon':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=pokemon`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
                case 'anjing':
					anu = await fetchJson(`https://api.fdci.se/rep.php?gambar=anjing`, {method: 'get'})
					reply(mess.wait)
					var n = JSON.parse(JSON.stringify(anu));
					var nimek =  n[Math.floor(Math.random() * n.length)];
					pok = await getBuffer(nimek)
					client.sendMessage(from, pok, image, { quoted: mek })
					break
                case 'spamcall':
                   if (args.length < 1) return ('masukan nomer tujuan bambang')
                   weha = body.slice(10)
                   anu = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${weha}` , {method: 'get'})
                   client.sendMessage(from, anu.logs, text, {quoted: mek})
                 break
                case 'indohot':
                   if (!isNsfw) return reply('nsfw gak aktif')
                   anu = await fetchJson(`https://arugaz.herokuapp.com/api/indohot`, {method: 'get'})
                   if (anu.error) return reply(anu.error)
                   hasil = `*judul* \n${anu.result.judul} *genre* \n${anu.result.genre} *durasi* \n${anu.result.durasi} *url* \n${anu.result.url}`
                   client.sendMessage(from, hasil, text, {quoted: mek})
                   break
				case 'ytmp4':
					if (args.length < 1) return reply('Urlnya mana um?')
			isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek})
					break
                case 'text3d':
              	    if (args.length < 1) return reply('teksnya mana kak?')
                    teks = `${body.slice(8)}`
                    if (teks.length > 10) return client.sendMessage(from, 'Teksnya kepanjangan, Maksimal 10 kalimat', text, {quoted: mek})
                    buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${teks}`, {method: 'get'})
                    client.sendMessage(from, buff, image, {quoted: mek, caption: `${teks}`})
			     	break
			    case 'fototiktok':
                    gatauda = body.slice(12)
                    anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/tiktokpp?user=${gatauda}`)
			        buff = await getBuffer(anu.result)
                    reply(anu.result)
			        break
			    case 'map':
                anu = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${body.slice(5)}`, {method: 'get'})
                buffer = await getBuffer(anu.gambar)
                client.sendMessage(from, buffer, image, {quoted: mek, caption: `${body.slice(5)}`})
				break
                case 'kbbi':
					if (args.length < 1) return reply('Apa yang mau dicari um?')
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/kbbi?search=${body.slice(6)}`, {method: 'get'})
					reply('Menurut Kbbi:\n\n'+anu.result)
					break
                case 'artinama':
					if (args.length < 1) return reply('Apa yang mau dicari um?')
					anu = await fetchJson(`https://mnazria.herokuapp.com/api/arti?nama=${body.slice(10)}`, {method: 'get'})
					reply('Menurut nama:\n\n'+anu.result)
					break
				case 'ocr': 
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('饾椄饾椂饾椏饾椂饾椇 饾棾饾椉饾榿饾椉 饾棻饾棽饾椈饾棿饾棶饾椈 饾棸饾棽饾椊饾榿饾椂饾椉饾椈 ${prefix}饾椉饾棸饾椏')
					}
					break
				case 'stiker': 
				case 'sticker':
				case 's':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`Yah gagal ;(, coba ulangi ^_^`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
							} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau reply/tag gambar`)
					}
					break
				case 'getses':
            	if (!isOwner) return reply(mess.only.ownerB)
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', '^_^...', id)
            break	
				case 'gtts':	
				case 'tts':
					if (args.length < 1) return client.sendMessage(from, 'Diperlukan kode bahasa!!', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Mana teks yang ma di jadiin suara? suara saya kah:v?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 300
					? reply('lah teks nya kepanjangan bambang馃槫')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Yah gagal ;(, coba ulangi ^_^')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`饾棧饾椏饾棽饾棾饾椂饾槄 饾棷饾棽饾椏饾椀饾棶饾榾饾椂饾椆 饾棻饾椂 饾槀饾棷饾棶饾椀 饾椇饾棽饾椈饾椃饾棶饾棻饾椂 : ${prefix}`)
					break 
				case 'hilih': 
					if (args.length < 1) return reply('kasih teks lah^_^!!!')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, '饾槀饾榾饾棽饾椏饾椈饾棶饾椇饾棽 饾椇饾棶饾椈饾棶 ?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('[饾棙饾棩饾棩饾棦饾棩] 饾椄饾棽饾椇饾槀饾椈饾棿饾椄饾椂饾椈饾棶饾椈 饾槀饾榾饾棽饾椏饾椈饾棶饾椇饾棽 饾榿饾椂饾棻饾棶饾椄 饾槂饾棶饾椆饾椂饾棻')
					}
					break
				case 'fitnah':
          case 'fake':
				if (!isGroup) return reply(mess.only.group)
				if (args.length < 1) return reply(`Usage :\n${prefix}fitnah [@tag|pesan|balasanbot]]\n\nEx : \n${prefix}fitnah @tagmember|hai|hai juga`)
				var gh = body.slice(8)
				mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					var replace = gh.split("|")[0];
					var target = gh.split("|")[1];
					var bot = gh.split("|")[2];
					client.sendMessage(from, `${bot}`, text, {quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target}` }}})
					break
                 case 'linkgc':
				    if (!isGroup) return reply(mess.only.group)
				    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
				    linkgc = await client.groupInviteCode (from)
				    yeh = `https://chat.whatsapp.com/${linkgc}\n\nlink Group *${groupName}*`
				    client.sendMessage(from, yeh, text, {quoted: mek})
			        break
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `鈹ｂ灔 @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'clearall':
					if (!isOwner) return reply(' *LU SIAPA* ?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('饾棸饾椆饾棽饾棶饾椏 饾棶饾椆饾椆 饾榾饾槀饾椄饾榾饾棽饾榾 饾槅饾棶饾椀  :)')
					break
			       case 'block':
				 client.updatePresence(from, Presence.composing) 
				 client.chatRead (from)
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.blockUser (`${body.slice(7)}@c.us`, "add")
					client.sendMessage(from, `perintah Diterima, memblokir ${body.slice(7)}@c.us`, text)
					break
                    case 'unblock':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				    client.blockUser (`${body.slice(9)}@c.us`, "remove")
					client.sendMessage(from, `饾椊饾棽饾椏饾椂饾椈饾榿饾棶饾椀 饾棗饾椂饾榿饾棽饾椏饾椂饾椇饾棶, 饾椇饾棽饾椇饾棷饾槀饾椄饾棶 ${body.slice(9)}@c.us`, text)
				break
				case 'leave': 
				if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
				await client.leaveGroup(from, '饾棔饾槅饾棽饾棽', groupId)
                    break
				case 'bc': 
					if (!isOwner) return reply(' *LU SIAPA* ?') 
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `鉂�1锟�7 饾樈饾檷饾檴饾樇饾樋饾樉饾樇饾檸饾檹 鉂痋n\n${body.slice(4)}`})
						}
						reply('饾櫒饾櫔饾櫂饾櫂饾櫄饾櫒饾櫒 饾櫁饾櫑饾櫎饾櫀饾櫃饾櫂饾櫀饾櫒饾櫓 ')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `鉂�1锟�7 饾樈饾檷饾檴饾樇饾樋饾樉饾樇饾檸饾檹 鉂痋n\n${body.slice(4)}`)
						}
						reply('饾櫒饾櫔饾櫂饾櫂饾櫄饾櫒饾櫒 饾櫁饾櫑饾櫎饾櫀饾櫃饾櫂饾櫀饾櫒饾櫓 ')
					}
					break
			   	case 'setpp': 
                        if (!isGroup) return reply(mess.only.group)
                       if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                       media = await client.downloadAndSaveMediaMessage(mek)
                         await client.updateProfilePicture (from, media)
                        reply('饾棪饾槀饾椄饾榾饾棽饾榾 饾椇饾棽饾椈饾棿饾棿饾棶饾椈饾榿饾椂 饾椂饾棸饾椉饾椈 饾棜饾椏饾槀饾椊')
                break						
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
					@s.whatsapp.net`
						cli(e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
					case 'oadd':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *LU SIAPA* ?')
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
					@s.whatsapp.net`
						cli(e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
					case 'grup':
					case 'group':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args[0] === 'buka') {
					    reply(`饾棔饾棽饾椏饾椀饾棶饾榾饾椂?? 饾棤饾棽饾椇饾棷饾槀饾椄饾棶 饾棜饾椏饾椉饾槀饾椊 饾棫饾椉饾棻`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					} else if (args[0] === 'tutup') {
						reply(`饾棔饾棽饾椏饾椀饾棶饾榾饾椂饾椆 饾棤饾棽饾椈饾槀饾榿饾槀饾椊 饾棜饾椏饾椉饾槀饾椊 饾棫饾椉饾棻`)
						client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
                    
            case 'admin':
            case 'owner':
            case 'creator':
                  client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
       client.sendMessage(from, 'Tuh nomer owner ku >_<, jangan spam atau ku block kamu',MessageType.text, { quoted: mek} )
           break    
           case 'setname':
                if (!isGroup) return reply(mess.only.group)
			    if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                client.groupUpdateSubject(from, `${body.slice(9)}`)
                client.sendMessage(from, 'Succes, Ganti Nama Grup', text, {quoted: mek})
                break
                case 'setdesc':
                if (!isGroup) return reply(mess.only.group)
			    if (!isGroupAdmins) return reply(mess.only.admin)
				if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                client.groupUpdateDescription(from, `${body.slice(9)}`)
                client.sendMessage(from, 'Succes, Ganti Deskripsi Grup', text, {quoted: mek})
                break
           case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('饾棫饾棶饾棿 饾榿饾棶饾椏饾棿饾棽饾榿!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `饾槅饾棶饾椀饾椀 饾椃饾棶饾棷饾棶饾榿饾棶饾椈 饾棶饾棻饾椇饾椂饾椈 饾椄饾棶饾椇饾槀 饾榾饾槀饾棻饾棶饾椀 饾棻饾椂 饾棸饾椉饾椊饾椉饾榿馃弮 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`饾槅饾棶饾椀饾椀 @${mentioned[0].split('@')[0]} 饾椃饾棶饾棷饾棶饾榿饾棶饾椈 饾棶饾棻饾椇饾椂饾椈 饾椄饾棶饾椇饾槀 饾榾饾槀饾棻饾棶饾椀 饾棻饾椂 饾棸饾椉饾椊饾椉饾榿馃弮`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
          case 'odemote':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *LU SIAPA* ?')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('饾棫饾棶饾棿 饾榿饾棶饾椏饾棿饾棽饾榿!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `饾槅饾棶饾椀饾椀 饾椃饾棶饾棷饾棶饾榿饾棶饾椈 饾棶饾棻饾椇饾椂饾椈 饾椄饾棶饾椇饾槀 饾榾饾槀饾棻饾棶饾椀 饾棻饾椂 饾棸饾椉饾椊饾椉饾榿馃弮 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`饾槅饾棶饾椀饾椀 @${mentioned[0].split('@')[0]} 饾椃饾棶饾棷饾棶饾榿饾棶饾椈 饾棶饾棻饾椇饾椂饾椈 饾椄饾棶饾椇饾槀 饾榾饾槀饾棻饾棶饾椀 饾棻饾椂 饾棸饾椉饾椊饾椉饾榿馃弮`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('饾棫饾棶饾棿 饾榿饾棶饾椏饾棿饾棽饾榿!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `饾棪饾棽饾椆饾棶饾椇饾棶饾榿馃コ 饾棶饾椈饾棻饾棶 饾椈饾棶饾椂饾椄 饾椇饾棽饾椈饾椃饾棶饾棻饾椂 饾棶饾棻饾椇饾椂饾椈 饾棿饾椏饾椉饾槀饾椊 (+_+) :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`饾棪饾棽饾椆饾棶饾椇饾棶饾榿馃コ @${mentioned[0].split('@')[0]} 饾棶饾椈饾棻饾棶 饾椈饾棶饾椂饾椄 饾椇饾棽饾椈饾椃饾棶饾棻饾椂 饾棶饾棻饾椇饾椂饾椈 饾棿饾椏饾椉饾槀饾椊 (+_+)`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break	
               case 'opromote':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *LU SIAPA* ?')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('饾棫饾棶饾棿 饾榿饾棶饾椏饾棿饾棽饾榿!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `饾棪饾棽饾椆饾棶饾椇饾棶饾榿馃コ 饾棶饾椈饾棻饾棶 饾椈饾棶饾椂饾椄 饾椇饾棽饾椈饾椃饾棶饾棻饾椂 饾棶饾棻饾椇饾椂饾椈 饾棿饾椏饾椉饾槀饾椊 (+_+) :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`饾棪饾棽饾椆饾棶饾椇饾棶饾榿馃コ @${mentioned[0].split('@')[0]} 饾棶饾椈饾棻饾棶 饾椈饾棶饾椂饾椄 饾椇饾棽饾椈饾椃饾棶饾棻饾椂 饾棶饾棻饾椇饾椂饾椈 饾棿饾椏饾椉饾槀饾椊 (+_+)`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break	
			     	case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('饾棫饾棶饾棿 饾榿饾棶饾椏饾棿饾棽饾榿 饾槅饾棶饾椈饾棿 饾椂饾椈饾棿饾椂饾椈 饾棻饾椂 饾榿饾棽饾椈饾棻饾棶饾椈饾棿!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `饾棓饾榾饾棽饾椄 饾棻饾棶饾椊饾棶饾榿 饾椇饾棶饾椄饾棶饾椈饾棶饾椈,饾椉饾榿饾槃 饾椄饾椂饾棸饾椄 馃弮 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`饾棓饾榾饾棽饾椄 饾棻饾棶饾椊饾棶饾榿 饾椇饾棶饾椄饾棶饾椈饾棶饾椈,饾椉饾榿饾槃 饾椄饾椂饾棸饾椄 @${mentioned[0].split('@')[0]} 馃弮`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
          case 'okick':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *LU SIAPA* ?')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('饾棫饾棶饾棿 饾榿饾棶饾椏饾棿饾棽饾榿 饾槅饾棶饾椈饾棿 饾椂饾椈饾棿饾椂饾椈 饾棻饾椂 饾榿饾棽饾椈饾棻饾棶饾椈饾棿!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = ''
						for (let _ of mentioned) {
							teks += `饾棓饾榾饾棽饾椄 饾棻饾棶饾椊饾棶饾榿 饾椇饾棶饾椄饾棶饾椈饾棶饾椈,饾椉饾榿饾槃 饾椄饾椂饾棸饾椄 馃弮 :\n`
							teks += `@_.split('@')[0]`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`饾棓饾榾饾棽饾椄 饾棻饾棶饾椊饾棶饾榿 饾椇饾棶饾椄饾棶饾椈饾棶饾椈,饾椉饾榿饾槃 饾椄饾椂饾棸饾椄 @${mentioned[0].split('@')[0]} 馃弮`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmin':
					if (!isGroup) return reply(mess.only.group)
					teks = `饾棢饾椂饾榾饾榿 饾棶饾棻饾椇饾椂饾椈 饾椉饾棾 饾棿饾椏饾椉饾槀饾椊 *${groupMetadata.subject}*\n饾棫饾椉饾榿饾棶饾椆 : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('饾棩饾棽饾椊饾椆饾槅/饾榿饾棶饾棿 饾榾饾榿饾椂饾棸饾椄饾棽饾椏 !')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Yah gagal ;(, coba ulangi ^_^')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '饾棻饾棶?? 饾椃饾棶饾棻饾椂 '})
						fs.unlinkSync(ran)
					})
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :饾槂')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('饾榾饾槀饾棻饾棶饾椀 饾棶饾椄饾榿饾椂饾棾 !!!')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('鉂�1锟�7 饾棪饾棬饾棡饾棪饾棙饾棪 鉂�1锟�7 饾棤饾棽饾椈饾棿饾棶饾椄饾榿饾椂饾棾饾椄饾棶饾椈 饾棾饾椂饾榿饾槀饾椏 饾榾饾椂饾椇饾椂 饾棻饾椂 饾棿饾椏饾椉饾槀饾椊 饾椂饾椈饾椂锔�1锟�7')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('鉂�1锟�7 饾棪饾棬饾棡饾棪饾棙饾棪 鉂�1锟�7 饾棤饾棽饾椈饾椉饾椈饾棶饾椄饾榿饾椂饾棾饾椄饾棶饾椈 饾棾饾椂饾榿饾槀饾椏 饾榾饾椂饾椇饾椂 饾棻饾椂 饾棿饾椏饾椉饾槀饾椊 饾椂饾椈饾椂锔忥笍')
					} else {
						reply(' *Ketik perintah 1 untuk mengaktifkan, 0 untuk menonaktifkan* \n饾棸饾椉饾椈饾榿饾椉饾椀: 饾榾饾椂饾椇饾椂饾椀 饾煭')
					}
					break
          case 'loli':
				if (isBanned) return reply(mess.only.benned)    
				if (!isUser) return reply(mess.only.userB)
				if (!isPublic) return reply(mess.only.public)
					if (!isGroup) return reply(mess.only.group)
					reply(mess.asik)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/randomloli`, {method: 'get'})
					var mi = JSON.parse(JSON.stringify(anu.result));
					var ku =  mi[Math.floor(Math.random() * mi.length)];
					nye = await getBuffer(ku)
					client.sendMessage(from, nye, image, { caption: '锟�9锟�7锟�9锟�6', quoted: mek })
					break
          case 'ownergrup':
				  case 'ownergroup':
               client.updatePresence(from, Presence.composing) 
              options = {
          text: `Owner Group ini adalah : @${from.split("-")[0]}`,
          contextInfo: { mentionedJid: [from] }
           }
           client.sendMessage(from, options, text, { quoted: mek } )
				break
           case 'quran':
					anu = await fetchJson(`https://api.banghasan.com/quran/format/json/acak`, {method: 'get'})
					quran = `${anu.acak.ar.teks}\n\n${anu.acak.id.teks}\nQ.S ${anu.surat.nama} ayat ${anu.acak.id.ayat}`
					client.sendMessage(from, quran, text, {quoted: mek})
					break
				case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :饾槂')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('饾榾饾槀饾棻饾棶饾椀 饾棶饾椄饾榿??饾棾 !!')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('鉂�1锟�7 饾棪饾棬饾棡饾棪饾棙饾棪 鉂�1锟�7 饾棤饾棽饾椈饾棿饾棶饾椄饾榿饾椂饾棾饾椄饾棶饾椈 饾棾饾椂饾榿饾槀饾椏 饾椈饾榾饾棾饾槃 饾棻饾椂 饾棿饾椏饾椉饾槀饾椊 饾椂饾椈饾椂')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('鉂�1锟�7 饾棪饾棬饾棡饾棪饾棙饾棪 鉂�1锟�7 饾棤饾棽饾椈饾椉饾椈饾棶饾椄饾榿饾椂饾棾饾椄饾棶饾椈 饾棾饾椂饾榿饾槀饾椏 饾椈饾榾饾棾饾槃 饾棻饾椂 饾棿饾椏饾椉饾槀饾椊 饾椂饾椈饾椂锔�1锟�7')
					} else {
						reply(' *Ketik perintah 1 untuk mengaktifkan, 0 untuk menonaktifkan* \n饾棸饾椉饾椈饾榿饾椉饾椀: 饾椈饾榾饾棾饾槃 饾煭')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Boo :饾槂')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('饾榾饾槀饾棻饾棶饾椀 饾棶饾椄饾榿饾椂饾棾 !!!')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('鉂�1锟�7 饾棪饾棬饾棡饾棪饾棙饾棪 鉂�1锟�7 饾棤饾棽饾椈饾棿饾棶饾椄饾榿饾椂饾棾饾椄饾棶饾椈 饾棾饾椂饾榿饾槀饾椏 饾槃饾棽饾椆饾棸饾椉饾椇饾棽/饾椆饾棽饾棾饾榿 饾棻饾椂 饾棿饾椏饾椉饾槀饾椊 饾椂饾椈饾椂锔�1锟�7')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('鉂�1锟�7 饾棪饾棬饾棡饾棪饾棙饾棪 鉂�1锟�7 饾棤饾棽饾椈饾椉饾椈饾棶饾椄饾榿饾椂饾棾饾椄饾棶饾椈 饾棾饾椂饾榿饾槀饾椏 饾槃饾棽饾椆饾棸饾椉饾椇饾棽/饾椆饾棽饾棾饾榿 饾棻饾椂 饾棿饾椏饾椉饾槀饾椊 饾椂饾椈饾椂锔�1锟�7')
					} else {
						reply(' *Ketik perintah 1 untuk mengaktifkan, 0 untuk menonaktifkan* \n *Contoh: ${prefix}welcome 1*')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(' *LU SIAPA* ?') 
					if (args.length < 1) return reply(' *TAG YANG MAU DI CLONE!!!* ')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply(' *Yah gagal ;(, coba ulangi ^_^* ')
					}
					break
          case 'join': 
            if (args.length < 2) return reply('Kirim perintah *!join linkgroup key*\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla abcde\nuntuk key kamu bisa mendapatkannya hanya dengan donasi 5k')
            const link = args[0]
            const key = args[0]
            const tGr = await client.getAllGroups
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            registerkey = ['aGFkaQ','cGFudGVYXN1r','am9pbmFzdQ','YWRtaW5pc3RyYXRvcg','YWRtaQ','b3duZXJib3Rvbmx5','YmFjb3Rhc3V3aw']
            if (!registeredkey.includes(key)) return reply('*key* salah! silahkan chat owner bot untuk mendapatkan key yang valid')
            const check = await client.inviteInfo(link)
            if (!isLink) return reply('berikan link yang benar')
            if (tGr.length > 20) return reply('Maaf jumlah group sudah maksimal!')
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => reply('Bot akan segera masuk!'))
            } else {
                reply'Link group tidak valid!')
            }
            break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply(' *KIRIM FOTO DENGAN CAPTIO OCR* ')
					}
					break
				default:
			if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
					}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
