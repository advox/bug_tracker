import { Component, OnInit } from '@angular/core';
import { Task } from './../../models';
import { Status } from './../../models';
import { Restangular } from 'ngx-restangular';
import { ToastsManager } from "ng2-toastr"

@Component({
    selector: 'task',
    templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
    public tasks: Task[] = [];
    public totalItems = 100;
    public filters: any = {};
    public taskStatuses: Status[] = [];
    private taskRest: Restangular;

    public constructor(
        private restangular: Restangular,
        private toastr: ToastsManager
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
            status: 1,
            orderBy: 'created_at',
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
}
