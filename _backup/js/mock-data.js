// Mock Data for DentLink Prototype

const mockData = {
    patients: [
        {
            id: 1,
            name: 'محمد الأحمد',
            age: 32,
            phone: '0501234567',
            location: 'الرياض',
            symptoms: 'ألم في السن الأمامي',
            painLevel: 7,
            diagnosis: 'تسوس متوسط',
            image: null,
            status: 'pending',
            assignedTo: null,
            createdAt: '2025-11-19T10:00:00Z'
        },
        {
            id: 2,
            name: 'فاطمة السعيد',
            age: 28,
            phone: '0509876543',
            location: 'جدة',
            symptoms: 'نزيف في اللثة',
            painLevel: 4,
            diagnosis: 'التهاب لثة خفيف',
            image: null,
            status: 'assigned',
            assignedTo: 2,
            createdAt: '2025-11-18T14:30:00Z'
        },
        {
            id: 3,
            name: 'خالد العمري',
            age: 45,
            phone: '0555555555',
            location: 'الدمام',
            symptoms: 'تنظيف دوري',
            painLevel: 1,
            diagnosis: 'صيانة دورية',
            image: null,
            status: 'completed',
            assignedTo: 1,
            createdAt: '2025-11-17T09:15:00Z'
        }
    ],

    students: [
        {
            id: 1,
            name: 'أحمد العتيبي',
            university: 'جامعة الملك سعود',
            year: 4,
            level: 2,
            casesCompleted: 18,
            rating: 4.8,
            reviewCount: 24,
            badges: ['🏆', '🎯', '⭐'],
            specialization: 'علاج التسوس والحشوات',
            location: 'الرياض'
        },
        {
            id: 2,
            name: 'سارة القحطاني',
            university: 'جامعة الفيصل',
            year: 5,
            level: 3,
            casesCompleted: 28,
            rating: 4.9,
            reviewCount: 31,
            badges: ['⭐', '🎖️', '🏆', '💎'],
            specialization: 'علاج اللثة والتسوس',
            location: 'الرياض'
        }
    ],

    doctors: [
        {
            id: 1,
            name: 'd. محمد الشمري',
            specialization: 'أخصائي طب الأسنان',
            experience: 8,
            rating: 4.7,
            reviewCount: 156,
            clinic: 'عيادة الابتسامة الطبية',
            location: 'الرياض',
            price: 200,
            availability: 'متاح اليوم'
        },
        {
            id: 2,
            name: 'd. فاطمة النمر',
            specialization: 'استشارية طب الأسنان',
            experience: 12,
            rating: 4.9,
            reviewCount: 203,
            clinic: 'مركز النخبة لطب الأسنان',
            location: 'الرياض',
            price: 350,
            availability: 'متاح بعد يومين'
        },
        {
            id: 3,
            name: 'd. عبدالله الزهراني',
            specialization: 'طبيب أسنان عام',
            experience: 5,
            rating: 4.6,
            reviewCount: 89,
            clinic: 'عيادات الرعاية الأولية',
            location: 'جدة',
            price: 150,
            availability: 'متاح غداً'
        }
    ],

    cases: [
        {
            id: 'D2401',
            patientId: 1,
            studentId: 1,
            doctorId: 3,
            type: 'تسوس أسنان',
            status: 'in-progress',
            level: 2,
            xpPoints: 15,
            estimatedTime: '60-90 دقيقة',
            createdAt: '2025-11-19T10:00:00Z',
            history: {
                chiefComplaint: 'ألم في السن الأمامي العلوي منذ أسبوع',
                diagnosis: 'Dental Caries - Class III (Moderate)',
                treatment: 'حشوة كومبوزت'
            }
        },
        {
            id: 'D2402',
            patientId: 2,
            studentId: null,
            doctorId: null,
            type: 'التهاب لثة',
            status: 'pending',
            level: 1,
            xpPoints: 10,
            estimatedTime: '45 دقيقة',
            createdAt: '2025-11-18T14:30:00Z'
        },
        {
            id: 'D2403',
            patientId: 3,
            studentId: null,
            doctorId: null,
            type: 'تنظيف أسنان',
            status: 'pending',
            level: 1,
            xpPoints: 8,
            estimatedTime: '30 دقيقة',
            createdAt: '2025-11-17T09:15:00Z'
        }
    ],

    products: [
        {
            id: 1,
            name: 'مجموعة أدوات الفحص',
            category: 'tools',
            price: 150,
            stock: 25,
            rating: 4.8,
            reviews: 45,
            description: 'مجموعة كاملة من أدوات الفحص الأساسية للطلاب',
            seller: 'DentSupply Co.'
        },
        {
            id: 2,
            name: 'حشوة كومبوزت A2',
            category: 'materials',
            price: 280,
            stock: 15,
            rating: 4.9,
            reviews: 67,
            description: 'حشوة كومبوزت عالية الجودة - اللون A2',
            seller: '3M Dental'
        },
        {
            id: 3,
            name: 'قفازات طبية (100 قطعة)',
            category: 'protection',
            price: 45,
            stock: 100,
            rating: 4.7,
            reviews: 120,
            description: 'قفازات latex عالية الجودة - حماية قصوى',
            seller: 'MedGlove'
        }
    ],

    notifications: [
        {
            id: 1,
            type: 'case-assigned',
            title: 'حالة جديدة',
            message: 'تم تعيين حالة #D2401 لك',
            read: false,
            createdAt: '2025-11-19T10:00:00Z'
        },
        {
            id: 2,
            type: 'review-received',
            title: 'تقييم جديد',
            message: 'حصلت على تقييم 5 نجوم من المريض',
            read: false,
            createdAt: '2025-11-18T16:30:00Z'
        }
    ]
};

// Helper functions
function getPatientById(id) {
    return mockData.patients.find(p => p.id === id);
}

function getStudentById(id) {
    return mockData.students.find(s => s.id === id);
}

function getDoctorById(id) {
    return mockData.doctors.find(d => d.id === id);
}

function getCaseById(id) {
    return mockData.cases.find(c => c.id === id);
}

function saveCaseReport(caseId, reportData) {
    const caseIndex = mockData.cases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
        mockData.cases[caseIndex] = {
            ...mockData.cases[caseIndex],
            ...reportData,
            updatedAt: new Date().toISOString()
        };
        return true;
    }
    return false;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
}
