(function($) {
    var allGhosts = [];
    var storage = {
        set: function() {
            localStorage.setItem("ghosts", JSON.stringify(allGhosts));
        },
        get: function() {
            var ghosts = localStorage.ghosts === undefined
                ? false
                : JSON.parse(localStorage.ghosts);
            return ghosts;
        },
        clear: function() {
            localStorage.removeItem('ghosts');
            console.log('localStorage cleared!');
        }
    }

    Ghost.prototype.buildGhost = function() {
        var source = $('#ghost').html(),
            template = Handlebars.compile(source),
            context = this.info,
            html = template(context);

        $(html).prependTo('.main-content').fadeIn();

        return $('.ghost').first();
    }

    Ghost.prototype.animate = function(type) {
        var thisGhost = this.info;
        $(thisGhost.self).addClass(thisGhost[type]);
        $(thisGhost.self).on('animationend', function() {
            $(this).removeClass(thisGhost[type]);
        });
    }

    function Ghost(context) {
        this.info = context;
        this.info.self = this.buildGhost();
        allGhosts.push(this);
        this.animate('primary');

        $(this.info.self).on('click', (function() {
            this.animate('secondary');
        }).bind(this));

        storage.set();
    }

    function formValues() {
        var context = {
            name: $('#ghost-name').val(),
            color: $('#ghost-color').val(),
            primary: $('#ghost-primary').val(),
            secondary: $('#ghost-secondary').val()
        };
        return context;
    }

    if (storage.get()) {
        var ghosts = storage.get();
        $('.empty-container').remove();

        for (var index = 0; index < ghosts.length; index++) {
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

    $('body').on('keypress', function(event) {
        if (event.keyCode === 99) {
            storage.clear();
        }
    });
})(jQuery);
