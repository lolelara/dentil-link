import { account, client } from './appwrite.js';
import { ID } from 'appwrite';

export class AuthService {
    async login(email, password) {
        console.log('Mock Login:', email);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            $id: 'mock-user-id',
            name: 'Demo User',
            email: email,
            status: true
        };
    }

    async register(email, password, name) {
        console.log('Mock Register:', { email, name });
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            $id: 'mock-user-id',
            name: name,
            email: email,
            status: true,
            emailVerification: true
        };
    }

    async logout() {
        console.log('Mock Logout');
        return true;
    }

    async getCurrentUser() {
        // Return a mock user to keep the session active for the demo
        return {
            $id: 'mock-user-id',
            name: 'Demo User',
            email: 'demo@example.com'
        };
    }
}

export const authService = new AuthService();
