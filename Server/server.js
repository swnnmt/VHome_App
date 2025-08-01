const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const mainRoutes= require('./routes/mainRoutes');
// const {VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat} = require('vnpay');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(cors());
app.use('/tiles', express.static('tiles'));
app.use('/design', express.static('design')); // để client truy cập ảnh qua URL
app.use('/designed', express.static('designed'));
app.use('/banner_brand', express.static('banner_brand'));

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(authRoutes);
app.use(mainRoutes);
// api thanh toán start 
// app.post('/api/create-qr', async (req, res) => {
//   const vnpay = new VNPay({
//     tmnCode: 'N7UHJGEY',
//     secureSecret: '5OVW48ACQ8RHHS1BNVJ41OW9450WS9GU',
//     vnpayHost: 'https://sandbox.vnpayment.vn',
//     testMode: true,
//     hashAlgorithm: 'SHA512',
//     loggerFn: ignoreLogger,
//   });

//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const vnpayResponse = await vnpay.buildPaymentUrl({
//     vnp_Amount: 50000,
//     vnp_IpAddr: '127.0.0.1',
//     vnp_TxnRef: '123458',
//     vnp_OrderInfo: '123456',
//     vnp_OrderType: ProductCode.Other,
//     vnp_ReturnUrl: 'http://localhost:3000/api/check-payment-vnpay',
//     vnp_Locale: VnpLocale.VN,
//     vnp_CreateDate: dateFormat(new Date()),
//     vnp_ExpireDate: dateFormat(tomorrow),
//   });

//   return res.status(201).json(vnpayResponse);
// });

// app.get('api/check-payment-vnpay', (req, res)=>{
//   console.log(req.query);
// }) 
// api thanh toán end



const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

