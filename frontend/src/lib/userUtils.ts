import type { UserProfile } from '@ai-assistant/shared';

export interface DestructuredUserProfile {
    firstName: string;
    lastName: string;
    fullName: string;
    department: string;
}

/**
 * Retrieves the UserProfile from localStorage and destructures the fullName
 * into firstName and lastName.
 */
export function getLocalUserProfile(): DestructuredUserProfile | null {
    try {
        const userProfileStr = localStorage.getItem('userProfile');
        if (!userProfileStr) return null;

        const userProfile: UserProfile = JSON.parse(userProfileStr);
        if (!userProfile || !userProfile.fullName) return null;

        // Split the full name by space
        const [firstName, ...lastNameParts] = userProfile.fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        return {
            firstName: firstName || '',
            lastName: lastName || '',
            fullName: userProfile.fullName,
            department: userProfile.department
        };
    } catch (error) {
        console.error('Failed to parse user profile from localStorage', error);
        return null;
    }
}
