(function () {
    "use strict";

    const ghostModule = function () {
        const empty = document.querySelector('.empty-container');
        const form = document.querySelector('form');
        const source = document.querySelector('#ghost-template').innerHTML;
        let allGhosts = [];

        const storage = {
            set() {
                localStorage.setItem("ghosts", JSON.stringify(allGhosts));
            },
            get() {
                let ghosts = localStorage.ghosts === undefined ? false : JSON.parse(localStorage.ghosts);
                return ghosts;
            },
            clear() {
                localStorage.removeItem('ghosts');
                console.log('localStorage cleared!');
            }
        };

        class Ghost {
            constructor(context) {
                this.info = context;
                this.info.self = this.buildGhost();
                this.init();
            }

            animate(type) {
                this.info.self.classList.add(this.info[type]);
                this.info.self.addEventListener('animationend', () => {
                    this.info.self.classList.remove(this.info[type]);
                });
            }

            bind() {
                this.info.self.addEventListener('click', () => {
                    this.animate('secondary');
                });
            }

            buildGhost() {
                let container = document.createElement('div'),
                    template = Handlebars.compile(source),
                    context = this.info,
                    html = template(context);

                container.className = 'ghost-container';
                container.innerHTML = html;

                document.querySelector('.main-content').appendChild(container);
                return container.firstElementChild;
            }

            store() {
                allGhosts.push(this);
            }

            init() {
                this.bind();
                this.store();
                storage.set();
                this.animate('primary');
            }
        }

        function bindEvents() {
            form.addEventListener('submit', () => {
                event.preventDefault();
                empty.remove();

                new Ghost(formValues(event));

                form.reset();
            });

            document.addEventListener('keypress', () => {
                if (event.keyCode === 99) storage.clear(); // C = Clear
            });
        }

        function checkLocalStorage() {
            if (storage.get()) {
                const ghosts = storage.get();
                empty.remove();

                for (let index = 0; index < ghosts.length; index++) {
                    new Ghost(ghosts[index].info);
                }

                console.log(allGhosts);
            }
        }

        function formValues() {
            const context = {
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

    const ghostApp = ghostModule();
    ghostApp.run();
})();