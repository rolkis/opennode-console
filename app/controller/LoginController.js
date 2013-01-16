Ext.define('Onc.controller.LoginController', {
    extend: 'Ext.app.Controller',
    require: 'Onc.model.AuthenticatedUser',

    views: ['LoginWindow', 'Viewport'],

    refs: [{ref: 'searchResults', selector: '#search-results'},
           {ref: 'tabs', selector: '#mainTabs'}],

    _viewport: null,

    init: function() {
        Onc.core.Backend.on('loginrequired', this._login.bind(this));

        Onc.core.Backend.request('GET', 'auth')
            .success(this._onAuth.bind(this))
            .failure(function(response) {
                console.assert(response.status === 403);
            });

        this.control({
            'loginwindow': {
                login: function(token) {
                    this._onAuth();
                }.bind(this)
            },
            '#logout-button': {
                click: function() {
                    Onc.core.Backend.request('GET', 'logout');
                    this._login();
                }
            }
        });
    },

    _login: function() {
        if (this._viewport){
            this._viewport.destroy();
        }
        Onc.model.AuthenticatedUser.reset();
        this._viewport = this.getView('LoginWindow').create();
    },

    _onAuth: function() {
        // XXX Needs refactoring once a more elegant role reporting is implemented, possibly as art 
        // make a query to get user roles
        var me = this;
        Onc.core.Backend.request('PUT', 'bin/id')
            .success(function(response) {
                Onc.model.AuthenticatedUser.parseIdCommand(response);
                me._onRoleKnown();
            })
            .failure(function(response) {
                console.assert(response.status === 403);
            });
    },

    _onRoleKnown: function() {
        Onc.core.hub.Hub.run();
        var cstore = Ext.getStore('SearchResultsStore');
        if (Onc.model.AuthenticatedUser.isAdmin())
            cstore.getProxy().extraParams['q'] = 'virt:no';
        else
            cstore.getProxy().extraParams['q'] = 'virt:yes';
        cstore.load();
        if (this._viewport)
            this._viewport.destroy();
        this._viewport = this.getView('Viewport').create();
    }
});
