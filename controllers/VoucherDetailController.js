const VoucherDetail = require('../models/VoucherDetailModel');

// Create a new VoucherDetail
const createVoucherDetail = async (req, res) => {
  try {
    const voucherDetail = new VoucherDetail(req.body);
    await voucherDetail.save();
    res.status(201).json({ message: 'VoucherDetail created successfully', voucherDetail });
  } catch (error) {
    res.status(400).json({ message: 'Error creating voucher', error });
  }
};

// Get all VoucherDetails
const getAllVoucherDetails = async (req, res) => {
  try {
    const voucherDetails = await VoucherDetail.find();
    res.status(200).json(voucherDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vouchers', error });
  }
};

// Get a VoucherDetail by ID
 const getVoucherDetailById = async (req, res) => {
  try {
    const voucherDetail = await VoucherDetail.findById(req.params.id);
    if (!VoucherDetail) {
      return res.status(404).json({ message: 'VoucherDetail not found' });
    }
    res.status(200).json(voucherDetail);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching VoucherDetail', error });
  }
};

// Update a VoucherDetail
const updateVoucherDetail = async (req, res) => {
  try {
    const updatedVoucherDetail = awaitVoucherDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVoucherDetail) {
      return res.status(404).json({ message: 'VoucherDetail not found' });
    }
    res.status(200).json({ message: 'VoucherDetail updated successfully', updatedVoucherDetail });
  } catch (error) {
    res.status(400).json({ message: 'Error updating VoucherDetail', error });
  }
};

// Delete a VoucherDetail
const deleteVoucherDetail = async (req, res) => {
  try {
    const deletedVoucherDetail = await VoucherDetail.findByIdAndDelete(req.params.id);
    if (!deletedVoucherDetail) {
      return res.status(404).json({ message: 'VoucherDetail not found' });
    }
    res.status(200).json({ message: 'VoucherDetail deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting VoucherDetail', error });
  }
};

module.exports = {
createVoucherDetail,
  getAllVoucherDetails,
  getVoucherDetailById,
  updateVoucherDetail,
  deleteVoucherDetail,
};
