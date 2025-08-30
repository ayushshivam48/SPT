export type UserRole = 'admin' | 'teacher' | 'student';

export interface JWTPayload {
	userId: string;
	role: UserRole;
}

export const ROLES: Record<UserRole, number> = {
	admin: 3,
	teacher: 2,
	student: 1,
};

export function roleAtLeast(role: UserRole, minimum: UserRole) {
	return ROLES[role] >= ROLES[minimum];
}