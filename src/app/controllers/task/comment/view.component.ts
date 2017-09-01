import { Component, Input, OnInit } from '@angular/core';
import { Comment, User } from './../../../models';
import { Restangular } from 'ngx-restangular';

@Component({
    selector: 'comment-view',
    templateUrl: './view.component.html'
})
export class CommentViewComponent implements OnInit {
    @Input() public commentId: string;

    private comment: Comment = new Comment();
    private replies: Comment[] = [];
    private commentRest: Restangular = null;
    private showReplyForm = false;
    private showReplies = false;
    private reply: Comment = new Comment();

    constructor(
        public restangular: Restangular,
    ) {
        this.commentRest = this.restangular.all('comment');
    }

    public cancelReply() {
        this.showReplyForm = false;
        this.reply = new Comment();
    }

    public saveReply() {
        this.reply.task = this.comment.task;
        this.reply.parent = this.comment;

        this.commentRest.customPOST(this.reply).subscribe((data) => {
            this.getTask();
        });
    }

    public ngOnInit() {
        this.getTask();
    }

    public getAuthor() {
        if (typeof this.comment.author !== 'undefined') {
            return this.comment.author.name + ' ' + this.comment.author.surname;
        }

        return '';
    }

    private getTask() {
        this.commentRest.customGET(this.commentId).subscribe((data) => {
            this.comment = data.comment;

            if (this.comment.author === null) {
                this.comment.author = new User();
            }

            this.replies = data.replies;
        });
    }
}
