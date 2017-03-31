(function () {
        let rows = document.getElementsByClassName('todo-clickable');
        for (let i = 0; i < rows.length; i++) {
            rows[i].addEventListener('click', function (event) {
                if ('SELECT' === event.target.tagName) {
                    return;
                }
                window.location = '/task/edit/' + this.dataset.target_id;
            })
        }
    })();

(function () {

})();