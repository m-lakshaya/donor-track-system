export const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@bloodbank.com',
    password: 'password123',
    role: 'admin',
    details: {
      location: 'Central Blood Bank'
    }
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@donor.com',
    password: 'password123',
    role: 'donor',
    details: {
      bloodGroup: 'A+',
      age: 28,
      phone: '123-456-7890',
      history: [
        { id: 1, date: '2025-10-10', location: 'City Hospital' }
      ]
    }
  },
  {
    id: 3,
    name: 'City General Hospital',
    email: 'hospital@city.com',
    password: 'password123',
    role: 'hospital',
    details: {
      address: '123 Health St',
      phone: '555-0199'
    }
  }
];

export const MOCK_STOCK = [
  { group: 'A+', quantity: 15 },
  { group: 'A-', quantity: 5 },
  { group: 'B+', quantity: 20 },
  { group: 'B-', quantity: 8 },
  { group: 'AB+', quantity: 12 },
  { group: 'AB-', quantity: 3 },
  { group: 'O+', quantity: 30 },
  { group: 'O-', quantity: 7 },
];

export const MOCK_REQUESTS = [
  {
    id: 1,
    hospitalId: 3,
    hospitalName: 'City General Hospital',
    patientName: 'Jane Smith',
    bloodGroup: 'O-',
    units: 2,
    status: 'pending', // pending, approved, rejected
    date: '2026-01-23'
  },
  {
    id: 2,
    hospitalId: 3,
    hospitalName: 'City General Hospital',
    patientName: 'Bob Brown',
    bloodGroup: 'A+',
    units: 1,
    status: 'approved',
    date: '2026-01-22'
  }
];
