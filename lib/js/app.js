'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var ghostModule = function ghostModule() {
        var empty = document.querySelector('.empty-container');
        var form = document.querySelector('form');
        var source = document.querySelector('#ghost-template').innerHTML;
        var allGhosts = [];

        var storage = {
            set: function set() {
                localStorage.setItem("ghosts", JSON.stringify(allGhosts));
            },
            get: function get() {
                var ghosts = localStorage.ghosts === undefined ? false : JSON.parse(localStorage.ghosts);
                return ghosts;
            },
            clear: function clear() {
                localStorage.removeItem('ghosts');
                console.log('localStorage cleared!');
            }
        };

        var Ghost = function () {
            function Ghost(context) {
                _classCallCheck(this, Ghost);

                this.info = context;
                this.info.self = this.buildGhost();
                this.init();
            }

            _createClass(Ghost, [{
                key: 'animate',
                value: function animate(type) {
                    var _this = this;

                    this.info.self.classList.add(this.info[type]);
                    this.info.self.addEventListener('animationend', function () {
                        _this.info.self.classList.remove(_this.info[type]);
                    });
                }
            }, {
                key: 'bind',
                value: function bind() {
                    var _this2 = this;

                    this.info.self.addEventListener('click', function () {
                        _this2.animate('secondary');
                    });
                }
            }, {
                key: 'buildGhost',
                value: function buildGhost() {
                    var container = document.createElement('div'),
                        template = Handlebars.compile(source),
                        context = this.info,
                        html = template(context);

                    container.className = 'ghost-container';
                    container.innerHTML = html;

                    document.querySelector('.main-content').appendChild(container);
                    return container.firstElementChild;
                }
            }, {
                key: 'store',
                value: function store() {
                    allGhosts.push(this);
                }
            }, {
                key: 'init',
                value: function init() {
                    this.bind();
                    this.store();
                    storage.set();
                    this.animate('primary');
                }
            }]);

            return Ghost;
        }();

        function bindEvents() {
            form.addEventListener('submit', function () {
                event.preventDefault();
                empty.remove();

                new Ghost(formValues(event));

                form.reset();
            });

            document.addEventListener('keypress', function () {
                if (event.keyCode === 99) storage.clear(); // C = Clear
            });
        }

        function checkLocalStorage() {
            if (storage.get()) {
                var ghosts = storage.get();
                empty.remove();

                for (var index = 0; index < ghosts.length; index++) {
                    new Ghost(ghosts[index].info);
                }

                console.log(allGhosts);
            }
        }

        function formValues() {
            var context = {
                name: event.target[0].value,
                color: event.target[1].value,
                primary: event.target[2].value,
                secondary: event.target[3].value
            };
            return context;
        }

        function init() {
            bindEvents();
            checkLocalStorage();
        }

        return {
            run: init
        };
    };

    var ghostApp = ghostModule();
    ghostApp.run();
})();