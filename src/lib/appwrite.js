import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID'); // User needs to provide this

export const account = new Account(client);
export const databases = new Databases(client);

export const initAppwrite = () => {
    console.log('Appwrite initialized');
};
