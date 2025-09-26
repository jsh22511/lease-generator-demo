'use client';

import { useState } from 'react';
import { LeaseInput } from '@/lib/schema';
import Field from './Field';
import ResultCard from './ResultCard';

interface ComprehensiveLeaseFormProps {
  onGenerate: (data: LeaseInput) => Promise<void>;
  isGenerating: boolean;
  result: { success: boolean; message: string; downloadUrl?: string } | null;
}

function ComprehensiveLeaseForm({ onGenerate, isGenerating, result }: ComprehensiveLeaseFormProps) {
  const [step, setStep] = useState(1);
  const [tenantCount, setTenantCount] = useState(1);
  const [tenantNames, setTenantNames] = useState<string[]>(['']);
  const [formData, setFormData] = useState<Partial<LeaseInput>>({
    jurisdiction: { country: 'US' },
    term: { 
      startDate: new Date().toISOString().split('T')[0], 
      months: 12, 
      renewal: 'none' 
    },
    financials: {
      monthlyRent: 0,
      securityDeposit: 0,
      lateFee: { type: 'flat', value: 0, graceDays: 5 },
      prorationMethod: 'actual_days',
      utilitiesIncluded: []
    },
    pets: { allowed: false, fee: 0, deposit: 0, rent: 0 },
    rules: {
      smoking: 'prohibited',
      parking: '',
      subletting: 'with_consent',
      alterations: 'with_consent',
      insuranceRequired: false
    },
    notices: { delivery: 'both' },
    signatures: { method: 'e-sign' }
  });

  const updateFormData = (updates: Partial<LeaseInput>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!formData.landlord?.name || !formData.landlord?.address || !formData.property?.address) {
      alert('Please fill in all required fields (landlord name, landlord address, and property address)');
      return;
    }
    
    // Check if all tenant names are filled
    const filledTenantNames = tenantNames.filter(name => name.trim() !== '');
    if (filledTenantNames.length !== tenantCount) {
      alert('Please fill in all tenant names');
      return;
    }
    
    // Prepare tenant data
    const tenantData = tenantCount === 1 
      ? { name: tenantNames[0], email: formData.tenant?.email || '' }
      : tenantNames.map(name => ({ name, email: '' }));
    
    const submitData = {
      ...formData,
      tenant: tenantData
    };
    
    await onGenerate(submitData as LeaseInput);
  };

  const steps = [
    { title: 'Terms of Lease', fields: ['term'] },
    { title: 'Property Details', fields: ['property'] },
    { title: 'Property Address', fields: ['property'] },
    { title: 'Lead-Based Paint', fields: ['property'] },
    { title: 'Landlord & Tenant', fields: ['landlord', 'tenant'] },
    { title: 'Rent', fields: ['financials'] },
    { title: 'Property Rules', fields: ['rules'] }
  ];


  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Lease/Rental Agreement</h2>
          <p className="mt-2 text-gray-600">Complete the form below to generate your lease</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of {steps.length}</span>
            <span>{Math.round((step / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Form Content */}
          <div className="space-y-8">
            {/* Step 1: Terms of Lease */}
            {step === 1 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Terms of Lease</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">What type of lease are you creating?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="leaseType"
                          value="fixed"
                          className="mr-3"
                          checked={formData.term?.renewal === 'none'}
                          onChange={() => updateFormData({ 
                            term: { ...formData.term, renewal: 'none' } 
                          })}
                        />
                        A standard (fixed-term) lease
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="leaseType"
                          value="monthly"
                          className="mr-3"
                          checked={formData.term?.renewal === 'month_to_month'}
                          onChange={() => updateFormData({ 
                            term: { ...formData.term, renewal: 'month_to_month' } 
                          })}
                        />
                        A month-to-month lease
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">When does the lease begin?</h4>
                    <Field
                      type="date"
                      value={formData.term?.startDate || ''}
                      onChange={(value) => updateFormData({ 
                        term: { ...formData.term, startDate: value } 
                      })}
                      id="lease-start-date"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">When does the lease end?</h4>
                    <Field
                      type="date"
                      value={formData.term?.endDate || ''}
                      onChange={(value) => updateFormData({ 
                        term: { ...formData.term, endDate: value } 
                      })}
                      id="lease-end-date"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">What should happen after the lease ends?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="renewal"
                          value="move_out"
                          className="mr-3"
                          checked={formData.term?.renewal === 'none'}
                          onChange={() => updateFormData({ 
                            term: { ...formData.term, renewal: 'none' } 
                          })}
                        />
                        The tenant must move out or sign a new lease
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="renewal"
                          value="month_to_month"
                          className="mr-3"
                          checked={formData.term?.renewal === 'month_to_month'}
                          onChange={() => updateFormData({ 
                            term: { ...formData.term, renewal: 'month_to_month' } 
                          })}
                        />
                        The lease continues month-to-month until someone ends it
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Property Details</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">What type of property is being rented?</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="propertyType" 
                          value="house" 
                          className="mr-3" 
                          checked={formData.property?.type === 'house'}
                          onChange={() => updateFormData({ 
                            property: { ...formData.property, type: 'house' } 
                          })}
                        />
                        A house
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="propertyType" value="apartment" className="mr-3" />
                        An apartment
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="propertyType" value="room" className="mr-3" />
                        A room
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="propertyType" value="condo" className="mr-3" />
                        A condominium
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Do you want to include the number of bedrooms and bathrooms?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="includeBedBath" 
                          value="yes" 
                          className="mr-3"
                          checked={formData.property?.includeBedBath === true}
                          onChange={() => updateFormData({ 
                            property: { ...formData.property, includeBedBath: true } 
                          })}
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="includeBedBath" 
                          value="no" 
                          className="mr-3"
                          checked={formData.property?.includeBedBath === false}
                          onChange={() => updateFormData({ 
                            property: { ...formData.property, includeBedBath: false } 
                          })}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {formData.property?.includeBedBath && (
                    <>
                      <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                        <h4 className="text-lg font-semibold mb-4">How many bedrooms?</h4>
                        <Field
                          type="number"
                          value={formData.property?.bedrooms || 0}
                          onChange={(value) => updateFormData({ 
                            property: { ...formData.property, bedrooms: parseInt(value) || 0 } 
                          })}
                          min="0"
                          max="10"
                          id="property-bedrooms"
                        />
                      </div>

                      <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                        <h4 className="text-lg font-semibold mb-4">How many bathrooms?</h4>
                        <Field
                          type="number"
                          value={formData.property?.bathrooms || 0}
                          onChange={(value) => updateFormData({ 
                            property: { ...formData.property, bathrooms: parseInt(value) || 0 } 
                          })}
                          min="0"
                          max="10"
                          step="0.5"
                          id="property-bathrooms"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Property Address */}
              {step === 3 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Property Address</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">What is the full address of the rental property?</h4>
                    <div className="space-y-4">
                      <Field
                        label="Street address"
                        type="text"
                        value={formData.property?.address || ''}
                        onChange={(value) => updateFormData({ 
                          property: { ...formData.property, address: value } 
                        })}
                        placeholder="e.g., 123 Main Street"
                        required
                        id="property-address"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Field
                          label="City"
                          type="text"
                          value={formData.jurisdiction?.city || ''}
                          onChange={(value) => updateFormData({ 
                            jurisdiction: { ...formData.jurisdiction, city: value } 
                          })}
                          placeholder="e.g., San Francisco"
                          id="property-city"
                        />
                        <Field
                          label="State"
                          type="select"
                          value={formData.jurisdiction?.state || 'CA'}
                          onChange={(value) => updateFormData({ 
                            jurisdiction: { ...formData.jurisdiction, state: value } 
                          })}
                          options={[
                            { value: 'CA', label: 'California' },
                            { value: 'NY', label: 'New York' },
                            { value: 'TX', label: 'Texas' },
                            { value: 'FL', label: 'Florida' }
                          ]}
                          id="property-state"
                        />
                      </div>
                      <Field
                        label="ZIP code"
                        type="text"
                        value={formData.property?.zipCode || ''}
                        onChange={(value) => updateFormData({ 
                          property: { ...formData.property, zipCode: value } 
                        })}
                        placeholder="e.g., 94102"
                        id="property-zipcode"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Lead-Based Paint Disclosure */}
              {step === 4 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Lead-Based Paint Disclosure</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Was the property built before 1978?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="radio" name="pre1978" value="yes" className="mr-3" />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="pre1978" 
                          value="no" 
                          className="mr-3" 
                          checked={formData.leadPaint?.builtBefore1978 === false}
                          onChange={() => updateFormData({ 
                            leadPaint: { ...formData.leadPaint, builtBefore1978: false } 
                          })}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Landlord & Tenant */}
              {step === 5 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Landlord & Tenant</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <Field
                      label="Who is the landlord?"
                      type="text"
                      value={formData.landlord?.name || ''}
                      onChange={(value) => updateFormData({ 
                        landlord: { ...formData.landlord, name: value } 
                      })}
                      placeholder="e.g., Joshua Kain"
                      required
                      id="landlord-name"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <Field
                      label="Landlord's address"
                      type="text"
                      value={formData.landlord?.address || ''}
                      onChange={(value) => updateFormData({ 
                        landlord: { ...formData.landlord, address: value } 
                      })}
                      placeholder="e.g., 123 Main St, San Francisco, CA 94102"
                      required
                      id="landlord-address"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">How many tenants will be on the lease?</h4>
                    <p className="text-sm text-gray-600 mb-4">Minors don't need to be listed here.</p>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="tenantCount" 
                          value="1" 
                          className="mr-3" 
                          checked={tenantCount === 1}
                          onChange={() => {
                            setTenantCount(1);
                            setTenantNames(['']);
                          }}
                        />
                        One
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="tenantCount" 
                          value="2" 
                          className="mr-3"
                          checked={tenantCount === 2}
                          onChange={() => {
                            setTenantCount(2);
                            setTenantNames(['', '']);
                          }}
                        />
                        Two
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="tenantCount" 
                          value="3" 
                          className="mr-3"
                          checked={tenantCount === 3}
                          onChange={() => {
                            setTenantCount(3);
                            setTenantNames(['', '', '']);
                          }}
                        />
                        Three
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="tenantCount" 
                          value="4+" 
                          className="mr-3"
                          checked={tenantCount === 4}
                          onChange={() => {
                            setTenantCount(4);
                            setTenantNames(['', '', '', '']);
                          }}
                        />
                        4+
                      </label>
                    </div>
                  </div>

                  {Array.from({ length: tenantCount }, (_, index) => (
                    <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                      <Field
                        label={tenantCount === 1 ? "What is the name of the tenant?" : `What is the name of tenant ${index + 1}?`}
                        type="text"
                        value={tenantNames[index] || ''}
                        onChange={(value) => {
                          const newNames = [...tenantNames];
                          newNames[index] = value;
                          setTenantNames(newNames);
                        }}
                        placeholder={tenantCount === 1 ? "e.g., Jane Smith" : `e.g., Tenant ${index + 1} Name`}
                        required
                        id={`tenant-name-${index}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 7: Property Rules */}
              {step === 7 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Property Rules</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Smoking Policy</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="smoking" 
                          value="prohibited" 
                          className="mr-3"
                          checked={formData.rules?.smoking === 'prohibited'}
                          onChange={() => updateFormData({ 
                            rules: { ...formData.rules, smoking: 'prohibited' } 
                          })}
                        />
                        Smoking prohibited
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="smoking" 
                          value="designated" 
                          className="mr-3"
                          checked={formData.rules?.smoking === 'designated'}
                          onChange={() => updateFormData({ 
                            rules: { ...formData.rules, smoking: 'designated' } 
                          })}
                        />
                        Smoking allowed in designated areas only
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="smoking" 
                          value="allowed" 
                          className="mr-3"
                          checked={formData.rules?.smoking === 'allowed'}
                          onChange={() => updateFormData({ 
                            rules: { ...formData.rules, smoking: 'allowed' } 
                          })}
                        />
                        Smoking allowed
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <Field
                      label="Parking Information (optional)"
                      type="text"
                      value={formData.rules?.parking || ''}
                      onChange={(value) => updateFormData({ 
                        rules: { ...formData.rules, parking: value } 
                      })}
                      placeholder="e.g., One assigned parking space in garage"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Subletting Policy</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="subletting" 
                          value="prohibited" 
                          className="mr-3"
                          checked={formData.rules?.subletting === 'prohibited'}
                          onChange={() => updateFormData({ 
                            rules: { ...formData.rules, subletting: 'prohibited' } 
                          })}
                        />
                        Subletting prohibited
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="subletting" 
                          value="with_consent" 
                          className="mr-3"
                          checked={formData.rules?.subletting === 'with_consent'}
                          onChange={() => updateFormData({ 
                            rules: { ...formData.rules, subletting: 'with_consent' } 
                          })}
                        />
                        Subletting allowed with landlord consent
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Rent */}
              {step === 6 && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">Rent</h3>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <Field
                      label="What is the monthly rent?"
                      type="number"
                      value={formData.financials?.monthlyRent || 0}
                      onChange={(value) => updateFormData({ 
                        financials: { ...formData.financials, monthlyRent: parseFloat(value) } 
                      })}
                      min="0"
                      step="0.01"
                      required
                      id="monthly-rent"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">When is rent due each month?</h4>
                    <p className="text-sm text-gray-600 mb-4">For example: '1st' of the month.</p>
                    <Field
                      type="text"
                      value="1st"
                      onChange={() => {}}
                    />
                  </div>


                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Should rent be prorated if the tenant moves in or out mid-month?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="proration" 
                          value="yes" 
                          className="mr-3"
                          checked={formData.financials?.prorationMethod === 'actual_days'}
                          onChange={() => updateFormData({ 
                            financials: { ...formData.financials, prorationMethod: 'actual_days' } 
                          })}
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="proration" 
                          value="no" 
                          className="mr-3" 
                          checked={formData.financials?.prorationMethod === '30_day_month'}
                          onChange={() => updateFormData({ 
                            financials: { ...formData.financials, prorationMethod: '30_day_month' } 
                          })}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Which utilities are included in the rent?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="utilities" 
                          value="all" 
                          className="mr-3"
                          checked={formData.financials?.utilitiesIncluded?.length === 6}
                          onChange={() => updateFormData({ 
                            financials: { ...formData.financials, utilitiesIncluded: ['water','sewer','trash','gas','electric','internet'] } 
                          })}
                        />
                        All utilities included
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="utilities" 
                          value="none" 
                          className="mr-3" 
                          checked={formData.financials?.utilitiesIncluded?.length === 0}
                          onChange={() => updateFormData({ 
                            financials: { ...formData.financials, utilitiesIncluded: [] } 
                          })}
                        />
                        No utilities included
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">What is the security deposit amount?</h4>
                    <Field
                      label="Security deposit amount"
                      type="number"
                      value={formData.financials?.securityDeposit || 0}
                      onChange={(value) => updateFormData({ 
                        financials: { ...formData.financials, securityDeposit: parseFloat(value) } 
                      })}
                      placeholder="e.g., 2500"
                      min="0"
                      step="0.01"
                      id="security-deposit"
                    />
                  </div>

                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
                    <h4 className="text-lg font-semibold mb-4">Late fees</h4>
                    <div className="space-y-4">
                      <Field
                        label="Late fee amount"
                        type="number"
                        value={formData.financials?.lateFee?.value || 0}
                        onChange={(value) => updateFormData({ 
                          financials: { 
                            ...formData.financials, 
                            lateFee: { 
                              ...formData.financials.lateFee, 
                              value: parseFloat(value) 
                            } 
                          } 
                        })}
                        placeholder="e.g., 50"
                        min="0"
                        step="0.01"
                        id="late-fee-amount"
                      />
                      <Field
                        label="Grace period (days)"
                        type="number"
                        value={formData.financials?.lateFee?.graceDays || 0}
                        onChange={(value) => updateFormData({ 
                          financials: { 
                            ...formData.financials, 
                            lateFee: { 
                              ...formData.financials.lateFee, 
                              graceDays: parseInt(value) 
                            } 
                          } 
                        })}
                        placeholder="e.g., 5"
                        min="0"
                        id="late-fee-grace-days"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Add more steps as needed... */}
            </div>
          </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center font-medium"
          >
            <span className="mr-2">←</span> Back
          </button>
          
          <div className="flex space-x-4">
            <button className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium">
              Skip
            </button>
            
            {step < steps.length ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isGenerating ? 'Generating...' : 'Generate Lease'}
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8">
            <ResultCard result={result} />
            
            {/* Export Options */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Download Your Lease</h3>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  📄 Download PDF
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  📝 Download Word
                </button>
                <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  🖨️ Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComprehensiveLeaseForm;
