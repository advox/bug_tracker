import { Component, OnInit } from '@angular/core';
import { Task, User } from './../../models';
import { Restangular } from 'ngx-restangular';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'task-edit',
    templateUrl: './edit.component.html'
})
export class TaskEditComponent implements OnInit {
    private task: Task = new Task();
    private users: User[] = [];
    private taskRest: Restangular = null;

    constructor(
        public restangular: Restangular,
        private activatedRoute: ActivatedRoute
    ) {
        this.taskRest = this.restangular.all('task');
    }

    public getTask(taskId) {
        this.taskRest.customGET(taskId).subscribe((data) => {
            this.task = data.task;
            this.users = data.users;
        });
    }

    public ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.getTask(params['id']);
        });
    }
}
