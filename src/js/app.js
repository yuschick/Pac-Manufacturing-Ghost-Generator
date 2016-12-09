(function($) {
    let allGhosts = [];
    const storage = {
        set() {
            localStorage.setItem("ghosts", JSON.stringify(allGhosts));
        },
        get() {
            let ghosts = localStorage.ghosts === undefined
                ? false
                : JSON.parse(localStorage.ghosts);
            return ghosts;
        },
        clear() {
            localStorage.removeItem('ghosts');
            console.log('localStorage cleared!');
        }
    }

    Ghost.prototype.buildGhost = function() {
        let source = $('#ghost').html(),
            template = Handlebars.compile(source),
            context = this.info,
            html = template(context);

        $(html).prependTo('.main-content').fadeIn();

        return $('.ghost').first();
    }

    Ghost.prototype.animate = function(type) {
        const thisGhost = this.info;
        $(thisGhost.self).addClass(thisGhost[type]);
        $(thisGhost.self).on('animationend', () => {
            $(thisGhost.self).removeClass(thisGhost[type]);
        });
    }

    function Ghost(context) {
        this.info = context;
        this.info.self = this.buildGhost();
        allGhosts.push(this);
        this.animate('primary');

        $(this.info.self).on('click', () => {
            this.animate('secondary');
        });

        storage.set();
    }

    function formValues() {
        const context = {
            name: $('#ghost-name').val(),
            color: $('#ghost-color').val(),
            primary: $('#ghost-primary').val(),
            secondary: $('#ghost-secondary').val()
        };
        return context;
    }

    if (storage.get()) {
        const ghosts = storage.get();
        $('.empty-container').remove();

        for (let index = 0; index < ghosts.length; index++) {
            new Ghost(ghosts[index].info);
        }
    }

    $('form').on('submit', function(event) {
        event.preventDefault();
        new Ghost(formValues());
        $(this).trigger('reset');

        if ($('.empty-container').length) {
            $('.empty-container').remove();
        }
    });

    $('body').on('keypress', (event) => {
        if (event.keyCode === 99) {
            storage.clear();
        }
    });
})(jQuery);
