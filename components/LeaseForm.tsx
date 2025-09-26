'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeaseInputSchema, LeaseInput } from '@/lib/schema';
import { Field } from './Field';

interface LeaseFormProps {
  onSubmit: (data: LeaseInput) => Promise<void>;
  isLoading: boolean;
}

export function LeaseForm({ onSubmit, isLoading }: LeaseFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<LeaseInput>({
    resolver: zodResolver(LeaseInputSchema),
    defaultValues: {
      jurisdiction: {
        country: 'US',
        state: '',
        city: '',
      },
      landlord: {
        name: '',
        email: '',
        address: '',
      },
      tenant: {
        name: '',
        email: '',
      },
      property: {
        address: '',
        type: 'apartment',
      },
      term: {
        startDate: '',
        endDate: '',
        months: 12,
        renewal: 'none',
      },
      financials: {
        monthlyRent: 0,
        securityDeposit: 0,
        lateFee: {
          type: 'flat',
          value: 0,
          graceDays: 0,
        },
        prorationMethod: 'actual_days',
        utilitiesIncluded: [],
      },
      pets: {
        allowed: false,
        fee: 0,
        deposit: 0,
        rent: 0,
        restrictions: '',
      },
      rules: {
        smoking: 'prohibited',
        parking: '',
        subletting: 'with_consent',
        alterations: 'with_consent',
        insuranceRequired: false,
      },
      notices: {
        delivery: 'both',
      },
      signatures: {
        method: 'e-sign',
      },
    },
  });

  const watchedValues = watch();

  const steps = [
    { title: 'Jurisdiction', fields: ['jurisdiction'] },
    { title: 'Parties', fields: ['landlord', 'tenant'] },
    { title: 'Property', fields: ['property'] },
    { title: 'Term', fields: ['term'] },
    { title: 'Financials', fields: ['financials'] },
    { title: 'Pets', fields: ['pets'] },
    { title: 'Rules', fields: ['rules'] },
    { title: 'Signatures', fields: ['signatures', 'notices'] },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = async (data: LeaseInput) => {
    await onSubmit(data);
  };

  const renderJurisdictionStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Jurisdiction</h3>
      
      <Field
        label="Country"
        name="jurisdiction.country"
        value={watchedValues.jurisdiction?.country}
        onChange={(value) => setValue('jurisdiction.country', value)}
        required
        error={errors.jurisdiction?.country?.message}
      />
      
      <Field
        label="State/Province"
        name="jurisdiction.state"
        value={watchedValues.jurisdiction?.state}
        onChange={(value) => setValue('jurisdiction.state', value)}
        error={errors.jurisdiction?.state?.message}
      />
      
      <Field
        label="City"
        name="jurisdiction.city"
        value={watchedValues.jurisdiction?.city}
        onChange={(value) => setValue('jurisdiction.city', value)}
        error={errors.jurisdiction?.city?.message}
      />
    </div>
  );

  const renderPartiesStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Parties</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Landlord</h4>
          <Field
            label="Full Name"
            name="landlord.name"
            value={watchedValues.landlord?.name}
            onChange={(value) => setValue('landlord.name', value)}
            required
            error={errors.landlord?.name?.message}
          />
          <Field
            label="Email (Optional)"
            name="landlord.email"
            type="email"
            value={watchedValues.landlord?.email}
            onChange={(value) => setValue('landlord.email', value)}
            error={errors.landlord?.email?.message}
          />
          <Field
            label="Address"
            name="landlord.address"
            value={watchedValues.landlord?.address}
            onChange={(value) => setValue('landlord.address', value)}
            required
            error={errors.landlord?.address?.message}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Tenant</h4>
          <Field
            label="Full Name"
            name="tenant.name"
            value={watchedValues.tenant?.name}
            onChange={(value) => setValue('tenant.name', value)}
            required
            error={errors.tenant?.name?.message}
          />
          <Field
            label="Email (Optional)"
            name="tenant.email"
            type="email"
            value={watchedValues.tenant?.email}
            onChange={(value) => setValue('tenant.email', value)}
            error={errors.tenant?.email?.message}
          />
        </div>
      </div>
    </div>
  );

  const renderPropertyStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Property</h3>
      
      <Field
        label="Property Address"
        name="property.address"
        value={watchedValues.property?.address}
        onChange={(value) => setValue('property.address', value)}
        required
        error={errors.property?.address?.message}
      />
      
      <Field
        label="Property Type"
        name="property.type"
        type="select"
        value={watchedValues.property?.type}
        onChange={(value) => setValue('property.type', value as any)}
        options={[
          { value: 'apartment', label: 'Apartment' },
          { value: 'house', label: 'House' },
          { value: 'condo', label: 'Condo' },
          { value: 'duplex', label: 'Duplex' },
          { value: 'townhouse', label: 'Townhouse' },
        ]}
        error={errors.property?.type?.message}
      />
    </div>
  );

  const renderTermStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Lease Term</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Start Date"
          name="term.startDate"
          type="date"
          value={watchedValues.term?.startDate}
          onChange={(value) => setValue('term.startDate', value)}
          required
          error={errors.term?.startDate?.message}
        />
        
        <Field
          label="End Date (Optional)"
          name="term.endDate"
          type="date"
          value={watchedValues.term?.endDate}
          onChange={(value) => setValue('term.endDate', value)}
          error={errors.term?.endDate?.message}
        />
      </div>
      
      <Field
        label="Lease Duration (Months)"
        name="term.months"
        type="number"
        value={watchedValues.term?.months}
        onChange={(value) => setValue('term.months', parseInt(value) || 0)}
        error={errors.term?.months?.message}
      />
      
      <Field
        label="Renewal Option"
        name="term.renewal"
        type="select"
        value={watchedValues.term?.renewal}
        onChange={(value) => setValue('term.renewal', value as any)}
        options={[
          { value: 'none', label: 'No Renewal' },
          { value: 'auto', label: 'Automatic Renewal' },
          { value: 'mutual', label: 'Mutual Agreement' },
        ]}
        error={errors.term?.renewal?.message}
      />
    </div>
  );

  const renderFinancialsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Financial Terms</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Monthly Rent ($)"
          name="financials.monthlyRent"
          type="number"
          value={watchedValues.financials?.monthlyRent}
          onChange={(value) => setValue('financials.monthlyRent', parseFloat(value) || 0)}
          required
          error={errors.financials?.monthlyRent?.message}
        />
        
        <Field
          label="Security Deposit ($)"
          name="financials.securityDeposit"
          type="number"
          value={watchedValues.financials?.securityDeposit}
          onChange={(value) => setValue('financials.securityDeposit', parseFloat(value) || 0)}
          error={errors.financials?.securityDeposit?.message}
        />
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Late Fees</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label="Type"
            name="financials.lateFee.type"
            type="select"
            value={watchedValues.financials?.lateFee?.type}
            onChange={(value) => setValue('financials.lateFee.type', value as any)}
            options={[
              { value: 'flat', label: 'Flat Amount' },
              { value: 'percent', label: 'Percentage' },
            ]}
          />
          <Field
            label="Value"
            name="financials.lateFee.value"
            type="number"
            value={watchedValues.financials?.lateFee?.value}
            onChange={(value) => setValue('financials.lateFee.value', parseFloat(value) || 0)}
          />
          <Field
            label="Grace Days"
            name="financials.lateFee.graceDays"
            type="number"
            value={watchedValues.financials?.lateFee?.graceDays}
            onChange={(value) => setValue('financials.lateFee.graceDays', parseInt(value) || 0)}
          />
        </div>
      </div>
      
      <Field
        label="Proration Method"
        name="financials.prorationMethod"
        type="select"
        value={watchedValues.financials?.prorationMethod}
        onChange={(value) => setValue('financials.prorationMethod', value as any)}
        options={[
          { value: 'actual_days', label: 'Actual Days' },
          { value: '30_day_month', label: '30-Day Month' },
        ]}
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Utilities Included</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['water', 'sewer', 'trash', 'gas', 'electric', 'internet'].map((utility) => (
            <label key={utility} className="flex items-center">
              <input
                type="checkbox"
                checked={watchedValues.financials?.utilitiesIncluded?.includes(utility as any) || false}
                onChange={(e) => {
                  const current = watchedValues.financials?.utilitiesIncluded || [];
                  if (e.target.checked) {
                    setValue('financials.utilitiesIncluded', [...current, utility as any]);
                  } else {
                    setValue('financials.utilitiesIncluded', current.filter((u: any) => u !== utility));
                  }
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{utility}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPetsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Pet Policy</h3>
      
      <Field
        label="Pets Allowed"
        name="pets.allowed"
        type="checkbox"
        value={watchedValues.pets?.allowed}
        onChange={(value) => setValue('pets.allowed', value)}
      />
      
      {watchedValues.pets?.allowed && (
        <div className="space-y-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field
              label="Pet Fee ($)"
              name="pets.fee"
              type="number"
              value={watchedValues.pets?.fee}
              onChange={(value) => setValue('pets.fee', parseFloat(value) || 0)}
            />
            <Field
              label="Pet Deposit ($)"
              name="pets.deposit"
              type="number"
              value={watchedValues.pets?.deposit}
              onChange={(value) => setValue('pets.deposit', parseFloat(value) || 0)}
            />
            <Field
              label="Pet Rent ($/month)"
              name="pets.rent"
              type="number"
              value={watchedValues.pets?.rent}
              onChange={(value) => setValue('pets.rent', parseFloat(value) || 0)}
            />
          </div>
          <Field
            label="Pet Restrictions"
            name="pets.restrictions"
            type="textarea"
            value={watchedValues.pets?.restrictions}
            onChange={(value) => setValue('pets.restrictions', value)}
            placeholder="e.g., No aggressive breeds, maximum 2 pets, etc."
          />
        </div>
      )}
    </div>
  );

  const renderRulesStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
      
      <Field
        label="Smoking Policy"
        name="rules.smoking"
        type="select"
        value={watchedValues.rules?.smoking}
        onChange={(value) => setValue('rules.smoking', value as any)}
        options={[
          { value: 'prohibited', label: 'Prohibited' },
          { value: 'designated', label: 'Designated Areas Only' },
          { value: 'allowed', label: 'Allowed' },
        ]}
      />
      
      <Field
        label="Parking"
        name="rules.parking"
        value={watchedValues.rules?.parking}
        onChange={(value) => setValue('rules.parking', value)}
        placeholder="e.g., One assigned space, Street parking only, etc."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Subletting"
          name="rules.subletting"
          type="select"
          value={watchedValues.rules?.subletting}
          onChange={(value) => setValue('rules.subletting', value as any)}
          options={[
            { value: 'prohibited', label: 'Prohibited' },
            { value: 'with_consent', label: 'With Landlord Consent' },
          ]}
        />
        
        <Field
          label="Alterations"
          name="rules.alterations"
          type="select"
          value={watchedValues.rules?.alterations}
          onChange={(value) => setValue('rules.alterations', value as any)}
          options={[
            { value: 'prohibited', label: 'Prohibited' },
            { value: 'with_consent', label: 'With Landlord Consent' },
          ]}
        />
      </div>
      
      <Field
        label="Tenant Insurance Required"
        name="rules.insuranceRequired"
        type="checkbox"
        value={watchedValues.rules?.insuranceRequired}
        onChange={(value) => setValue('rules.insuranceRequired', value)}
      />
    </div>
  );

  const renderSignaturesStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Signatures & Notices</h3>
      
      <Field
        label="Signature Method"
        name="signatures.method"
        type="select"
        value={watchedValues.signatures?.method}
        onChange={(value) => setValue('signatures.method', value as any)}
        options={[
          { value: 'e-sign', label: 'Electronic Signature' },
          { value: 'wet', label: 'Wet Signature' },
        ]}
      />
      
      <Field
        label="Notice Delivery"
        name="notices.delivery"
        type="select"
        value={watchedValues.notices?.delivery}
        onChange={(value) => setValue('notices.delivery', value as any)}
        options={[
          { value: 'email', label: 'Email Only' },
          { value: 'mail', label: 'Mail Only' },
          { value: 'both', label: 'Email and Mail' },
        ]}
      />
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderJurisdictionStep();
      case 2: return renderPartiesStep();
      case 3: return renderPropertyStep();
      case 4: return renderTermStep();
      case 5: return renderFinancialsStep();
      case 6: return renderPetsStep();
      case 7: return renderRulesStep();
      case 8: return renderSignaturesStep();
      default: return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="text-center">
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
        </span>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Lease'}
          </button>
        )}
      </div>
    </form>
  );
}
