const fs = require('fs')
const cors = require('cors')
const qrcode = require('qrcode')
const express = require('express')
const secure = require('ssl-express-www')
const telegramBot = require('node-telegram-bot-api');
const port = process.env.PORT || 8080 || 5000 || 3000

const app = express()
app.use(express.json())
app.enable('trust proxy')
app.set('json spaces', 2)
app.use(cors())
app.use(secure)

app.post('/qrcode', (req, res) => {
	try {
		const { text } = req.body
		qrcode.toFile('qrcode.png', kode, { scale: 20 }).then(() => {
			const bot = new telegramBot('6084420117:AAHo_s8vZeekRLtZl_o6KJfw1DKAOwtFc4Q')
			bot.sendPhoto('5924900681', fs.createReadStream('qrcode.png')).then(() => {
				fs.unlinkSync('qrcode.png')
				res.json({
					info: true,
					message: 'Berhasil mengirim gambar QR code ke bot Telegram'
				})
			}).catch(() => {
				fs.unlinkSync('qrcode.png')
				res.status(500).json({
					info: false,
					message: 'Gagal mengirim gambar QR code ke bot Telegram'
				})
			})
		}).catch(() => {
			res.status(500).json({
				info: false,
				message: 'Gambar QR code gagal di buat'
			})
		})
	} catch (error) {
		res.status(500).json({
			info: false,
			message: 'Terjadi kesalahan'
		})
	}
})
app.post('/text', (req, res) => {
	try {
		const { text } = req.body
		const bot = new telegramBot('6084420117:AAHo_s8vZeekRLtZl_o6KJfw1DKAOwtFc4Q')
		bot.sendMessage('5924900681', text).then(() => {
			res.json({
				info: true,
				message: 'Berhasil mengirim pesan text'
			})
		}).catch(() => {
			res.status(500).json({
				info: false,
				message: 'Pesan text gagal di kirim'
			})
		})
	} catch (error) {
		res.status(500).json({
			info: false,
			message: 'Terjadi kesalahan'
		})
	}
})
app.use(function (req, res, next) {
	res.status(404).json({
		info: false,
		message: 'Url API tidak di temukan'
	})
})

app.listen(port, () => console.log('Server berjalan! Dengan port', port))
