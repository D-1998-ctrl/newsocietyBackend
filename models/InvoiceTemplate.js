const mongoose = require('mongoose');

const invoiceTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  items: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required']
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    showDescription: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  design: {
    headerColor: {
      type: String,
      default: '#1976d2'
    },
    logoUrl: {
      type: String,
      trim: true
    },
    terms: {
      type: String,
      default: 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.'
    },
    footerNote: {
      type: String,
      default: 'Thank you for your prompt payment.'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
invoiceTemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for better performance
invoiceTemplateSchema.index({ name: 1, isActive: 1 });

const InvoiceTemplate = mongoose.model('InvoiceTemplate', invoiceTemplateSchema);

module.exports = InvoiceTemplate;