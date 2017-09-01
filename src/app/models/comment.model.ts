import { User, Task } from '.';

export class Comment {
    public _id: string;
    public externalId: number;
    public task: Task;
    public author: User;
    public parent: Comment;
    public content: string;
    public status: string;
    public children: Comment[] = [];
    public files: any[] = [];
    public notifications: any[] = [];
    public updatedAt: string;
    public createdAt: string;
}