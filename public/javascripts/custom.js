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

})(jQuery);
