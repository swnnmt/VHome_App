const Brand = require('../models/VHome_brand'); // Đường dẫn tới file schema của bạn

// POST /brands
const createBrand = async (req, res) => {
  try {
    const { name, banner, paints, tiles } = req.body;
    if (!name || !banner) {
      return res.status(400).json({ message: 'Name và banner là bắt buộc' });
    }

    const newBrand = new Brand({ name, banner, paints, tiles });
    const savedBrand = await newBrand.save();
    return res.status(201).json(savedBrand);
  } catch (error) {
    console.error('Create brand error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /brands/:id
const getBrandDetails = async (req, res) => {
  try {
    const brandId = req.params.id;
    const brand = await Brand.findById(brandId).select('paints tiles name banner');
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    return res.json(brand);
  } catch (error) {
    console.error('Get brand details error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /brands/:brandId/add
const addPaintAndTileToBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { paints, tiles } = req.body;

    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand không tồn tại' });

    const updateData = {};
    const pushData = {};

    if (Array.isArray(paints) && paints.length > 0) {
      const validPaints = paints.filter(p => p.colorCode && p.price !== undefined);
      if (validPaints.length > 0) pushData.paints = { $each: validPaints };
    }

    if (Array.isArray(tiles) && tiles.length > 0) {
      const validTiles = tiles.filter(t => t.image && t.price !== undefined);
      if (validTiles.length > 0) pushData.tiles = { $each: validTiles };
    }

    if (Object.keys(pushData).length === 0) {
      return res.status(400).json({ message: 'Không có paint hoặc tile hợp lệ để thêm' });
    }

    updateData.$push = pushData;

    const updatedBrand = await Brand.findByIdAndUpdate(brandId, updateData, { new: true });
    res.status(200).json(updatedBrand);
  } catch (error) {
    console.error('Lỗi thêm paints/tiles:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// PUT /brands/:brandId/paints/:paintId
const updatePaintInBrand = async (req, res) => {
  try {
    const { brandId, paintId } = req.params;
    const { colorCode, price } = req.body;

    const brand = await Brand.findOneAndUpdate(
      { _id: brandId, 'paints._id': paintId },
      {
        $set: {
          'paints.$.colorCode': colorCode,
          'paints.$.price': price,
        }
      },
      { new: true }
    );

    if (!brand) return res.status(404).json({ message: 'Brand hoặc Paint không tồn tại' });

    res.status(200).json({ message: 'Cập nhật màu sơn thành công', brand });
  } catch (error) {
    console.error('Lỗi cập nhật màu sơn:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// PUT /brands/:brandId/tiles/:tileId
const updateTileInBrand = async (req, res) => {
  try {
    const { brandId, tileId } = req.params;
    const { image, price } = req.body;

    const brand = await Brand.findOneAndUpdate(
      { _id: brandId, 'tiles._id': tileId },
      {
        $set: {
          'tiles.$.image': image,
          'tiles.$.price': price,
        }
      },
      { new: true }
    );

    if (!brand) return res.status(404).json({ message: 'Brand hoặc Tile không tồn tại' });

    res.status(200).json({ message: 'Cập nhật mẫu gạch thành công', brand });
  } catch (error) {
    console.error('Lỗi cập nhật mẫu gạch:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  createBrand,
  getBrandDetails,
  getAllBrands,
  addPaintAndTileToBrand,
  updatePaintInBrand,
  updateTileInBrand
};
