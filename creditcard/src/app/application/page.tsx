'use client';

import { ChangeEvent, useState } from 'react';

const steps = [
  { id: 1, label: 'Start' },
  { id: 2, label: 'Your Details' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Review' },
  { id: 5, label: 'Success' },
];

function StepTracker({ currentStep }) {
  return (
    <div className="flex justify-center space-x-8 mb-10">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold shadow ${
              currentStep === step.id ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            {step.id}
          </div>
          <div
            className={`mt-2 text-xs font-semibold select-none ${
              currentStep === step.id ? 'text-blue-700' : 'text-gray-500'
            }`}
          >
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ApplicationPage() {
  // tracking current step
  const [currentStep, setCurrentStep] = useState(1);

  // all the form stuff
  const [formInfo, setFormInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobType: '',
    company: '',
    monthlySalary: '',
    salaryDoc: null,
    idDoc: null,
  });

  const [appId, setAppId] = useState(null);

  // update form when user types
  function updateForm(event: { target: { name: any; value: any } }) {
    const name = event.target.name;
    const value = event.target.value;
    setFormInfo({ ...formInfo, [name]: value });
  }

  // handle file uploads
  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name;
    const file = event.target.files?.[0];
    if (file) {
      setFormInfo({ ...formInfo, [fieldName]: file });
    }
  }

  // check if should show warning message
  function checkWarning() {
    if (formInfo.jobType === 'student' || formInfo.jobType === 'unemployed') {
      return true;
    }
    if (
      (formInfo.jobType === 'salaried' || formInfo.jobType === 'self_employed') &&
      formInfo.monthlySalary !== '' &&
      parseInt(formInfo.monthlySalary) < 10000
    ) {
      return true;
    }
    return false;
  }

  // submit everything
  async function submitApplication() {
    if (!formInfo.salaryDoc || !formInfo.idDoc) {
      alert('Please select both files!');
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formInfo.firstName,
          lastName: formInfo.lastName,
          email: formInfo.email,
          phone: formInfo.phone,
          employmentType: formInfo.jobType,
          companyName: formInfo.company,
          salary: formInfo.monthlySalary,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const id = data.id;

        const fileData = new FormData();
        fileData.append('salaryCertificate', formInfo.salaryDoc);
        fileData.append('nationalId', formInfo.idDoc);

        const uploadResponse = await fetch(`/api/applications/${id}/documents`, {
          method: 'POST',
          body: fileData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          setAppId(id);
          setCurrentStep(5);
        } else {
          alert('Application saved but file upload failed: ' + uploadResult.error);
        }
      } else {
        alert('Failed to save application: ' + data.error);
      }
    } catch (err) {
      alert('Something went wrong! Check console.');
    }
  }

  // STEP 1 - Welcome screen
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <StepTracker currentStep={currentStep} />

        <div className="max-w-2xl w-full bg-white rounded-lg p-10 shadow-lg">
          <h1 className="text-4xl font-semibold mb-5 text-center text-blue-700">
            Credit Card Application
          </h1>
          <p className="text-gray-700 text-lg mb-8 text-center">
            Apply for a credit card online. It&apos;s quick and easy!
          </p>

          <div className="mb-8 bg-blue-50 p-6 rounded-md border border-blue-200">
            <h2 className="font-semibold text-xl mb-3 text-blue-800">You&apos;ll need:</h2>
            <ul className="list-disc ml-6 text-blue-700 space-y-1">
              <li>Your personal details</li>
              <li>Employment information</li>
              <li>Salary certificate (PDF or image)</li>
              <li>National ID (PDF or image)</li>
            </ul>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="block w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-semibold py-3 rounded shadow"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // STEP 2 - Personal info form
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <StepTracker currentStep={currentStep} />

        <div className="max-w-2xl w-full bg-white rounded-lg p-10 shadow-lg">
          <h1 className="text-3xl font-semibold mb-6 text-blue-700">Your Details</h1>

          {/* warning box */}
          {checkWarning() && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
              {formInfo.jobType === 'student' || formInfo.jobType === 'unemployed' ? (
                'Unfortunately we cannot process applications for students or unemployed individuals at this time.'
              ) : (
                'Minimum monthly salary requirement is AED 10,000.'
              )}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formInfo.firstName}
                onChange={updateForm}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formInfo.lastName}
                onChange={updateForm}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formInfo.email}
                onChange={updateForm}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formInfo.phone}
                onChange={updateForm}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="05XXXXXXXX"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Employment Status</label>
              <select
                name="jobType"
                value={formInfo.jobType}
                onChange={updateForm}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Please Select --</option>
                <option value="salaried">Salaried Employee</option>
                <option value="self_employed">Self Employed</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            {(formInfo.jobType === 'salaried' || formInfo.jobType === 'self_employed') && (
              <>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formInfo.company}
                    onChange={updateForm}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Monthly Salary (AED)</label>
                  <input
                    type="number"
                    name="monthlySalary"
                    value={formInfo.monthlySalary}
                    onChange={updateForm}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E.g. 15000"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between mt-10">
            <button
              onClick={() => setCurrentStep(1)}
              className="border border-gray-300 px-8 py-3 rounded hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white px-8 py-3 rounded shadow"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3 - Document upload
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <StepTracker currentStep={currentStep} />

        <div className="max-w-2xl w-full bg-white rounded-lg p-10 shadow-lg">
          <h1 className="text-3xl font-semibold mb-6 text-blue-700">Upload Your Documents</h1>

          <p className="mb-6 text-gray-700 text-lg">
            Please upload the following documents:
          </p>

          <div className="space-y-8">
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Salary Certificate</label>
              <input
                type="file"
                name="salaryDoc"
                onChange={handleFiles}
                className="w-full border border-gray-300 p-3 rounded"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {formInfo.salaryDoc && (
                <p className="text-sm text-green-600 mt-2">✓ File selected: {formInfo.salaryDoc.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-3 font-semibold text-gray-700">National ID</label>
              <input
                type="file"
                name="idDoc"
                onChange={handleFiles}
                className="w-full border border-gray-300 p-3 rounded"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {formInfo.idDoc && (
                <p className="text-sm text-green-600 mt-2">✓ File selected: {formInfo.idDoc.name}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-8">
            <p className="text-sm text-blue-800 font-medium">
              <strong>Note:</strong> Accepted formats are PDF, JPG, and PNG. Max file size 5MB.
            </p>
          </div>

          <div className="flex justify-between mt-10">
            <button
              onClick={() => setCurrentStep(2)}
              className="border border-gray-300 px-8 py-3 rounded hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white px-8 py-3 rounded shadow"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 4 - Review everything before submit
  if (currentStep === 4) {
    const isStudentOrUnemployed = formInfo.jobType === 'student' || formInfo.jobType === 'unemployed';
    const isSalaryTooLow =
      (formInfo.jobType === 'salaried' || formInfo.jobType === 'self_employed') &&
      formInfo.monthlySalary !== '' &&
      parseInt(formInfo.monthlySalary) < 10000;

    const canSubmit = !isStudentOrUnemployed && !isSalaryTooLow;

    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <StepTracker currentStep={currentStep} />

        <div className="max-w-2xl w-full bg-white rounded-lg p-10 shadow-lg">
          <h1 className="text-3xl font-semibold mb-6 text-blue-700">Review Your Information</h1>

          <p className="mb-6 text-gray-700">
            Please check that everything is correct:
          </p>

          {!canSubmit && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6 font-semibold">
              <strong>⚠️ Application Not Eligible:</strong>
              {isStudentOrUnemployed && (
                <p>We cannot process applications for students or unemployed individuals.</p>
              )}
              {isSalaryTooLow && (
                <p>
                  Minimum monthly salary requirement is AED 10,000. Your entered salary: AED{' '}
                  {formInfo.monthlySalary}
                </p>
              )}
            </div>
          )}

          <div className="space-y-6 mb-8">
            <section className="border-b pb-4">
              <h2 className="font-bold text-xl mb-2 text-blue-700">Personal Information</h2>
              <p>
                <strong>Name:</strong> {formInfo.firstName} {formInfo.lastName}
              </p>
              <p>
                <strong>Email:</strong> {formInfo.email}
              </p>
              <p>
                <strong>Phone:</strong> {formInfo.phone}
              </p>
            </section>

            <section className="border-b pb-4">
              <h2 className="font-bold text-xl mb-2 text-blue-700">Employment Details</h2>
              <p>
                <strong>Type:</strong> {formInfo.jobType}
              </p>
              {formInfo.company && (
                <p>
                  <strong>Company:</strong> {formInfo.company}
                </p>
              )}
              {formInfo.monthlySalary && (
                <p>
                  <strong>Monthly Salary:</strong> AED {formInfo.monthlySalary}
                </p>
              )}
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2 text-blue-700">Documents</h2>
              {formInfo.salaryDoc && <p>✓ Salary Certificate: {formInfo.salaryDoc.name}</p>}
              {formInfo.idDoc && <p>✓ National ID: {formInfo.idDoc.name}</p>}
            </section>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-800 text-sm font-medium">
              By submitting this application, you confirm that all information provided is accurate.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="border border-gray-300 px-8 py-3 rounded hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={submitApplication}
              disabled={!canSubmit}
              className={`px-8 py-3 rounded font-semibold ${
                !canSubmit
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300'
              }`}
            >
              {canSubmit ? 'Submit Application' : 'Cannot Submit - Not Eligible'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 5 - Success!
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <StepTracker currentStep={currentStep} />

        <div className="max-w-2xl w-full bg-white rounded-lg p-10 shadow-lg text-center">
          <div className="text-green-600 text-7xl mb-6 font-extrabold">✓</div>
          <h1 className="text-4xl font-semibold mb-6 text-green-700">Application Submitted Successfully!</h1>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded inline-block mb-8">
            <p className="text-sm text-gray-700 mb-1">Your Application Number</p>
            <p className="text-3xl font-bold text-blue-700 select-text">#{appId}</p>
          </div>

          <p className="text-gray-700 mb-10 text-lg">
            Thank you for applying! We&apos;ll review your application and contact you within 2-3 business days.
          </p>

          <div className="text-left bg-gray-100 p-6 rounded border border-gray-300">
            <h3 className="font-bold mb-4 text-blue-700">What happens next?</h3>
            <ul className="space-y-2 text-gray-700 text-base list-disc ml-6">
              <li>We&apos;ll verify your documents</li>
              <li>Our team will review your application</li>
              <li>You&apos;ll receive an email with the decision</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
