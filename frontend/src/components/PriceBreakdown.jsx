import React from 'react';
import { formatPrice } from '../services/pricingService';
export default function PriceBreakdown({pricing}) {
  if(!pricing) return null;
  return (
    <div style={{border:'1px solid #ddd', padding:10, marginTop:10}}>
      <h3>Price</h3>
      <div>Base: {formatPrice(pricing.basePrice)}</div>
      <div>Total: <strong>{formatPrice(pricing.total)}</strong></div>
    </div>
  );
}
