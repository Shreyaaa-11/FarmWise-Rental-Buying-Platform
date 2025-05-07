import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/contexts/TranslationContext';

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(6, 'Valid postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
}

export function AddressForm({ onSubmit, isLoading }: AddressFormProps) {
  const { translate } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          {translate('Full Name')}
        </label>
        <Input
          id="fullName"
          {...register('fullName')}
          placeholder={translate('Enter your full name')}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
          {translate('Phone Number')}
        </label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register('phoneNumber')}
          placeholder={translate('Enter your phone number')}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium mb-1">
          {translate('Address Line 1')}
        </label>
        <Input
          id="addressLine1"
          {...register('addressLine1')}
          placeholder={translate('Enter your street address')}
        />
        {errors.addressLine1 && (
          <p className="text-sm text-red-500 mt-1">{errors.addressLine1.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="addressLine2" className="block text-sm font-medium mb-1">
          {translate('Address Line 2')} ({translate('Optional')})
        </label>
        <Input
          id="addressLine2"
          {...register('addressLine2')}
          placeholder={translate('Apartment, suite, unit, etc.')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            {translate('City')}
          </label>
          <Input
            id="city"
            {...register('city')}
            placeholder={translate('Enter your city')}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">
            {translate('State')}
          </label>
          <Input
            id="state"
            {...register('state')}
            placeholder={translate('Enter your state')}
          />
          {errors.state && (
            <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
            {translate('Postal Code')}
          </label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder={translate('Enter postal code')}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            {translate('Country')}
          </label>
          <Input
            id="country"
            {...register('country')}
            placeholder={translate('Enter your country')}
          />
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? translate('Processing...') : translate('Continue to Payment')}
      </Button>
    </form>
  );
} 