/**
 *  Company interface
 */
export interface CompanyModel {
    
    id: any;
    name?: string;
    ico: string;
    email: string;
    active?: boolean;
    street?: string;
    street_nr?: string;
    state?: string;
    city?: string;
    zip?: string;
    phone?: Array<any>;
    ts_created: number;
}
