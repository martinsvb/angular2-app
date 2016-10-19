/**
 *  Role interface
 */
export interface RoleModel {
    
    id: any;
    name: string;
    description?: string;
    active: boolean;
    ts_created: number;
}
