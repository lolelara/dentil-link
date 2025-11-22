import './css/design-system.css';
import './css/components.css';
import './css/home.css';
import './css/login.css';
import './css/register-select.css';
import './css/patient-register.css';
import './css/patient-diagnosis.css';

import { initRouter } from './router.js';
import { initAppwrite } from './lib/appwrite.js';

document.querySelector('#app').innerHTML = `
  <div id="content"></div>
`;

initAppwrite();
initRouter();
