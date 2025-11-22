import Navigo from 'navigo';

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
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('.btn-primary');
            const originalText = btn.innerText;
            btn.innerText = 'جاري الدخول...';

            // Simulate login for now
            setTimeout(() => {
                btn.innerText = originalText;
                console.log(`Logging in as ${currentRole}`);
                // Navigate based on role (mock)
                if (currentRole === 'patient') {
                    router.navigate('/patient/diagnosis'); // Changed to diagnosis for flow
                } else {
                    alert(`Login for ${currentRole} not implemented yet`);
                }
            }, 1000);
        });
    }
};

const setupPatientRegisterEvents = () => {
    const form = document.getElementById('patientRegisterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate password match
            const passwords = document.querySelectorAll('input[type="password"]');
            if (passwords.length >= 2 && passwords[0].value !== passwords[1].value) {
                alert('كلمات المرور غير متطابقة');
                return;
            }

            // Mock save
            const nameInput = form.querySelector('input[type="text"]');
            if (nameInput) {
                localStorage.setItem('userName', nameInput.value);
            }
            localStorage.setItem('userType', 'patient');

            router.navigate('/patient/diagnosis');
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
    // Expose router to window for onclick handlers in HTML
    window.router = router;

    router
        .on({
            '/': () => render('/views/home.html', () => {
                // Initialize home page scripts if any
            }),
            '/login': () => render('/views/login.html', setupLoginEvents),
            '/register': () => render('/views/register-select.html'),
            '/patient/register': () => render('/views/patient/register.html', setupPatientRegisterEvents),
            '/patient/diagnosis': () => render('/views/patient/diagnosis.html', setupDiagnosisEvents),
        })
        .resolve();
};
