/**
 *  News interface
 */
export interface NewModel {
    
    subject: string;
    appendix: string;
    content?: string;
    image?: Array<string>;
    gallery?: Array<string>;
    attachments?: Array<string>;
}
