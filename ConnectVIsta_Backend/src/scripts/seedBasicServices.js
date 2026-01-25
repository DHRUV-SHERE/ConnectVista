const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

const basicServices = [
  { name: 'Plumbing Repair', category: 'plumbing', description: 'General plumbing repair services' },
  { name: 'Electrical Wiring', category: 'electrical', description: 'Electrical installation and repair' },
  { name: 'House Cleaning', category: 'cleaning', description: 'Professional house cleaning' },
  { name: 'Carpentry Work', category: 'carpentry', description: 'Custom carpentry services' },
  { name: 'Interior Painting', category: 'painting', description: 'Interior painting services' },
  { name: 'Appliance Repair', category: 'appliance-repair', description: 'Home appliance repair' }
];

const seedBasicServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    for (const service of basicServices) {
      await Service.findOneAndUpdate(
        { name: service.name },
        service,
        { upsert: true, new: true }
      );
    }
    
    console.log('Basic services seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

seedBasicServices();