require('dotenv').config();
const Invoice = require('../models/demoInvoicesmodels');
const Member = require('../models/DemoMember');
const Organisation = require("../models/OrganisationModels")
const InvoiceTemplate = require('../models/InvoiceTemplate');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const path = require('path');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "satejshendage@gmail.com",
    pass: "swux dtam tblb zlbr"
  }
});

// Handle view engine setup asynchronously
let exphbs;
let viewEngineConfigured = false;

async function configureViewEngine() {
  try {
    const module = await import('nodemailer-express-handlebars');
    exphbs = module.default;
    
    transporter.use('compile', exphbs({
        viewEngine: {
            extname: '.handlebars',
            layoutsDir: path.join(__dirname, '../views/email'),
            defaultLayout: false,
            partialsDir: path.join(__dirname, '../views/email/partials')
          },
          viewPath: path.join(__dirname, '../views/email'),
          extName: '.handlebars'
        }));
    
    viewEngineConfigured = true;
    console.log('Email template engine configured successfully');
  } catch (error) {
    console.error('Error configuring email templates:', error);
    throw error;
  }
}

// Call the configuration function immediately
configureViewEngine().catch(console.error);


async function sendInvoiceEmail(invoice, action) {
    try {
      if (!viewEngineConfigured) {
        await configureViewEngine();
      }
      
      console.log(`Attempting to send ${action} email for invoice #${invoice.invoiceNumber}...`);
      
      // Fetch member and organization details
      const member = await Member.findById(invoice.memberId);
      const organization = await Organisation.findOne(); // Assuming you have an Organisation model
      
      if (!member || !member.Email) {
        console.error('Member not found or email missing');
        return false;
      }
  
      // Generate PDF HTML matching the React preview
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Roboto', Arial, sans-serif;
              color: #333;
              line-height: 1.5;
            }
            .invoice-container {
              max-width: 1000px;
              margin: 0 auto;
              border: 1px solid #eee;
            }
            .invoice-header {
              background-color: ${invoice.templateId?.design?.headerColor || '#1976d2'};
              color: white;
              padding: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .society-info h2 {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            .society-info p {
              font-size: 14px;
              margin-bottom: 4px;
            }
            .logo-container {
              width: 80px;
              height: 80px;
              background-color: white;
              padding: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-container img {
              max-width: 100%;
              max-height: 100%;
            }
            .invoice-content {
              padding: 24px;
            }
            .invoice-title {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 16px;
            }
            .invoice-details {
              display: flex;
              margin-bottom: 24px;
            }
            .invoice-meta, .member-info {
              flex: 1;
            }
            .invoice-meta p, .member-info p {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .invoice-meta strong, .member-info strong {
              display: inline-block;
              width: 80px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
              border: 1px solid #eee;
            }
            th {
              background-color: #f5f5f5;
              font-weight: 600;
              text-align: left;
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eee;
              vertical-align: top;
            }
            .service-name {
              font-weight: 600;
            }
            .service-description {
              font-size: 12px;
              color: #666;
              margin-top: 4px;
            }
            .service-reference {
              font-size: 12px;
              color: #666;
            }
            .amount-cell {
              text-align: right;
            }
            .totals-table {
              width: 50%;
              margin-left: auto;
              margin-bottom: 24px;
            }
            .totals-table td {
              border-bottom: none;
            }
            .total-row {
              font-weight: 600;
            }
            .notes {
              margin-top: 24px;
              padding: 16px;
              background-color: #f9f9f9;
              border-radius: 4px;
            }
            .invoice-footer {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #eee;
              display: flex;
              justify-content: space-between;
              font-size: 14px;
            }
            .footer-note {
              font-style: italic;
              color: #666;
            }
            .footer-contact {
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div class="society-info">
                <h2>${organization?.SocietyName || 'SOCIETY NAME'}</h2>
                <p>${organization?.AddressLine1 || 'Address line 1'}</p>
                ${organization?.AddressLine2 ? `<p>${organization.AddressLine2}</p>` : ''}
                <p>${[organization?.AddressLine3, organization?.Pin].filter(Boolean).join(' - ')}</p>
                <p>Reg No: ${organization?.Registration || 'Not available'}</p>
                ${organization?.GSTNumber ? `<p>GSTIN: ${organization.GSTNumber}</p>` : ''}
              </div>
              ${organization?.logoUrl ? `
              <div class="logo-container">
                <img src="${organization.logoUrl}" alt="Society Logo">
              </div>
              ` : ''}
            </div>
            
            <!-- Content -->
            <div class="invoice-content">
              <h1 class="invoice-title">INVOICE</h1>
              
              <div class="invoice-details">
                <div class="invoice-meta">
                  <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                  <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                  <p><strong>Period:</strong> ${invoice.period}</p>
                </div>
                
                <div class="member-info">
                  <p><strong>Member:</strong> ${member.Name}</p>
                </div>
              </div>
              
              <!-- Items Table -->
              <table>
                <thead>
                  <tr>
                    <th>Services</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: right;">Rate (₹)</th>
                    <th style="text-align: right;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map((item, index) => `
                    <tr>
                      <td>
                        <div class="service-name">${item.serviceName}</div>
                      </td>
                      <td class="amount-cell">${item.quantity}</td>
                      <td class="amount-cell">${item.rate.toFixed(2)}</td>
                      <td class="amount-cell">${(item.rate * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <!-- Totals -->
              <table class="totals-table">
                <tbody>
                  <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td class="amount-cell">₹${invoice.subTotal.toFixed(2)}</td>
                  </tr>
                  ${invoice.subTotal > 7000 ? `
                  <tr>
                    <td><strong>GST (18%):</strong></td>
                    <td class="amount-cell">₹${invoice.gst.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td><strong>Total:</strong></td>
                    <td class="amount-cell">₹${invoice.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Notes -->
              ${invoice.notes ? `
              <div class="notes">
                <h3>Notes</h3>
                <p>${invoice.notes}</p>
              </div>
              ` : ''}
              
              <!-- Footer -->
              <div class="invoice-footer">
                <div class="footer-note">
                  <p>${invoice.templateId?.design?.footerNote || 'Thank you for your Attentation!'}</p>
                  <p>This is a computer generated invoice and does not require a signature.</p>
                </div>
                <div class="footer-contact">
                  ${organization?.Email ? `<p>Email: ${organization.Email}</p>` : ''}
                  ${organization?.Mobile ? `<p>Contact: ${organization.Mobile}</p>` : ''}
                </div>
                              <div class="terms">
                <div class="terms-title">Terms & Conditions</div>
                <div style="font-style: italic;">E&O.E.</div>
                <div>1. Cheques to be in favour of "${organization?.SocietyName || "WHITE ROSE CHS LTD"}" & Cheques to be dropped in the cheque drop box.</div>
                <div>2. Mention your Flat No. and Mobile No. on the reverse of the cheque.</div>
                <div>3. Non Payment of Bill will attract interest @21 % PA.</div>
                <div>4. Errors to be intimated within 7 days to Society Office</div>
              </div>
  
              <div class="bank-details">
                <div class="bank-title">Bank Details for ${organization?.SocietyName || "WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD"}</div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span>Bank Name: SVC Bank Ltd.</span>
                  <span>A/c No.: 300003000012169</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span>Branch & IFSC: Bandra & SVCB0000003</span>
                  <span>Sign image</span>
                </div>
              </div>
  
              <div class="footer">
                Chairman/Secretary/Manager
              </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
  
      // Generate PDF
      const pdfOptions = {
        format: 'A4',
        border: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      };
  
      const pdfBuffer = await new Promise((resolve, reject) => {
        pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        });
      });
  
      // Email content based on action
      let subject, text, template;
      if (action === 'create') {
        subject = `New Invoice #${invoice.invoiceNumber} from ${organization?.SocietyName || 'Your Society'}`;
        text = `Dear ${member.Name},\n\nPlease find attached your new invoice #${invoice.invoiceNumber} for ${invoice.period}.\n\nAmount Due: ₹${invoice.total.toFixed(2)}\nDue Date: ${new Date(new Date(invoice.date).setDate(new Date(invoice.date).getDate() + 15)).toLocaleDateString()}\n\nThank you for your business!\n\nBest regards,\n${organization?.SocietyName || 'Your Society'}`;
        template = 'invoice_created';
      } else {
        subject = `Updated Invoice #${invoice.invoiceNumber} from ${organization?.SocietyName || 'Your Society'}`;
        text = `Dear ${member.Name},\n\nPlease find attached your updated invoice #${invoice.invoiceNumber} for ${invoice.period}.\n\nUpdated Amount Due: ₹${invoice.total.toFixed(2)}\nDue Date: ${new Date(new Date(invoice.date).setDate(new Date(invoice.date).getDate() + 15)).toLocaleDateString()}\n\nIf you have any questions, please contact us.\n\nBest regards,\n${organization?.SocietyName || 'Your Society'}`;
        template = 'invoice_updated';
      }
  
      // Send email
      const mailOptions = {
        from: `"${organization?.SocietyName || 'Your Society'}" <${process.env.EMAIL_FROM || 'noreply@example.com'}>`,
        to: member.Email,
        subject: subject,
        text: text,
        template: template,
        context: {
          name: member.Name,
          invoiceNumber: invoice.invoiceNumber,
          period: invoice.period,
          amount: invoice.total.toFixed(2),
          dueDate: new Date(new Date(invoice.date).setDate(new Date(invoice.date).getDate() + 15)).toLocaleDateString(),
          societyName: organization?.SocietyName || 'Your Society'
        },
        attachments: [{
          filename: `Invoice_${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully for invoice #${invoice.invoiceNumber} to ${member.Email}`);
  
      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return false;
    }
  }

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
const getInvoices = async (req, res) => {
  try {
    const query = {};
    
    if (req.query.search) {
      query.$or = [
        { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
        { memberName: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.services) {
      const services = Array.isArray(req.query.services) 
        ? req.query.services 
        : [req.query.services];
      query['items.serviceName'] = { $in: services };
    }
    
    const invoices = await Invoice.find(query)
      .populate('memberId', 'Name Email Phone Area CC')
      .populate('templateId', 'name')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('memberId')
      .populate('templateId')
      .populate('items.serviceId');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Public
const createInvoice = async (req, res) => {
  try {
    const { memberId, templateId, items, period, notes } = req.body;
    
    if (!memberId || !templateId || !items || !period) {
      return res.status(400).json({
        success: false,
        message: 'Member, template, items, and period are required'
      });
    }
    
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(400).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    const template = await InvoiceTemplate.findById(templateId);
    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Generate invoice number (YYYYMMDD-XXXX)
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    const seqNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1 : 1;
    const invoiceNumber = `${datePart}-${String(seqNumber).padStart(4, '0')}`;
    
    const subTotal = items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const gst = subTotal > 7000 ? subTotal * 0.18 : 0;
    const total = subTotal + gst;
    
    const invoice = new Invoice({
      memberId,
      templateId,
      invoiceNumber,
      items,
      period,
      notes,
      subTotal,
      gst,
      total,
      date: now
    });
    
    await invoice.save();
    
    // Send email with PDF
    const emailSent = await sendInvoiceEmail(invoice, 'create');
    
    res.status(201).json({
      success: true,
      data: invoice,
      emailSent: emailSent
    });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Public
const updateInvoice = async (req, res) => {
    try {
      const { items, period, notes } = req.body;
      
      // Clean up items data before updating
      const cleanedItems = items.map(item => ({
        ...item,
        serviceId: item.serviceId || undefined // Convert empty string to undefined
      }));
  
      let updateData = { period, notes };
      if (cleanedItems) {
        const subTotal = cleanedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
        const gst = subTotal > 7000 ? subTotal * 0.18 : 0;
        const total = subTotal + gst;
        updateData = { ...updateData, items: cleanedItems, subTotal, gst, total };
      }
      
      const invoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('memberId');
      
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      
      // Send email with updated PDF
      const emailSent = await sendInvoiceEmail(invoice, 'update');
      
      res.json({
        success: true,
        data: invoice,
        emailSent: emailSent
      });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: messages
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Send invoice emails
// @route   POST /api/invoices/send
// @access  Public
const sendInvoices = async (req, res) => {
  try {
    const { invoiceIds } = req.body;
    
    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invoice IDs are required'
      });
    }
    
    const invoices = await Invoice.find({ _id: { $in: invoiceIds } })
      .populate('memberId', 'Email');
    
    // Send emails for all invoices
    const sendResults = await Promise.all(
      invoices.map(invoice => sendInvoiceEmail(invoice, 'create'))
    );
    
    const successfulSends = sendResults.filter(result => result).length;
    
    res.json({
      success: true,
      message: `Sent ${successfulSends} of ${invoices.length} invoices`,
      data: invoices.map((inv, index) => ({
        invoiceId: inv._id,
        invoiceNumber: inv.invoiceNumber,
        memberEmail: inv.memberId.Email,
        sent: sendResults[index]
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoices
};