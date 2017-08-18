import {Component, OnInit} from '@angular/core';
import {Task} from './../../models';
import {Restangular} from 'ngx-restangular';

@Component({
    selector: 'task',
    templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
    public tasks: Task[] = [];
    public filters: any = {};
    private taskRest: Restangular;

    public constructor(
        private restangular: Restangular,
    ) {
        this.taskRest = this.restangular.all('task');
    }

    public ngOnInit() {
        this.clearFilters();

        this.taskRest.doGET(null, this.filters).subscribe((data) => {
            this.tasks = data.tasks;
            console.log(data);
        });
    }

    public clearFilters() {
        this.filters = {
            search: '',
            status: 1,
            orderBy: 'created_at',
            orderDir: 'desc'
        };
    }
}
