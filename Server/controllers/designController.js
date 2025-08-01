const Design = require('../models/VHome_Design');
const path = require('path');
const fs = require('fs');
const createDesign = async (req, res) => {
  try {
    const {
      id_user,
      id_brand,
      paintCode,
      tileImage
    } = req.body;

    // `req.files` là object chứa cả originalImage và designedImage
    const originalImageFile = req.files?.originalImage?.[0];
    const designedImageFile = req.files?.designedImage?.[0];

    if (!id_user || !id_brand || !paintCode || !tileImage || !originalImageFile || !designedImageFile) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin và ảnh.' });
    }

    const originalImagePath = `/design/${originalImageFile.filename}`;
    const designedImagePath = `/designed/${designedImageFile.filename}`;

    const newDesign = new Design({
      id_user,
      id_brand,
      originalImage: originalImagePath,
      designedImage: designedImagePath,
      paintCode,
      tileImage
    });

    await newDesign.save();

    res.status(201).json({
      message: 'Tạo thiết kế thành công!',
      data: newDesign
    });
  } catch (error) {
    console.error('Lỗi khi tạo thiết kế:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server.' });
  }
};

const getDesignsByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;

    if (!id_user) {
      return res.status(400).json({ message: 'Thiếu id_user trong request.' });
    }

    const designs = await Design.find({ id_user });

    if (!designs.length) {
      return res.status(404).json({ message: 'Không tìm thấy thiết kế nào cho người dùng này.' });
    }

    res.status(200).json({
      message: 'Lấy thiết kế thành công.',
      data: designs
    });
  } catch (error) {
    console.error('Lỗi khi lấy thiết kế theo id_user:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server.' });
  }
};

// updateupdate
const updateDesignById = async (req, res) => {
  try {
    const { id_design } = req.params;
    const { id_brand, paintCode, tileImage } = req.body;

    const originalImageFile = req.files?.originalImage?.[0];
    const designedImageFile = req.files?.designedImage?.[0];

    // Tìm thiết kế cũ để lấy đường dẫn cũ (phục vụ xóa file nếu cần)
    const existingDesign = await Design.findById(id_design);
    if (!existingDesign) {
      return res.status(404).json({ message: 'Thiết kế không tồn tại.' });
    }

    // Cập nhật các trường cơ bản
    if (id_brand) existingDesign.id_brand = id_brand;
    if (paintCode) existingDesign.paintCode = paintCode;
    if (tileImage) existingDesign.tileImage = tileImage;

    // Nếu người dùng upload ảnh mới -> cập nhật đường dẫn + xóa ảnh cũ
    if (originalImageFile) {
      // Xóa ảnh cũ (nếu cần)
      const oldPath = path.join(__dirname, '../public', existingDesign.originalImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      // Gán đường dẫn ảnh mới
      existingDesign.originalImage = `/design/${originalImageFile.filename}`;
    }

    if (designedImageFile) {
      const oldPath = path.join(__dirname, '../public', existingDesign.designedImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      existingDesign.designedImage = `/designed/${designedImageFile.filename}`;
    }

    // Lưu lại
    await existingDesign.save();

    res.status(200).json({
      message: 'Cập nhật thiết kế thành công!',
      data: existingDesign,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thiết kế:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server.' });
  }
};

const deleteDesignById = async (req, res) => {
  try {
    const { id_design } = req.params;

    // Tìm thiết kế theo ID
    const design = await Design.findById(id_design);
    if (!design) {
      return res.status(404).json({ message: 'Thiết kế không tồn tại.' });
    }

    // Xóa file ảnh gốc nếu tồn tại
    const originalImagePath = path.join(__dirname, '../public', design.originalImage);
    if (fs.existsSync(originalImagePath)) {
      fs.unlinkSync(originalImagePath);
    }

    // Xóa file ảnh đã thiết kế nếu tồn tại
    const designedImagePath = path.join(__dirname, '../public', design.designedImage);
    if (fs.existsSync(designedImagePath)) {
      fs.unlinkSync(designedImagePath);
    }

    // Xóa bản ghi trong MongoDB
    await Design.findByIdAndDelete(id_design);

    res.status(200).json({ message: 'Xóa thiết kế thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa thiết kế:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server.' });
  }
};




module.exports = { createDesign,
  getDesignsByUserId, updateDesignById, deleteDesignById };

