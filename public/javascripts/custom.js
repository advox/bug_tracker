(function($) {
    'use strict';

    $(document).on('click', '#taskDelete button', function(){

        if (confirm("Are you sure?") == false) {
            return false;
        }
    });

})(jQuery);
