import { useSyncExternalStore } from 'react';
import type { AppData, Client, Invoice, Payment, Project, Task, User } from './models';

const PREFIX='freelanceos:v1:';
const changeEvent='freelanceos:data-change';
const cache=new Map<string,unknown>();
// One immutable, account-scoped snapshot is shared by every workspace page. CRUD
// writes replace the affected collection and publish once, so same-tab routes
// observe the exact same data without waiting for the browser storage event.
type WorkspaceSnapshot={ownerId:string;data:AppData};
const workspaceListeners=new Set<()=>void>();
let workspaceSnapshot:WorkspaceSnapshot|undefined;
function ownerId(){return getSession()?.id??'demo-user';}
const emptyData:AppData={clients:[],projects:[],tasks:[],proposals:[],invoices:[],payments:[],expenses:[],timeEntries:[],calendarEvents:[]};
const now=()=>new Date().toISOString();
export const createId=()=>globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
function read<T>(key:string,fallback:T):T { const storageKey=PREFIX+key;if(cache.has(storageKey))return cache.get(storageKey) as T;try{const raw=localStorage.getItem(storageKey);const value=raw?JSON.parse(raw) as T:fallback;cache.set(storageKey,value);return value}catch{cache.set(storageKey,fallback);return fallback} }
function write<T>(key:string,value:T){cache.set(PREFIX+key,value);localStorage.setItem(PREFIX+key,JSON.stringify(value));window.dispatchEvent(new CustomEvent(changeEvent,{detail:key}));}
function snapshotFor(owner:string):WorkspaceSnapshot {
  if(workspaceSnapshot?.ownerId===owner)return workspaceSnapshot;
  const seed=owner==='demo-user'?initial:emptyData;
  const data=Object.fromEntries((Object.keys(seed) as (keyof AppData)[]).map(key=>[key,read<AppData[typeof key]>(`workspace:${owner}:${key}`,seed[key])])) as unknown as AppData;
  workspaceSnapshot={ownerId:owner,data};return workspaceSnapshot;
}
function getWorkspaceSnapshot(){return snapshotFor(ownerId());}
function publishWorkspace(){workspaceListeners.forEach(listener=>listener());}
function subscribeWorkspace(listener:()=>void){workspaceListeners.add(listener);return()=>workspaceListeners.delete(listener);}
function commitCollection<K extends keyof AppData>(key:K,rows:AppData[K]) {
  const current=getWorkspaceSnapshot(),storageKey=`workspace:${current.ownerId}:${key}`;
  cache.set(PREFIX+storageKey,rows);
  try{localStorage.setItem(PREFIX+storageKey,JSON.stringify(rows));}catch(error){console.error('Could not persist workspace data',error);throw error;}
  workspaceSnapshot={ownerId:current.ownerId,data:{...current.data,[key]:rows}};
  window.dispatchEvent(new CustomEvent(changeEvent,{detail:storageKey}));publishWorkspace();
}
if(typeof window!=='undefined')window.addEventListener('storage',(event:StorageEvent)=>{
  if(event.key===PREFIX+'session'){cache.delete(PREFIX+'session');workspaceSnapshot=undefined;publishWorkspace();return;}
  if(!event.key?.startsWith(PREFIX+'workspace:'))return;
  const owner=ownerId();if(!event.key.startsWith(`${PREFIX}workspace:${owner}:`))return;
  workspaceSnapshot=undefined;
  const next=getWorkspaceSnapshot();workspaceSnapshot=next;publishWorkspace();
});
function stamp<T extends object>(value:T,existing?:{id:string;createdAt:string}):T&{id:string;createdAt:string;updatedAt:string}{const time=now();return {...value,id:existing?.id??createId(),createdAt:existing?.createdAt??time,updatedAt:time};}
const demoClients:Client[]=( [['Northstar Studio','Technology','northstar@example.com','+91 98765 01010','northstar.studio','Technology','Active','Enterprise website and product design partner.'],['Atelier June','Design','hello@atelierjune.example','+91 98765 01011','atelierjune.example','Design','Active','Brand identity and art direction.'],['Morrow & Co.','Consulting','team@morrow.example','+91 98765 01012','morrow.example','Consulting','Active','Product strategy consulting.'],['Fieldwork Labs','Technology','finance@fieldwork.example','+91 98765 01013','fieldwork.example','Technology','At risk','Mobile app build. Follow up on payment.'],['Sunday Supply','Retail','hello@sundaysupply.example','+91 98765 01014','sunday.example','Retail','Active','E-commerce platform.']] as [string,string,string,string,string,string,string,string][]).map(([name,company,email,phone,website,industry,status,notes],i)=>({...stamp({name,company,email,phone,website,industry,status:status as Client['status'],notes}),id:`demo-client-${i+1}`,createdAt:'2026-01-05T09:00:00.000Z',updatedAt:'2026-09-26T09:00:00.000Z',demo:true}));
const demoProjects:Project[]=([['Website Redesign','Northstar Studio','Refresh the Northstar digital experience.','In progress','2026-09-01','2026-10-14',120000,'High'],['Brand identity system','Atelier June','Create an expressive identity system.','In progress','2026-09-05','2026-10-21',86000,'Medium'],['Mobile app prototype','Morrow & Co.','Product strategy and prototype.','In review','2026-08-12','2026-10-08',240000,'High'],['E-commerce build','Sunday Supply','A considered online storefront.','In progress','2026-09-11','2026-11-02',168000,'Medium']] as [string,string,string,string,string,string,number,string][]).map(([name,clientName,description,status,startDate,deadline,budget,priority])=>({...stamp({name,clientId:demoClients.find(c=>c.name===clientName)?.id??'',description,status:status as Project['status'],startDate,deadline,budget:Number(budget),priority:priority as Project['priority']}),id:`demo-project-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,createdAt:'2026-02-01T09:00:00.000Z',updatedAt:'2026-09-26T09:00:00.000Z',demo:true}));
const demoTasks:Task[]=[['Review homepage copy','Website Redesign','To Do','2026-09-29','High'],['Send proposal to Morrow','Mobile app prototype','To Do','2026-09-29','Medium'],['Build shared components','Website Redesign','In Progress','2026-10-04','High'],['Homepage responsive layouts','Website Redesign','Completed','2026-09-27','Medium']].map(([title,projectName,status,dueDate,priority])=>({...stamp({title,projectId:demoProjects.find(p=>p.name===projectName)?.id??'',description:'',status:status as Task['status'],dueDate,priority:priority as Task['priority']}),id:`demo-task-${title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,createdAt:'2026-09-20T09:00:00.000Z',updatedAt:'2026-09-26T09:00:00.000Z',demo:true}));
const demoInvoices:Invoice[]=([['INV-2026-004','Northstar Studio',42000,'2026-09-24','2026-10-08','Pending'],['INV-2026-003','Atelier June',86000,'2026-09-18','2026-10-02','Paid'],['INV-2026-002','Fieldwork Labs',64000,'2026-09-10','2026-09-24','Overdue'],['INV-2026-001','Morrow & Co.',118000,'2026-09-02','2026-09-16','Paid']] as [string,string,number,string,string,string][]).map(([number,clientName,amount,issuedAt,dueDate,status])=>({...stamp({number,clientId:demoClients.find(c=>c.name===clientName)?.id??'',projectId:demoProjects.find(p=>p.clientId===demoClients.find(c=>c.name===clientName)?.id)?.id??'',issuedAt,dueDate,status:status as Invoice['status'],items:[{description:'Project services',quantity:1,rate:Number(amount)/1.18}],taxRate:18}),id:`demo-invoice-${number}`,createdAt:issuedAt+'T09:00:00.000Z',updatedAt:issuedAt+'T09:00:00.000Z',demo:true}));
const paidA=demoInvoices.find(x=>x.number==='INV-2026-003')!;const paidB=demoInvoices.find(x=>x.number==='INV-2026-001')!;const demoPayments:Payment[]=[paidA,paidB].map(inv=>({...stamp({invoiceId:inv.id,clientId:inv.clientId,amount:invoiceTotal(inv),date:inv.issuedAt,method:'Bank transfer',note:'Demo payment'}),id:`demo-payment-${inv.number}`,createdAt:inv.issuedAt+'T09:00:00.000Z',updatedAt:inv.issuedAt+'T09:00:00.000Z',demo:true}));
const initial={clients:demoClients,projects:demoProjects,tasks:demoTasks,proposals:[],invoices:demoInvoices,payments:demoPayments,expenses:[],timeEntries:[],calendarEvents:[]} satisfies AppData;
export function getCollection<K extends keyof AppData>(key:K):AppData[K]{return getWorkspaceSnapshot().data[key];}
export function useWorkspace(){return useSyncExternalStore(subscribeWorkspace,getWorkspaceSnapshot,()=>({ownerId:'demo-user',data:initial}));}
export function useCollection<K extends keyof AppData>(key:K):AppData[K]{return useWorkspace().data[key];}
export function createRecord<K extends keyof AppData>(key:K,value:Omit<AppData[K][number],'id'|'createdAt'|'updatedAt'|'demo'>):AppData[K][number]{const list=getCollection(key) as Array<AppData[K][number]&{id:string;createdAt:string;updatedAt:string}>;const record=stamp(value) as AppData[K][number];commitCollection(key,[record,...list] as AppData[K]);return record;}
export function updateRecord<K extends keyof AppData>(key:K,id:string,patch:Partial<AppData[K][number]>):void{const list=getCollection(key) as Array<AppData[K][number]&{id:string;createdAt:string}>;commitCollection(key,list.map(x=>x.id===id?stamp({...x,...patch},x):x) as AppData[K]);}
export function deleteRecord<K extends keyof AppData>(key:K,id:string):void{const list=getCollection(key) as Array<AppData[K][number]&{id:string}>;commitCollection(key,list.filter(x=>x.id!==id) as AppData[K]);}
export function getUsers():User[]{return read<User[]>('users',[]);}
export function registerUser(name:string,email:string,password:string):User{const users=getUsers();if(email.toLowerCase()==='demo@freelanceos.com')throw new Error('That email is reserved for the demo account.');if(users.some(u=>u.email.toLowerCase()===email.toLowerCase()))throw new Error('An account with this email already exists.');const user=stamp({name,email:email.toLowerCase(),password,role:'Freelancer'});write('users',[user,...users]);return user;}
export function authenticate(email:string,password:string):User{if(email.toLowerCase()==='demo@freelanceos.com'&&password==='demo123')return {...stamp({name:'Mohit Kumar Singh',email:'demo@freelanceos.com',password:'',role:'Freelancer'}),id:'demo-user',createdAt:'2026-01-01T00:00:00.000Z'};const user=getUsers().find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);if(!user)throw new Error('Email or password is incorrect.');return user;}
export function getSession():User|null{return read<User|null>('session',null);}
export function setSession(user:User|null){if(user)write('session',{...user,password:''});else{localStorage.removeItem(PREFIX+'session');cache.delete(PREFIX+'session');window.dispatchEvent(new CustomEvent(changeEvent,{detail:'session'}));}workspaceSnapshot=undefined;publishWorkspace();}
export function nextInvoiceNumber(){const nums=getCollection('invoices').map(x=>Number(x.number.match(/(\d+)$/)?.[1]??0));return `INV-${new Date().getFullYear()}-${String(Math.max(0,...nums)+1).padStart(3,'0')}`;}
export function invoiceTotal(invoice:Invoice){const sub=invoice.items.reduce((sum,item)=>sum+item.quantity*item.rate,0);return sub*(1+invoice.taxRate/100);}
export function sum<T>(rows:T[],value:(row:T)=>number){return rows.reduce((total,row)=>total+value(row),0);}

export function useSession(){return useSyncExternalStore((notify)=>{const handler=(e:Event)=>{if((e as CustomEvent).detail==='session')notify();};window.addEventListener(changeEvent,handler);const storageHandler=(e:StorageEvent)=>{if(e.key===PREFIX+'session'){cache.delete(PREFIX+'session');notify()}};window.addEventListener('storage',storageHandler);return()=>{window.removeEventListener(changeEvent,handler);window.removeEventListener('storage',storageHandler);};},()=>getSession(),()=>null);}

export function setUserPassword(userId:string,password:string){write('users',getUsers().map(u=>u.id===userId?stamp({...u,password},u):u));}
export function updateSession(patch:Partial<User>){const current=getSession();if(!current)return;const next={...current,...patch,updatedAt:now()};const users=getUsers();if(users.some(u=>u.id===current.id))write('users',users.map(u=>u.id===current.id?stamp({...u,...patch},u):u));setSession(next);}
