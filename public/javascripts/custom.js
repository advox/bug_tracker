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

    $(document).on('keyup', '#todoTasks_wrapper input[type="search"]', function (){
        let searchValue = $(this).val();
        hideTableDetails(searchValue, '#todoTasks_wrapper');
    });

    $(document).on('keyup', '#doneTasks_wrapper input[type="search"]', function (){
        let searchValue = $(this).val();
        hideTableDetails(searchValue, '#doneTasks_wrapper');
    });

    function hideTableDetails(searchValue, element) {
        if (searchValue == '') {
            $(element + ' .dataTables_paginate').css('display', 'block');
            $(element + ' .dataTables_info').css('display', 'block');
        } else {
            $(element + ' .dataTables_paginate').css('display', 'none');
            $(element + ' .dataTables_info').css('display', 'none');
        }
    }

})(jQuery);
