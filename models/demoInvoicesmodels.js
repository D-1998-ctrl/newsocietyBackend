const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service',
    required: false 
  },
  serviceName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  rate: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  factor: { 
    type: Number, 
    required: true 
  },
  reference: { 
    type: String, 
    required: true 
  },
  showDescription: { 
    type: Boolean, 
    default: true 
  },
  isRateEditable: { 
    type: Boolean, 
    default: true 
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DemoMember', 
    required: true 
  },
  templateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'InvoiceTemplate', 
    required: true 
  },
  invoiceNumber: { 
    type: String, 
    unique: true 
  },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  period: { 
    type: String, 
    required: true 
  },
  items: [invoiceItemSchema],
  subTotal: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  gst: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  notes: { 
    type: String 
  },
  memberName: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'cancelled'], 
    default: 'draft' 
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

// Improved auto-generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    try {
      // Get the count of existing invoices to create a sequential number
      const count = await mongoose.model('DemoInvoice').countDocuments();
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const seq = (count + 1).toString().padStart(4, '0');
      
      // Format: INV-YYYYMM-0001
      this.invoiceNumber = `INV-${year}${month}-${seq}`;
    } catch (err) {
      // Fallback to random number if count fails
      console.error('Error generating invoice number:', err);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      this.invoiceNumber = `INV-${new Date().getFullYear()}-${randomNum}`;
    }
  }
  
  // Populate memberName if memberId is set/modified
  if (this.isModified('memberId')) {
    try {
      const member = await mongoose.model('DemoMember').findById(this.memberId);
      if (member) {
        this.memberName = member.Name;
      }
    } catch (err) {
      console.error('Error populating member name:', err);
    }
  }
  
  next();
});

// Update timestamp on update
invoiceSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('DemoInvoice', invoiceSchema);