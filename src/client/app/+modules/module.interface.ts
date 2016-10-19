/**
 *  Module interface
 */
export interface ModuleModel {
    
    id: any;
    name: string;
    description?: string;
    role: any;
    active: boolean;
    ts_created: number;
}
