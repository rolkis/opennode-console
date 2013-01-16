Ext.define('Onc.controller.InfrastructureJoinController', {
    extend: 'Ext.app.Controller',

    views: ['InfrastructureJoinView'],
    models: ['ManagedNode'],
    stores: ['RegisteredNodesStore', 'IncomingNodesStore'],

    refs: [
        {ref: 'window', selector: 'window.infrastructurejoin'},
        {ref: 'form', selector: 'window.infrastructurejoin form'}
    ],

    view: null,


    busListeners: {
        displayHostManager: function() {
            this.view = this.getView('InfrastructureJoinView').create();
            this.view.show();
            this._load();
        }
    },

    init: function(){
        this.control({
            '#infrastructureJoin':{
                'hostAccept': function(source, hostname){
                    var url = '/machines/incoming/salt/{0}/actions/accept'.format(hostname);

                    Onc.core.Backend.request('PUT', url, {
                       success: function(response) {
                           this._load();
                       }.bind(this),
                       failure: function(response) {
                           console.error('Accept host action failed: ' + response.responseText);
                       }
                   });
                },
                'hostReject': function(source, hostname){
                    var url = '/machines/incoming/salt/{0}/actions/reject'.format(hostname);

                    Onc.core.Backend.request('PUT', url, {
                       success: function(response) {
                           this._load();
                       }.bind(this),
                       failure: function(response) {
                           console.error('Reject host action failed: ' + response.responseText);
                       }
                   });
                },
                'hostDelete': function(source, hostname){
                    var url = '/machines/by-name/{0}'.format(hostname);

                    Onc.core.Backend.request('DELETE', url, {
                       success: function(response) {
                           this._load();
                       }.bind(this),
                       failure: function(response) {
                           console.error('Delete host action failed: ' + response.responseText);
                       }
                   });
                },
                'reload': function(source){
                    this._load();
                }
            }
        });
    },

    _load: function(){
        this.getStore('IncomingNodesStore').load();
        this.getStore('RegisteredNodesStore').load();
    }
});
