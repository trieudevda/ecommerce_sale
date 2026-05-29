import {Permission} from "@/src/interface/permission.interface";

export interface Role {
    id: number;

    name: string;

    slug: string;

    permissions: Permission[];
}