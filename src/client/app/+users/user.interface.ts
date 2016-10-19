/**
 *  User interface
 */
export interface UserModel {
    
    id: any;
    comp_id?: number;
    comp_name?: string;
    name: string;
    email: string;
    chpassword?: boolean;
    password?: string;
    newpassword?: string;
    newrepassword?: string;
    role: string;
    modules?: any;
    active?: boolean;
    ts_created?: number;
}
