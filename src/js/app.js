(function($) {
    "use strict";
    $(document).ready(function() {
        var allGhosts = [];
        var storage = {
            set: function() {
                localStorage.setItem('ghosts', JSON.stringify(allGhosts));
            },
            get: function() {
                var ghosts = localStorage.ghosts === undefined
                    ? false
                    : localStorage.ghosts;
                return JSON.parse(ghosts);
            }
        }

        Ghost.prototype = {
            build: function(context) {
                var source = $('#ghost').html(),
                    template = Handlebars.compile(source),
                    context = context,
                    html = template(context);

                $(html).prependTo('.main-content').fadeIn();
                return $('.ghost').first();
            },
            init: function() {
                var _this = this;

                if ($('.empty-container').length > 0) {
                    $('.empty-container').remove();
                }

                this.info.self = this.build(this.info);

                this.animate(this, 'primary');
                $(this.info.self).on('click', function() {
                    Ghost.prototype.animate(_this, 'secondary');
                });

                allGhosts.push(_this);
                storage.set();
            },
            animate: function(ghost, action) {
                $(ghost.info.self).addClass(ghost.info.actions[action]);
                $(ghost.info.self).on('animationend', function() {
                    $(this).removeClass(ghost.info.actions[action])
                });
            }
        };

        function Ghost(context) {
            this.info = {
                name: context.name,
                self: null,
                actions: {
                    primary: context.actions.primary,
                    secondary: context.actions.secondary
                },
                color: context.color
            };
            this.init();
        }

        if (storage.get()) {
            var localGhosts = storage.get();
            for (var index = 0; index < localGhosts.length; index++) {
                if ($('.empty-container').length > 0) {
                    $('.empty-container').remove();
                }
                new Ghost(localGhosts[index].info);
            }
        }

        $('form').on('submit', function(event) {
            event.preventDefault();
            var context = {
                name: $(this).find('#ghost-name').val(),
                color: $(this).find('#ghost-color').val(),
                actions: {
                    primary: $(this).find('#ghost-primary').val(),
                    secondary: $(this).find('#ghost-secondary').val()
                }
            };
            $(this).trigger('reset');
            new Ghost(context);
        })
    });
})(jQuery);
