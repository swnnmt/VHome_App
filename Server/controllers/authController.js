const User = require('../models/VHome_User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail');


exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email là bắt buộc' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email, code);

    res.status(200).json({
      message: 'Mã xác thực đã được gửi về email',
      code, 
    });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ message: 'Không thể gửi email', error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const {name, email, password , incode, aucode} = req.body;
    if (incode == aucode){
      const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      balance: 15000,
      count: 3,
    });

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ user: userData });

    }
    else{
      return res.status(400).json({ message: 'Mã xác thực không đúng' });
    }
    
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.signup_mul = async (req, res) => {
  try {
    const users = req.body; // Nhận mảng người dùng
    if (!Array.isArray(users)) {
      return res.status(400).json({ message: 'Dữ liệu phải là mảng người dùng' });
    }

    const results = [];

    for (const userData of users) {
      const { name, email, password, incode, aucode } = userData;

      if (incode !== aucode) {
        results.push({ email, status: 'failed', reason: 'Mã xác thực không đúng' });
        continue;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        results.push({ email, status: 'failed', reason: 'Email đã tồn tại' });
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        balance: 15000,
        count: 3,
      });

      const { password: pw, ...userDataSaved } = user.toObject();
      results.push({ email, status: 'success', user: userDataSaved });
    }

    res.status(200).json({ results });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.status(200).json({ user });
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.status(200).json(user);
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
// update
exports.topup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền nạp phải lớn hơn 0.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    // Xác định combo dựa theo amount
    let combo = null;
    let addedCount = 0;

    if (amount === 10000) {
      combo = 'basic';
      addedCount = 2;
    } else if (amount === 20000) {
      combo = 'standard';
      addedCount = 5;
    } else if (amount === 99000) {
      combo = 'pro';
      addedCount = 999999; // hoặc thiết lập combo hết hạn sau 1 tháng nếu bạn muốn
    } else {
      return res.status(400).json({ message: 'Số tiền không tương ứng với gói combo nào.' });
    }

    user.balance += amount;
    user.count += addedCount;
    user.combo = combo;

    if (!user.firstup) {
      user.firstup = true;
    }

    await user.save();

    res.json({
      message: 'Nạp tiền thành công!',
      combo,
      amount,
      addedCount,
      count: user.count,
      balance: user.balance,
      firstup: user.firstup,
    });
  } catch (err) {
    console.error('Topup error:', err);
    res.status(500).json({ message: 'Lỗi khi nạp tiền.', error: err.message });
  }
};


exports.useDesign = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    if (user.count <= 0) return res.status(400).json({ message: 'Bạn đã hết lượt thiết kế.' });
    if (user.balance < 5000) return res.status(400).json({ message: 'Không đủ số dư (cần 5.000đ).' });

    user.count -= 1;
    await user.save();

    res.json({
      message: 'Đã sử dụng lượt thiết kế thành công!',
      count: user.count,
      balance: user.balance,
    });
  } catch (err) {
    console.error('useDesign error:', err);
    res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.' });
    }

    // Kiểm tra độ mạnh mật khẩu mới
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ thường, chữ hoa và số.'
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, incode, aucode, newPassword } = req.body;

    if (!email || !incode || !aucode || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    if (incode !== aucode) {
      return res.status(400).json({ message: 'Mã xác thực không đúng.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.json({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};
exports.getAllEmails = async (req, res) => {
  try {
    const users = await User.find({}, 'email'); // chỉ lấy trường email
    const emails = users.map(user => user.email);

    res.status(200).json({ emails });
  } catch (err) {
    console.error('getAllEmails error:', err);
    res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};

exports.editCount = async (req, res) => {
  try {
    const updates = req.body; // Mảng [{ email, count }, ...]

    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'Dữ liệu phải là mảng các object chứa email và count.' });
    }

    // Duyệt và cập nhật từng người dùng
    const results = await Promise.all(
      updates.map(async ({ email, count }) => {
        const updatedUser = await User.findOneAndUpdate(
          { email },
          { $set: { count } },
          { new: true } // Trả về document sau khi cập nhật
        );
        return updatedUser;
      })
    );

    res.status(200).json({ message: 'Cập nhật count thành công.', updatedUsers: results });
  } catch (err) {
    console.error('editCount error:', err);
    res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};

exports.getUsersWithZeroCount = async (req, res) => {
  try {
    const users = await User.find({ count: 0 }).select('email count');

    res.status(200).json({
      message: 'Danh sách tài khoản có count = 0',
      users
    });
  } catch (err) {
    console.error('getUsersWithZeroCount error:', err);
    res.status(500).json({ message: 'Lỗi server.', error: err.message });
  }
};

