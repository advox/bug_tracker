import { Component, OnInit } from '@angular/core';
import { Task } from './../../models';
import { Status } from './../../models';
import { Restangular } from 'ngx-restangular';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'task',
    templateUrl: './list.component.html'
})
export class TaskListComponent implements OnInit {
    public tasks: Task[] = [];
    public totalItems = 0;
    public filters: any = {};
    public taskStatuses: Status[] = [];
    private taskRest: Restangular;

    public constructor(
        private restangular: Restangular,
        private toastr: ToastsManager,
        private router: Router
    ) {
        this.taskRest = this.restangular.all('task');
    }

    public ngOnInit() {
        this.clearFilters();
        this.getTasks();
        this.getTaskStatuses();
    }

    public getTaskStatuses() {
        this.taskRest.customGET('statuses').subscribe((data) => {
            this.taskStatuses = data.statuses;
        });
    }

    public getTasks(event?) {
        if (typeof event !== 'undefined') {
            this.setFilter('page', event.page + 1);
            this.setFilter('perPage', event.rows);
        }

        this.taskRest.doGET(null, this.filters).subscribe((data) => {
            this.tasks = data.tasks;
            this.totalItems = data.totalItems;
        });
    }

    public clearFilters() {
        this.filters = {
            search: '',
            status: null,
            orderBy: 'createdAt',
            orderDir: 'desc',
            page: 1,
            perPage: 25
        };
    }

    public setFilter(key, value) {
        this.filters[key] = value;
    }

    public updateTask(data, taskId) {
        this.taskRest.customPUT(data, taskId).subscribe((data) => {
            this.toastr.success('Updated!');
            this.getTasks();
        });
    }

    public showTask(taskId) {
        this.router.navigateByUrl('task/' + taskId);
    }
}