import { account } from './appwrite.js';
import { ID } from 'appwrite';

export class AuthService {
    async login(email, password) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async register(email, password, name) {
        try {
            await account.create(ID.unique(), email, password, name);
            return await this.login(email, password);
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();
