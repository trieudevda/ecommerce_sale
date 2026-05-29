import {Permission} from "./permission.interface";
import {Role} from "@/src/interface/role.interface";

export interface User {
    id: string;

    email: string;

    fullName: string;

    address?: string | null;

    phone?: string | null;

    permissions: Permission[];

    role: Role;

    dateOfBirth?: Date | null;

    isEmailVerified: boolean;

    lastLoginAt?: Date | null;

    status: UserStatusEnum;

    createdAt: Date;

    updatedAt: Date;
}