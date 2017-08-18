import {User} from '.';

export class Task {
    public _id: string;
    public status: string;
    public title: string;
    public content: string;
    public rank: number;
    public importance: number;
    public author: User;
    public assignee: User;
    public externalId: number;
    public updatedAt: string;
    public createdAt: string;
}