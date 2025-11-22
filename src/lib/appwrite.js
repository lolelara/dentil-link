import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID'); // User needs to provide this

export const account = new Account(client);
export const databases = new Databases(client);

export const initAppwrite = () => {
    if (client.config.project === 'YOUR_PROJECT_ID') {
        console.warn('Appwrite Project ID is not set. Please update src/lib/appwrite.js');
        alert('تنبيه: لم يتم إعداد Appwrite Project ID. يرجى تحديث src/lib/appwrite.js');
    }
    console.log('Appwrite initialized');
};
