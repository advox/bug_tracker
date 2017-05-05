(function($) {
    'use strict';

    $(document).on('click', '#task-delete button', function(){

        if (confirm("Are you sure?") == false) {
            return false;
        }
    });

    $('.wysiwyg').summernote({
        minHeight: 300,
    });

    $(document).ready(function() {
        $('#todoTasks').DataTable({
            "processing": true,
            "serverSide": true,
            "order": [[10, "desc"]],
            "ajax": {
                "url": "/task/grid",
                "type": "POST",
                "data": function (d) {
                    d.status = "1,3";
                }
            },
            "columns" : [
                {
                    "data": "title",
                    "render": function ( data, type, full, meta ) {
                        return '<a href="/task/edit/' + full._id + '">' + data + '</a>';
                    }
                },
                { "data": "status"},
                { "data": "rank"},
                { "data": "important"},
                {
                    "data": "important",
                    "render": function ( data, type, full, meta ) {
                        if (data.indexOf('3') > 0) {
                            return '<img src="images/superman.color.webp">'
                        }
                        return '<img src="images/superman.mono.webp">';
                    }
                },
                {
                    "data": "content",
                    "render": function ( data, type, full, meta ) {
                        return data.substring(0,40) + "...";
                    }
                },
                { "data": "author.login"},
                { "data": "assignee.login"},
                { "data": "comments"},
                {
                    "data": "createdAt",
                    "render": function ( data, type, full, meta ) {
                        var date = new Date(data);
                        return date;
                    }
                },
                { "data": "updatedAt"},
            ]
        });

        $('#doneTasks').DataTable({
            "processing": true,
            "serverSide": true,
            "order": [[10, "desc"]],
            "ajax": {
                "url": "/task/grid",
                "type": "POST",
                "data": function (d) {
                    d.status = "2";
                }
            },
            "columns" : [
                {
                    "data": "title",
                    "render": function ( data, type, full, meta ) {
                        return '<a href="/task/edit/' + full._id + '">' + data + '</a>';
                    }
                },
                { "data": "status"},
                { "data": "rank"},
                { "data": "important"},
                {
                    "data": "important",
                    "render": function ( data, type, full, meta ) {
                        if (data.indexOf('3') > 0) {
                            return '<img src="images/superman.color.webp">'
                        }
                        return '<img src="images/superman.mono.webp">';
                    }
                },
                {
                    "data": "content",
                    "render": function ( data, type, full, meta ) {
                        return data.substring(0,40) + "...";
                    }
                },
                { "data": "author.login"},
                { "data": "assignee.login"},
                { "data": "comments"},
                {
                    "data": "createdAt",
                    "render": function ( data, type, full, meta ) {
                        return new Date(data);
                    }
                },
                { "data": "updatedAt"},
            ]
        });

    } );

})(jQuery);
