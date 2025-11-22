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
            '/student/learning': () => render('/views/student/learning-hub.html', setupLearningHubEvents),
            '/student/case-manager': () => render('/views/student/case-manager.html', setupCaseManagerEvents),
            '/student/portfolio': () => render('/views/student/portfolio.html'),
        })
        .resolve();
};

const setupCaseManagerEvents = () => {
    const mockCases = [
        {
            id: 1,
            title: 'CS-2024-127 • RCT Tooth #36',
            status: 'approved',
            statusText: '✅ Approved',
            date: '15 يناير 2024',
            doctor: 'د. محمد علي',
            rating: '⭐ 4.8',
            patient: 'Sarah Ahmed',
            age: 28,
            gender: 'Female',
            complaint: 'Severe pain in lower left tooth with cold.',
            diagnosis: 'Symptomatic Irreversible Pulpitis',
            treatment: '1. Anesthesia\n2. Access & Cleaning\n3. Obturation',
            feedback: 'Excellent work on the obturation.'
        },
        {
            id: 2,
            title: 'CS-2024-128 • Composite Filling #14',
            status: 'pending',
            statusText: '⏳ Pending Review',
            date: '18 يناير 2024',
            doctor: 'د. سارة حسن',
            patient: 'Omar Khaled',
            age: 35,
            gender: 'Male',
            complaint: 'Broken filling.',
            diagnosis: 'Secondary Caries',
            treatment: '1. Removal of old filling\n2. Caries removal\n3. Bonding & Composite',
            feedback: 'Waiting for review...'
        },
        {
            id: 3,
            title: 'CS-2024-129 • Crown Preparation #26',
            status: 'draft',
            statusText: '📝 Draft',
            date: '20 يناير 2024',
            doctor: 'غير محدد',
            patient: 'Laila Mahmoud',
            age: 42,
            gender: 'Female',
            complaint: 'Need a crown after RCT.',
            diagnosis: 'Post-RCT Restoration',
            treatment: '1. Reduction\n2. Impression',
            feedback: 'Not submitted yet.'
        },
        {
            id: 4,
            title: 'CS-2024-130 • Scaling & Polishing',
            status: 'approved',
            statusText: '✅ Approved',
            date: '22 يناير 2024',
            doctor: 'د. أحمد يوسف',
            rating: '⭐ 5.0',
            patient: 'Karim Ezzat',
            age: 22,
            gender: 'Male',
            complaint: 'Bleeding gums.',
            diagnosis: 'Gingivitis',
            treatment: '1. Ultrasonic scaling\n2. Polishing',
            feedback: 'Great patient management.'
        }
    ];

    const casesList = document.getElementById('casesList');
    if (casesList) {
        casesList.innerHTML = mockCases.map(c => `
            <div class="case-item" onclick="window.viewCase(${c.id})">
                <div class="case-header">
                    <div class="case-title">${c.title}</div>
                    <span class="case-status status-${c.status}">${c.statusText}</span>
                </div>
                <div class="case-meta">
                    <span>📅 ${c.date}</span>
                    <span>👨‍⚕️ ${c.doctor}</span>
                    ${c.rating ? `<span>${c.rating}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Modal Logic
    const createModal = document.getElementById('createCaseModal');
    const viewModal = document.getElementById('viewCaseModal');

    window.openCreateCaseModal = () => createModal.classList.add('active');
    window.closeCreateCaseModal = () => createModal.classList.remove('active');

    window.viewCase = (id) => {
        const c = mockCases.find(caseItem => caseItem.id === id);
        if (!c) return;

        const content = document.getElementById('viewCaseContent');
        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0;">Case #${c.title.split('•')[0].trim()}</h2>
                <button class="btn btn-secondary" onclick="closeViewCaseModal()">✕</button>
            </div>

            <div class="form-section">
                <div class="section-title">👤 Patient Info</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <label style="font-size: 12px; color: var(--gray-500);">Patient Name</label>
                        <div style="font-weight: 600;">${c.patient}</div>
                    </div>
                    <div>
                        <label style="font-size: 12px; color: var(--gray-500);">Age / Gender</label>
                        <div style="font-weight: 600;">${c.age} / ${c.gender}</div>
                    </div>
                </div>
                <div style="margin-top: 12px;">
                    <label style="font-size: 12px; color: var(--gray-500);">Chief Complaint</label>
                    <div style="font-weight: 600;">"${c.complaint}"</div>
                </div>
            </div>

            <div class="form-section">
                <div class="section-title">🔍 Diagnosis</div>
                <div style="background: #f0f9ff; padding: 16px; border-radius: 12px; border-right: 4px solid var(--primary);">
                    <strong>${c.diagnosis}</strong>
                </div>
            </div>

            <div class="form-section">
                <div class="section-title">🛠️ Treatment</div>
                <pre style="font-family: inherit; white-space: pre-wrap; color: var(--gray-700);">${c.treatment}</pre>
            </div>

            <div class="form-section">
                <div class="section-title">👨‍⚕️ Supervisor Feedback</div>
                <div style="background: ${c.status === 'approved' ? '#d1fae5' : '#f3f4f6'}; padding: 16px; border-radius: 12px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">${c.doctor}</div>
                    <div style="font-size: 14px;">"${c.feedback}"</div>
                    ${c.rating ? `<div style="margin-top: 12px; font-size: 14px;"><strong>التقييم:</strong> ${c.rating}</div>` : ''}
                </div>
            </div>
        `;
        viewModal.classList.add('active');
    };

    window.closeViewCaseModal = () => viewModal.classList.remove('active');

    // Form Buttons
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            alert('✅ تم حفظ الحالة كمسودة!');
            window.closeCreateCaseModal();
        });
    }

    const submitSupervisorBtn = document.getElementById('submitSupervisorBtn');
    if (submitSupervisorBtn) {
        submitSupervisorBtn.addEventListener('click', () => {
            alert('📤 تم إرسال الحالة للمشرف! ستتلقى إشعاراً عند المراجعة.');
            window.closeCreateCaseModal();
        });
    }

    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    if (cancelCreateBtn) {
        cancelCreateBtn.addEventListener('click', window.closeCreateCaseModal);
    }

    const createCaseBtn = document.getElementById('createCaseBtn');
    if (createCaseBtn) {
        createCaseBtn.addEventListener('click', window.openCreateCaseModal);
    }
};

const setupLearningHubEvents = () => {
    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Lecture Toggles
    document.querySelectorAll('.lecture-header').forEach(header => {
        header.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-note')) return; // Ignore click if on add note button
            const body = header.nextElementSibling;
            body.classList.toggle('open');
        });
    });

    // Note Toggles
    document.querySelectorAll('.btn-add-note').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lectureItem = e.target.closest('.lecture-item');
            const noteSection = lectureItem.querySelector('.note-section');
            noteSection.classList.toggle('visible');
        });
    });

    document.querySelectorAll('.btn-save-note').forEach(btn => {
        btn.addEventListener('click', () => alert('تم الحفظ!'));
    });

    // Image & Video Clicks
    document.querySelectorAll('.image-card, .video-card').forEach(card => {
        card.addEventListener('click', () => {
            alert(card.dataset.info);
        });
    });

    // Quiz Logic
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const question = option.closest('.question');
            question.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });

            option.classList.add('selected');
            if (option.dataset.correct === 'true') {
                option.classList.add('correct');
            } else {
                option.classList.add('incorrect');
            }
        });
    });

    const submitQuizBtn = document.getElementById('submitQuizBtn');
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', () => {
            const correctCount = document.querySelectorAll('.option.correct.selected').length;
            const totalQuestions = document.querySelectorAll('.question').length;
            alert(`النتيجة: ${correctCount} / ${totalQuestions} ✅`);
        });
    }

    // Chat Logic
    const chatInput = document.getElementById('userMessage');
    const sendBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');

    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (!message) return;

        chatMessages.innerHTML += `
            <div class="message user">
                <div class="message-bubble">${message}</div>
            </div>
        `;

        setTimeout(() => {
            chatMessages.innerHTML += `
                <div class="message ai">
                    <div class="message-bubble">شكراً على سؤالك! بناءً على المعلومات المتاحة، أنصحك بمراجعة محاضرة Endodontics والتركيز على بروتوكولات التعقيم.</div>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    const sendToFacultyBtn = document.getElementById('sendToFacultyBtn');
    if (sendToFacultyBtn) {
        sendToFacultyBtn.addEventListener('click', () => {
            alert('تم إرسال السؤال لأقرب دكتور أونلاين! ستحصل على رد خلال 5-10 دقائق.');
        });
    }
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
