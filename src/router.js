import Navigo from 'navigo';
import { authService } from './lib/auth.js';

const router = new Navigo('/', { hash: true });

const render = async (path, callback) => {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Page not found');
        const html = await response.text();
        document.getElementById('content').innerHTML = html;
        router.updatePageLinks();
        if (callback) callback();
    } catch (error) {
        console.error(error);
        document.getElementById('content').innerHTML = '<h1>404 - Page Not Found</h1>';
    }
};

const setupLoginEvents = () => {
    const tabs = document.querySelectorAll('.user-type-btn');
    let currentRole = 'patient';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentRole = tab.dataset.type;
        });
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('.btn-primary');
            const originalText = btn.innerText;
            btn.innerText = 'جاري الدخول...';

            const email = loginForm.querySelector('input[type="text"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                await authService.login(email, password);
                console.log(`Logged in as ${currentRole}`);
                if (currentRole === 'patient') {
                    router.navigate('/patient/diagnosis');
                } else {
                    alert(`Login for ${currentRole} not implemented yet`);
                }
            } catch (error) {
                console.error('Login failed:', error);
                alert('فشل تسجيل الدخول: ' + error.message);
            } finally {
                btn.innerText = originalText;
            }
        });
    }
};

const setupPatientRegisterEvents = () => {
    const form = document.getElementById('patientRegisterForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const passwords = document.querySelectorAll('input[type="password"]');
            if (passwords.length >= 2 && passwords[0].value !== passwords[1].value) {
                alert('كلمات المرور غير متطابقة');
                return;
            }

            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const password = passwords[0].value;

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'جاري التسجيل...';

            try {
                await authService.register(email, password, name);
                localStorage.setItem('userType', 'patient');
                router.navigate('/patient/diagnosis');
            } catch (error) {
                console.error('Registration failed:', error);
                alert('فشل التسجيل: ' + error.message);
            } finally {
                btn.innerText = originalText;
            }
        });
    }
};

const setupDiagnosisEvents = () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const uploadSection = document.getElementById('uploadSection');
    const analyzingSection = document.getElementById('analyzingSection');
    const resultsSection = document.getElementById('resultsSection');
    const resetUploadBtn = document.getElementById('resetUploadBtn');
    const startAnalysisBtn = document.getElementById('startAnalysisBtn');

    if (!uploadArea || !fileInput) return;

    const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                uploadArea.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) handleFile(files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    if (resetUploadBtn) {
        resetUploadBtn.addEventListener('click', () => {
            uploadArea.style.display = 'block';
            previewContainer.style.display = 'none';
            fileInput.value = '';
        });
    }

    if (startAnalysisBtn) {
        startAnalysisBtn.addEventListener('click', () => {
            uploadSection.style.display = 'none';
            analyzingSection.style.display = 'block';

            // Simulate AI analysis
            setTimeout(() => {
                analyzingSection.style.display = 'none';
                resultsSection.style.display = 'block';
                resultsSection.style.animation = 'fadeIn 0.6s ease-out';
                localStorage.setItem('diagnosisComplete', 'true');
            }, 3000);
        });
    }
};

export const initRouter = () => {
    window.router = router;

    router
        .on({
            '/': () => render('/views/home.html'),
            '/login': () => render('/views/login.html', setupLoginEvents),
            '/register': () => render('/views/register-select.html'),
            '/patient/register': () => render('/views/patient/register.html', setupPatientRegisterEvents),
            '/patient/diagnosis': () => render('/views/patient/diagnosis.html', setupDiagnosisEvents),
            '/student/dashboard': () => render('/views/student/dashboard.html'),
            '/student/cases': () => render('/views/student/case-requests.html', setupCaseRequestsEvents),
        })
        .resolve();
};

const setupCaseRequestsEvents = () => {
    const patientsData = {
        'REQ-001': {
            name: 'أحمد محمد علي',
            age: '28 سنة',
            phone: '01234567890',
            address: 'القاهرة، مدينة نصر',
            chronicDiseases: ['السكري من النوع 2'],
            medications: ['Metformin 500mg - مرتين يومياً'],
            allergies: ['⚠️ حساسية من البنسلين'],
            surgeries: ['استئصال الزائدة الدودية - 2020'],
            previousIssues: ['تسوس في الضرس العلوي الأيمن - تم العلاج', 'التهاب اللثة - تحت العلاج']
        },
        'REQ-002': {
            name: 'فاطمة حسن',
            age: '35 سنة',
            phone: '01098765432',
            address: 'الجيزة، المهندسين',
            chronicDiseases: ['لا يوجد'],
            medications: ['لا يوجد'],
            allergies: ['لا يوجد'],
            surgeries: ['لا يوجد'],
            previousIssues: ['زيارة دورية للمتابعة فقط']
        },
        'REQ-003': {
            name: 'محمود عبد الله',
            age: '52 سنة',
            phone: '01123456789',
            address: 'القاهرة، مصر الجديدة',
            chronicDiseases: ['ضغط الدم المرتفع', 'الكوليسترول'],
            medications: ['Amlodipine 5mg - يومياً', 'Atorvastatin 20mg - يومياً'],
            allergies: ['لا يوجد'],
            surgeries: ['عملية قلب مفتوح - 2018'],
            previousIssues: ['تركيب تاج سني - 2022', 'خلع ضرس العقل - 2020']
        }
    };

    let currentRequestId = null;
    const modal = document.getElementById('patientModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confirmAcceptBtn = document.getElementById('confirmAcceptBtn');

    const closeModal = () => {
        modal.classList.remove('active');
        currentRequestId = null;
    };

    const updatePendingCount = () => {
        const count = document.querySelectorAll('.case-request-card').length;
        document.getElementById('pendingCount').textContent = count;
        const badge = document.getElementById('notificationBadge');
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
            document.getElementById('requestsContainer').style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
        }
    };

    const attachEventListeners = () => {
        // Re-attach accept buttons
        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true)); // Remove old listeners
        });
        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const requestId = e.target.dataset.id;
                currentRequestId = requestId;
                const patient = patientsData[requestId];

                if (patient) {
                    document.getElementById('modalPatientName').textContent = `بيانات المريض: ${patient.name}`;
                    document.getElementById('modalFullName').textContent = patient.name;
                    document.getElementById('modalAge').textContent = patient.age;
                    document.getElementById('modalPhone').textContent = patient.phone;
                    document.getElementById('modalAddress').textContent = patient.address;

                    document.getElementById('chronicDiseases').innerHTML = patient.chronicDiseases.map(d => `<div class="list-item">${d}</div>`).join('');
                    document.getElementById('medications').innerHTML = patient.medications.map(m => `<div class="list-item">${m}</div>`).join('');
                    document.getElementById('allergies').innerHTML = patient.allergies.map(a => `<div class="list-item">${a}</div>`).join('');
                    document.getElementById('surgeries').innerHTML = patient.surgeries.map(s => `<div class="list-item">${s}</div>`).join('');
                    document.getElementById('previousIssues').innerHTML = patient.previousIssues.map(i => `<div class="list-item">${i}</div>`).join('');

                    modal.classList.add('active');
                }
            });
        });

        // Re-attach reject buttons
        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const requestId = e.target.dataset.id;
                const patient = patientsData[requestId];
                if (confirm(`هل أنت متأكد من رفض حالة "${patient.name}"؟`)) {
                    const card = document.querySelector(`.case-request-card[data-request-id="${requestId}"]`);
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.remove();
                        updatePendingCount();
                    }, 300);
                }
            });
        });
    };

    attachEventListeners();

    // Fix: Ensure modal buttons are only attached once
    const newCloseBtn = closeModalBtn.cloneNode(true);
    closeModalBtn.parentNode.replaceChild(newCloseBtn, closeModalBtn);
    newCloseBtn.addEventListener('click', closeModal);

    const newConfirmBtn = confirmAcceptBtn.cloneNode(true);
    confirmAcceptBtn.parentNode.replaceChild(newConfirmBtn, confirmAcceptBtn);
    newConfirmBtn.addEventListener('click', () => {
        if (!currentRequestId) return;
        const patient = patientsData[currentRequestId];
        closeModal();
        const card = document.querySelector(`.case-request-card[data-request-id="${currentRequestId}"]`);
        if (card) {
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                updatePendingCount();
                alert(`✅ تم قبول الحالة بنجاح!\n\nسيتم إرسال رسالة للمريض "${patient.name}" لتأكيد الموعد.`);
            }, 300);
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
};
