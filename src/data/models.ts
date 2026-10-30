export interface RecordBase { id: string; createdAt: string; updatedAt: string; demo?: boolean }
export interface Client extends RecordBase { name:string; company:string; email:string; phone:string; website:string; industry:string; status:'Active'|'At risk'|'Archived'; notes:string; }
export interface Project extends RecordBase { name:string; clientId:string; description:string; status:'In progress'|'In review'|'Completed'|'On hold'; startDate:string; deadline:string; budget:number; priority:'Low'|'Medium'|'High'; }
export interface Task extends RecordBase { title:string; projectId:string; description:string; status:'To Do'|'In Progress'|'Completed'; dueDate:string; priority:'Low'|'Medium'|'High'; }
export interface Proposal extends RecordBase { title:string; clientId:string; projectId:string; value:number; sentDate:string; expiresAt:string; status:'Draft'|'Sent'|'Accepted'|'Rejected'; description:string; }
export interface InvoiceItem { description:string; quantity:number; rate:number }
export interface Invoice extends RecordBase { number:string; clientId:string; projectId:string; issuedAt:string; dueDate:string; status:'Draft'|'Pending'|'Paid'|'Overdue'; items:InvoiceItem[]; taxRate:number; }
export interface Payment extends RecordBase { invoiceId:string; clientId:string; amount:number; date:string; method:string; note:string }
export interface Expense extends RecordBase { name:string; category:string; amount:number; date:string; projectId:string; notes:string }
export interface TimeEntry extends RecordBase { projectId:string; description:string; startedAt:string; durationSeconds:number; running:boolean; paused:boolean }
export interface CalendarEvent extends RecordBase { title:string; type:'Project'|'Meeting'|'Invoice'|'Deadline'; date:string; startTime:string; endTime:string; projectId:string; clientId:string; description:string }
export interface User extends RecordBase { name:string; email:string; password:string; role:string; businessName?:string; goals?:string[]; currency?:string; appearance?:'light'|'dark'; }
export interface AppData { clients:Client[]; projects:Project[]; tasks:Task[]; proposals:Proposal[]; invoices:Invoice[]; payments:Payment[]; expenses:Expense[]; timeEntries:TimeEntry[]; calendarEvents:CalendarEvent[]; }
