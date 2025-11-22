import './css/design-system.css';
import './css/components.css';
import './css/home.css';
import './css/login.css';
import './css/register-select.css';
import './css/patient-register.css';
import './css/patient-diagnosis.css';
import './css/student-dashboard.css';
import './css/case-requests.css';
import './css/learning-hub.css';
import './css/case-manager.css';

import { initRouter } from './router.js';
import { initAppwrite } from './lib/appwrite.js';

document.querySelector('#app').innerHTML = `
  <div id="content"></div>
`;

import { authService } from './lib/auth.js';

initAppwrite();
initRouter();

// Check auth status
authService.getCurrentUser().then(user => {
  if (user) {
    console.log('User is logged in:', user);
  } else {
    console.log('User is not logged in');
  }
}).catch(console.error);
