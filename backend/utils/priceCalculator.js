// backend/utils/priceCalculator.js

function calculatePrice({ court, coach, equipment, date, rules }) {
  let base = court.basePrice;
  const hourly = coach ? coach.hourlyRate : 0;

  const rackets = equipment?.rackets || 0;
  const shoes = equipment?.shoes || 0;

  let total = base + hourly + rackets * 5 + shoes * 3;

  const dt = new Date(date);
  const hour = dt.getHours();
  const day = dt.getDay();

  rules.forEach(rule => {
    if (!rule.enabled) return;

    if (rule.type === 'weekend' && (day === 0 || day === 6)) {
      total += rule.surcharge || 0;
    }

    if (rule.type === 'peak' && hour >= rule.startHour && hour < rule.endHour) {
      total *= rule.multiplier || 1;
    }

    if (rule.type === 'indoorPremium' && court.type === 'indoor') {
      total += rule.surcharge || 0;
    }
  });

  return {
    basePrice: base,
    total: Number(total.toFixed(2))
  };
}

module.exports = calculatePrice;
