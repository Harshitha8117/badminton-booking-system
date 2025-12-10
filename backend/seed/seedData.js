const mongoose = require('mongoose');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/badminton_booking';
async function seed() {
  await mongoose.connect(MONGO_URI);
  await Court.deleteMany({});
  await Equipment.deleteMany({});
  await Coach.deleteMany({});
  await PricingRule.deleteMany({});
  await Court.insertMany([
    { name: 'Court 1', type: 'indoor', basePrice: 12 },
    { name: 'Court 2', type: 'indoor', basePrice: 12 },
    { name: 'Court 3', type: 'outdoor', basePrice: 8 },
    { name: 'Court 4', type: 'outdoor', basePrice: 8 }
  ]);
  await Equipment.insertMany([
    { name: 'Racket', type: 'racket', totalStock: 10, pricePerUnit: 5 },
    { name: 'Shoes', type: 'shoes', totalStock: 8, pricePerUnit: 3 }
  ]);
  await Coach.insertMany([
    { name: 'Alice', hourlyRate: 20 },
    { name: 'Bob', hourlyRate: 18 },
    { name: 'Charlie', hourlyRate: 22 }
  ]);
  await PricingRule.insertMany([
    { name:'Peak Hours', type:'peak', startHour:18, endHour:21, multiplier:1.5, enabled:true },
    { name:'Weekend Surcharge', type:'weekend', surcharge:3, enabled:true },
    { name:'Indoor Premium', type:'indoorPremium', surcharge:2, enabled:true }
  ]);
  console.log('Seed complete');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
