"use client";

import axios from "axios";
import { Pill, Plus, User, X } from "lucide-react";
import { useState } from "react";

function AddPrescriptionModal({ patient, tokenId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    diagnosis: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    advice: "",
    reports: "",
    followUpDate: ""
  });

  const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: "", dosage: "", frequency: "", duration: "" }]
    });
  };

  const removeMedicine = (index) => {
    if (formData.medicines.length > 1) {
      setFormData({
        ...formData,
        medicines: formData.medicines.filter((_, i) => i !== index)
      });
    }
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${backend}/doctor/${patient.patient._id}/${tokenId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Prescription saved!");
      onSave(response.data.prescription);

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save prescription");
    }
  };


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-teal-500 to-teal-600">
          <h3 className="text-xl font-bold text-white">Add Prescription</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-teal-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chief Complaint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chief Complaint <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              rows={3}
              placeholder="Enter the main reason for patient's visit..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              rows={3}
              placeholder="Enter diagnosis details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Medicines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Medicines
              </label>
              <button
                type="button"
                onClick={addMedicine}
                className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Medicine
              </button>
            </div>
            <div className="space-y-4">
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-700">Medicine {index + 1}</h5>
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dosage (e.g., 500mg)"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Frequency (e.g., Twice daily)"
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Duration (e.g., 5 days)"
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reports/Tests Required
            </label>
            <textarea
              value={formData.reports}
              onChange={(e) => setFormData({ ...formData, reports: e.target.value })}
              rows={2}
              placeholder="Enter any lab tests or reports needed (e.g., Blood Test, X-Ray)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Doctor's Advice */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor's Advice
            </label>
            <textarea
              value={formData.advice}
              onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
              rows={3}
              placeholder="Enter general advice, dietary recommendations, lifestyle changes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPrescriptionModal;