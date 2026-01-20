
import { useState } from "react";
import { User, FileText, X, DollarSign, Plus, Trash2 } from "lucide-react";
import axios from "axios";

function BillModal({ patient, onClose }) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [billItems, setBillItems] = useState([
    { description: "Consultation Fee", amount: 500 }
  ]);

  const addBillItem = () => {
    setBillItems([...billItems, { description: "", amount: 0 }]);
  };

  const updateBillItem = (index, field, value) => {
    const updated = [...billItems];
    updated[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
    setBillItems(updated);
  };

  const removeBillItem = (index) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleGenerateBill = async () => {
    const token = localStorage.getItem("token");
    try {
      const payload = {
        patientId: patient.id,
        tokenId: patient.tokenId,
        items: billItems
      };

      const res = await axios.post(`${backend}/receptionist/generate-bill`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (!res.data.success) {
        alert("Failed to generate bill");
        return;
      }

      // After saving the bill in database → continue printing
    } catch (error) {
      console.error(error);
      alert("Error generating bill");
      return;
    }

    // Create a new window for the bill
    const printWindow = window.open('', '_blank');
    const billDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const billNumber = `BILL-${Date.now()}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - ${patient.fullName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              padding: 40px;
              background: white;
            }
            .bill-container {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #333;
              padding: 30px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              font-size: 32px;
              margin-bottom: 5px;
            }
            .header p {
              color: #666;
              font-size: 14px;
            }
            .bill-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f8fafc;
              border-radius: 8px;
            }
            .bill-info div {
              flex: 1;
            }
            .bill-info strong {
              display: block;
              color: #1e293b;
              margin-bottom: 5px;
              font-size: 12px;
              text-transform: uppercase;
            }
            .bill-info span {
              color: #475569;
              font-size: 14px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              background: #2563eb;
              color: white;
              padding: 10px 15px;
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 15px;
            }
            .patient-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              padding: 15px;
              background: #f8fafc;
              border-radius: 8px;
            }
            .patient-details div strong {
              display: block;
              color: #1e293b;
              margin-bottom: 5px;
              font-size: 12px;
            }
            .patient-details div span {
              color: #475569;
              font-size: 14px;
            }
            .prescription-box {
              padding: 15px;
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              margin-bottom: 15px;
            }
            .prescription-box h4 {
              color: #92400e;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .prescription-box p {
              color: #78350f;
              font-size: 13px;
              line-height: 1.6;
            }
            .medication-item {
              padding: 10px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              margin-bottom: 10px;
            }
            .medication-item strong {
              display: block;
              color: #1e293b;
              margin-bottom: 5px;
            }
            .medication-item span {
              color: #64748b;
              font-size: 13px;
            }
            .bill-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .bill-table thead {
              background: #f1f5f9;
            }
            .bill-table th {
              padding: 12px;
              text-align: left;
              font-size: 13px;
              font-weight: bold;
              color: #1e293b;
              border-bottom: 2px solid #cbd5e1;
            }
            .bill-table td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
              color: #475569;
            }
            .bill-table tr:last-child td {
              border-bottom: none;
            }
            .amount-cell {
              text-align: right;
              font-family: 'Courier New', monospace;
            }
            .total-row {
              background: #dbeafe;
              font-weight: bold;
            }
            .total-row td {
              padding: 15px 12px;
              font-size: 18px;
              color: #1e40af;
              border-top: 3px solid #2563eb;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
            }
            .footer p {
              color: #64748b;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              width: 200px;
              border-top: 2px solid #333;
              margin: 40px auto 10px;
            }
            .signature-box p {
              color: #475569;
              font-size: 13px;
              font-weight: bold;
            }
            @media print {
              body {
                padding: 0;
              }
              .bill-container {
                border: none;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <!-- Header -->
            <div class="header">
              <h1>MEDICAL BILL</h1>
              <p>Healthcare Clinic | Phone: +91 1234567890 | Email: clinic@example.com</p>
            </div>

            <!-- Bill Info -->
            <div class="bill-info">
              <div>
                <strong>Bill Number</strong>
                <span>${billNumber}</span>
              </div>
              <div>
                <strong>Date</strong>
                <span>${billDate}</span>
              </div>
              <div>
                <strong>Token Number</strong>
                <span>${patient.tokenNumber}</span>
              </div>
            </div>

            <!-- Patient Details -->
            <div class="section">
              <div class="section-title">Patient Information</div>
              <div class="patient-details">
                <div>
                  <strong>Patient Name</strong>
                  <span>${patient.fullName}</span>
                </div>
                <div>
                  <strong>Visit Date</strong>
                  <span>${patient.visitDate}</span>
                </div>
              </div>
            </div>

            <!-- Prescription Details -->
            <div class="section">
              <div class="section-title">Prescription Details</div>
              <div class="prescription-box">
                <h4>Diagnosis</h4>
                <p>${patient.diagnosis}</p>
              </div>

              ${patient.medicines.length > 0 ? `
                <h4 style="margin-bottom: 10px; color: #1e293b; font-size: 13px;">Medications Prescribed:</h4>
                ${patient.medicines.map(med => `
                  <div class="medication-item">
                    <strong>${med.name}</strong>
                    <span>${med.dosage} - ${med.duration}</span>
                  </div>
                `).join('')}
              ` : ''}

              ${patient.tests?.length > 0 ? `
                <h4 style="margin: 15px 0 10px; color: #1e293b; font-size: 13px;">Tests Prescribed:</h4>
                <p style="color: #475569; font-size: 13px;">${patient.prescription.tests.join(', ')}</p>
              ` : ''}
            </div>

            <!-- Billing Details -->
            <div class="section">
              <div class="section-title">Billing Details</div>
              <table class="bill-table">
                <thead>
                  <tr>
                    <th style="width: 70%">Description</th>
                    <th style="width: 30%; text-align: right;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${billItems.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="amount-cell">${item.amount.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td><strong>TOTAL AMOUNT</strong></td>
                    <td class="amount-cell"><strong>₹ ${calculateTotal().toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>Patient Signature</p>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>Authorized Signature</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p><strong>Terms & Conditions:</strong> Payment is due at the time of service.</p>
              <p>This is a computer-generated bill and does not require a signature.</p>
              <p style="margin-top: 15px;">Thank you for choosing our healthcare services!</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 250);

    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Generate Bill</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Name:</span>
                <p className="text-blue-900">{patient.fullName}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Visit Date:</span>
                <p className="text-blue-900">{patient.visitDate}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Token Number:</span>
                <p className="text-blue-900">{patient.tokenNumber}</p>
              </div>
            </div>
          </div>

          {/* Prescription Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prescription Details
            </h4>

            {/* Diagnosis */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Diagnosis:</span>
              <p className="text-gray-900">{patient.diagnosis}</p>
            </div>

            {/* Medications */}
            {patient.medicines.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Medications:</span>
                <div className="mt-2 space-y-2">
                  {patient.medicines.map((med, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        {med.dosage} - {med.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tests */}
            {patient.tests?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Tests Prescribed:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {patient.prescription.tests.map((test, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            )
            }
          </div>

          {/* Bill Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Bill Items
              </h4>
              <button
                onClick={addBillItem}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {billItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description (e.g., Medicine, Test Fee)"
                      value={item.description}
                      onChange={(e) => updateBillItem(index, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount || ""}
                      onChange={(e) => updateBillItem(index, "amount", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => removeBillItem(index)}
                    disabled={billItems.length === 1}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleGenerateBill}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <FileText className="w-4 h-4" />
            Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillModal;