import { Component, Input, OnInit } from '@angular/core';
import { Comment } from './../../../models';
import { Restangular } from 'ngx-restangular';

@Component({
    selector: 'comment-view',
    templateUrl: './view.component.html'
})
export class CommentViewComponent implements OnInit {
    @Input() public commentId: string;

    private comment: Comment = new Comment();
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
        this.commentRest.customPOST(this.reply).subscribe((data) => {

        });
    }

    public ngOnInit() {
        this.commentRest.customGET(this.commentId).subscribe((data) => {
            this.comment = data;
        });
    }
}
