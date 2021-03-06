Ext.define('Onc.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    requires: [
        'Onc.view.SearchFilterView',
        'Onc.view.SearchResultsView'
    ],

    initComponent: function() {
        this.callParent(arguments);
        this.down('#username-label').setText('Hi, ' + Onc.model.AuthenticatedUser.username + '!');
        this._adjustViewToGroups();
    },

    _adjustViewToGroups: function() {
        var isAdmin = Onc.model.AuthenticatedUser.isAdmin();
        var adminButtons = ['infrastructurejoin-button', 'tasks-button'];
        var adminTabs = ['vmmap', 'oms-shell'];
        // adjust controll buttons
        for (var i = 0; i < adminButtons.length; i++) {
            this.down('#' + adminButtons[i]).hidden = !isAdmin;
        }
        // adjust tabs
        var tabs = this.down('#mainTabs');
        if (!isAdmin)
            for (var i = 0; i < adminTabs.length; i++) {
                console.log(tabs);
                tabs.remove(this.down('#' + adminTabs[i]));
            }
    },

    items: [{
        region: 'north',
        id: 'header',
        html: '<img src="img/onc_logo.png" alt="OpenNode Console" width="436px" height="59px" />',
        height: 66,
        padding: 5,
        border: false,
        bodyStyle: 'background: inherit',
        items: [{
            xtype: 'container',
            border: false,
            layout: {
                type: 'table',
                columns: 4,
                trAttrs: { align: 'right' }
            },
            style: 'position: absolute; top: 2px; right: 0px',
            bodyStyle: 'background: inherit',
            defaults: {
                margin: '0 0 0 2'
            },
            items: [{
                id: 'username-label',
                xtype: 'text',
                text: 'N/A',
                colspan: 4,
                style: {
                    "text-align": 'right'
                }
            }, {
                id: 'viewlog-button',
                xtype: 'button',
                text: 'View logs',
                ui: 'default-toolbar',
                style: {
                    textDecoration: 'underline'
                }
            }, {
                id: 'tasks-button',
                xtype: 'button',
                text: 'Tasks'
            }, {
                id: 'infrastructurejoin-button',
                xtype: 'button',
                text: 'Host management',
            }, {
                id: 'logout-button',
                xtype: 'button',
                text: 'Log out',
            }]
        }]
    }, {
        region: 'west',
        collapsible: true,
        split: true,
        header: false,
        width: 220,
        minWidth: 220,
        maxWidth: 500,
        bodyCls: 'searchpanel',
        layout: {type: 'vbox', align: 'stretch'},
        items: [{
            xtype: 'searchfilter',
            border: false,
            margin: '3 2 2 2'
        }, {
            xtype: 'searchresults',
            flex: 1
        }]
    }, {
        region: 'center',
        itemId: 'mainTabs',
        xtype: 'tabpanel',
        border: false,
        bodyStyle: 'background: inherit',
        plain: true,
        listeners: {
            'beforetabchange': function(tp, newTab, currentTab)  {
                if (newTab.id.startswith('computeview')) {
                    newTab.updateTabs();
                }
            }
        },
        preventHeader: true,
        defaults: {
            closable: true,
        },
        items: [{
            itemId: 'oms-shell',
            title: "OMS Shell",
            iconCls: 'icon-shell',
            closable: false,
            xtype: 'shell',
            url: Onc.core.Backend.url('/bin/omsh/webterm')
        }].concat(!ENABLE_VMMAP ? [] : [{
            itemId: 'vmmap',
            title: "VM Map",
            iconCls: 'icon-vmmap',
            closable: false,
            xtype: 'computevmmaptab'
        }])
    }]
});
