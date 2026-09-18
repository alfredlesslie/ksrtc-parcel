export const DEPOTS = [
  'Thrissur',
  'Ernakulam',
  'Kochi',
  'Alappuzha',
  'Kozhikode',
  'Munnar'
];

export const CATEGORIES = [
  'Documents',
  'Books',
  'Electronics',
  'Clothing',
  'Other'
];

export const STATUS_STAGES = [
  { id: 'BOOKED', label: 'BOOKED', description: 'Origin Depot' },
  { id: 'ACCEPTED', label: 'ACCEPTED', description: 'Depot Courier Counter' },
  { id: 'LOADED', label: 'LOADED', description: 'KSRTC Fleet Van / Bus' },
  { id: 'IN_TRANSIT', label: 'IN TRANSIT', description: 'KSRTC network' },
  { id: 'ARRIVED', label: 'ARRIVED', description: 'Destination Depot' },
  { id: 'READY_FOR_COLLECTION', label: 'READY FOR COLLECTION', description: 'Destination Parcel Counter' },
  { id: 'COLLECTED', label: 'COLLECTED', description: 'Handed over to receiver' }
];

export const STATUS_INDEX = {
  BOOKED: 0,
  ACCEPTED: 1,
  LOADED: 2,
  IN_TRANSIT: 3,
  ARRIVED: 4,
  READY_FOR_COLLECTION: 5,
  COLLECTED: 6,
  CANCELLED: -1
};

export const calculateEstimatedCharge = (weightKg, isFragile = false) => {
  const parsedWeight = parseFloat(weightKg) || 1.0;
  const baseRate = 50;
  const weightRate = Math.max(0, Math.ceil(parsedWeight) * 18);
  const fragileSurcharge = isFragile ? 25 : 0;
  return baseRate + weightRate + fragileSurcharge;
};

// Mask personal name for privacy: e.g. "Arjun Kumar" -> "A***n"
export const maskName = (fullName) => {
  if (!fullName) return 'C***r';
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  if (first.length <= 2) {
    return `${first[0]}***`;
  }
  return `${first[0]}***${first[first.length - 1]}`;
};

export const INITIAL_PARCELS = [
  {
    id: 'KRL-28491',
    origin: 'Thrissur',
    destination: 'Ernakulam',
    bookingDate: '18 Sept 2026',
    sender: {
      name: 'K. V. Suresh',
      mobile: '9447123456'
    },
    receiver: {
      name: 'Anjali Menon',
      mobile: '9846123456'
    },
    category: 'Books',
    weight: 3.5,
    description: 'Educational reference manuals & study material',
    isFragile: false,
    estimatedCost: 122,
    currentStatus: 'IN_TRANSIT',
    lastUpdated: '18 Sept 2026, 10:30 AM',
    otp: '4821',
    expectedCollection: {
      date: 'Today',
      timeWindow: '2:00 PM – 4:00 PM',
      depot: 'Ernakulam Depot',
      isUpdated: false,
      previousTimeWindow: null
    },
    notificationSaved: false,
    reportedIssues: [],
    timeline: [
      {
        stage: 'BOOKED',
        location: 'Thrissur Depot',
        timestamp: '18 Sept 2026, 09:15 AM',
        note: 'Consignment booked at Thrissur courier counter'
      },
      {
        stage: 'ACCEPTED',
        location: 'Thrissur Depot',
        timestamp: '18 Sept 2026, 09:35 AM',
        note: 'Inspected and verified at counter'
      },
      {
        stage: 'LOADED',
        location: 'Thrissur Depot',
        timestamp: '18 Sept 2026, 10:10 AM',
        note: 'Loaded onto KSRTC Super Fast service'
      },
      {
        stage: 'IN_TRANSIT',
        location: 'KSRTC network',
        timestamp: '18 Sept 2026, 10:30 AM',
        note: 'Recorded en route via NH 544 corridor towards Ernakulam Depot'
      }
    ]
  },
  {
    id: 'KRL-28492',
    origin: 'Kochi',
    destination: 'Munnar',
    bookingDate: '18 Sept 2026',
    sender: {
      name: 'Priya Nair',
      mobile: '9447987654'
    },
    receiver: {
      name: 'George Varghese',
      mobile: '9846987654'
    },
    category: 'Documents',
    weight: 1.2,
    description: 'Legal property papers & surveyor blueprints',
    isFragile: false,
    estimatedCost: 86,
    currentStatus: 'LOADED',
    lastUpdated: '18 Sept 2026, 10:00 AM',
    otp: '1904',
    expectedCollection: {
      date: 'Today',
      timeWindow: '5:00 PM – 7:00 PM',
      depot: 'Munnar Depot',
      isUpdated: false,
      previousTimeWindow: null
    },
    notificationSaved: false,
    reportedIssues: [],
    timeline: [
      {
        stage: 'BOOKED',
        location: 'Kochi Depot',
        timestamp: '18 Sept 2026, 08:30 AM',
        note: 'Registered at Kochi central booking window'
      },
      {
        stage: 'ACCEPTED',
        location: 'Kochi Depot',
        timestamp: '18 Sept 2026, 09:00 AM',
        note: 'Security sealed in water-resistant pouch'
      },
      {
        stage: 'LOADED',
        location: 'Kochi Depot',
        timestamp: '18 Sept 2026, 10:00 AM',
        note: 'Stowed in forward cargo compartment on Munnar High-Range service'
      }
    ]
  },
  {
    id: 'KRL-28493',
    origin: 'Thrissur',
    destination: 'Kochi',
    bookingDate: '17 Sept 2026',
    sender: {
      name: 'Sangeetha Menon',
      mobile: '9447555123'
    },
    receiver: {
      name: 'Arjun Kumar',
      mobile: '9846555432'
    },
    category: 'Electronics',
    weight: 4.0,
    description: 'Refurbished laptop & accessories',
    isFragile: true,
    estimatedCost: 147,
    currentStatus: 'ARRIVED',
    lastUpdated: '18 Sept 2026, 08:30 AM',
    otp: '2849', // Hackathon demo OTP
    expectedCollection: {
      date: 'Today',
      timeWindow: '10:00 AM – 1:00 PM',
      depot: 'Kochi Depot',
      isUpdated: false,
      previousTimeWindow: null
    },
    notificationSaved: false,
    reportedIssues: [],
    timeline: [
      {
        stage: 'BOOKED',
        location: 'Thrissur Depot',
        timestamp: '17 Sept 2026, 04:00 PM',
        note: 'Counter booking confirmed'
      },
      {
        stage: 'ACCEPTED',
        location: 'Thrissur Depot',
        timestamp: '17 Sept 2026, 04:45 PM',
        note: 'Cushioned pack tagged fragile'
      },
      {
        stage: 'LOADED',
        location: 'Thrissur Depot',
        timestamp: '17 Sept 2026, 06:15 PM',
        note: 'Dispatched on evening KSRTC express'
      },
      {
        stage: 'IN_TRANSIT',
        location: 'KSRTC network',
        timestamp: '17 Sept 2026, 07:30 PM',
        note: 'Recorded at Angamaly transit point'
      },
      {
        stage: 'ARRIVED',
        location: 'Kochi Depot',
        timestamp: '18 Sept 2026, 08:30 AM',
        note: 'Safely unloaded and cataloged at Kochi depot sorting dock'
      }
    ]
  },
  {
    id: 'KRL-28494',
    origin: 'Kochi',
    destination: 'Alappuzha',
    bookingDate: '17 Sept 2026',
    sender: {
      name: 'Mathew Joseph',
      mobile: '9447111222'
    },
    receiver: {
      name: 'Reshma R.',
      mobile: '9846333444'
    },
    category: 'Clothing',
    weight: 2.0,
    description: 'Traditional Kasavu handloom textiles',
    isFragile: false,
    estimatedCost: 86,
    currentStatus: 'READY_FOR_COLLECTION',
    lastUpdated: '18 Sept 2026, 07:30 AM',
    otp: '7391',
    expectedCollection: {
      date: 'Today',
      timeWindow: 'Ready Now (Until 8:00 PM)',
      depot: 'Alappuzha Depot',
      isUpdated: false,
      previousTimeWindow: null
    },
    notificationSaved: true,
    reportedIssues: [],
    timeline: [
      {
        stage: 'BOOKED',
        location: 'Kochi Depot',
        timestamp: '17 Sept 2026, 02:00 PM',
        note: 'Booking registered'
      },
      {
        stage: 'ACCEPTED',
        location: 'Kochi Depot',
        timestamp: '17 Sept 2026, 02:30 PM',
        note: 'Weighed and labelled'
      },
      {
        stage: 'LOADED',
        location: 'Kochi Depot',
        timestamp: '17 Sept 2026, 04:00 PM',
        note: 'Dispatched via coastal route'
      },
      {
        stage: 'IN_TRANSIT',
        location: 'KSRTC network',
        timestamp: '17 Sept 2026, 05:15 PM',
        note: 'Recorded transit in progress'
      },
      {
        stage: 'ARRIVED',
        location: 'Alappuzha Depot',
        timestamp: '17 Sept 2026, 08:00 PM',
        note: 'Received at depot cargo shed'
      },
      {
        stage: 'READY_FOR_COLLECTION',
        location: 'Alappuzha Depot',
        timestamp: '18 Sept 2026, 07:30 AM',
        note: 'Processed and staged at customer pickup counter Bay-2'
      }
    ]
  },
  {
    id: 'KRL-28495',
    origin: 'Thrissur',
    destination: 'Kozhikode',
    bookingDate: '18 Sept 2026',
    sender: {
      name: 'Haridasan Nair',
      mobile: '9447778899'
    },
    receiver: {
      name: 'Fatima Zahra',
      mobile: '9846887766'
    },
    category: 'Documents',
    weight: 0.8,
    description: 'Academic certificates & transcripts',
    isFragile: false,
    estimatedCost: 68,
    currentStatus: 'ACCEPTED',
    lastUpdated: '18 Sept 2026, 11:20 AM',
    otp: '3152',
    expectedCollection: {
      date: 'Tomorrow',
      timeWindow: '10:00 AM – 1:00 PM',
      depot: 'Kozhikode Depot',
      isUpdated: false,
      previousTimeWindow: null
    },
    notificationSaved: false,
    reportedIssues: [],
    timeline: [
      {
        stage: 'BOOKED',
        location: 'Thrissur Depot',
        timestamp: '18 Sept 2026, 10:45 AM',
        note: 'Counter docket created'
      },
      {
        stage: 'ACCEPTED',
        location: 'Thrissur Depot',
        timestamp: '18 Sept 2026, 11:20 AM',
        note: 'Verified and queued for northern corridor departure'
      }
    ]
  }
];
