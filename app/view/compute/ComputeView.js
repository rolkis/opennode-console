Ext.define('Onc.view.compute.ComputeView', {
    extend: 'Ext.Container',
    alias: 'widget.computeview',
    requires: [
        'Onc.view.compute.ComputeHeaderView'
    ],

    iconCls: 'icon-system',
    layout: {type: 'vbox', align: 'stretch'},

    _makeTab: function(title, type) {
        var tab = {
                title: title,
                xtype: 'compute{0}tab'.format(type),
                itemId: '{0}tab'.format(type)
            };
        if (type === 'shell') {
            tab['shellConfig'] = {
                    url: Onc.core.Backend.url(Ext.String.format('/computes/{0}/consoles/default/webterm', this.record.get('id')))
            };
        }
        if (type === 'vnc') {
            tab['vncConfig'] = {
                    url: Onc.core.Backend.url(Ext.String.format('/computes/{0}/consoles/vnc', this.record.get('id')))
            };
        }
        return tab;
    },

    _adjustTab: function(title, tabType, shouldAdd) {
        var tabs = this.down('#tabs');
        var tab = tabs.down('#{0}tab'.format(tabType));

        if (!tab && shouldAdd) {
            tabs.add(this._makeTab(title, tabType));

            // a special case for convenience
            if (tabType === 'vmlist') {
                tabs.setActiveTab(tabs.child('#vmlisttab'));
            }
        }
        if (tab && !shouldAdd) {
            tabs.remove(tab);
        }
    },

    updateTabs: function() {
        var me = this;
        if (this.record) {
            var rec = this.record;
            me._adjustTab('System', 'system', true);

            var isHn = rec.getChild('vms');
            me._adjustTab('VMs', 'vmlist', isHn);
            me._adjustTab('Network', 'network', isHn);
            me._adjustTab('Templates', 'templates', isHn);

            var isActive = rec.data['state'] === 'active';
            me._adjustTab('Shell', 'shell', isActive);
            me._adjustTab('VNC', 'vnc', isActive && ENABLE_VNC);
        }
        return true;
    },

    setRecord: function(compute) {
        console.log(compute.id);
        this.record = compute;

        var rec = this.record;
        console.log(rec.id);
        this.title = 'a';
        this.tabConfig = {
            tooltip: (rec.get('hostname') + '<br/>' +
                rec.get('ipv4_address') + '<br/>' +
                rec.get('type'))
        };

        this.items = [{
            xtype: 'computeheader',
            record: rec
        }, {
            flex: 1,
            xtype: 'tabpanel',
            itemId: 'tabs',
            defaults: {record: rec},
            items: [],
            plain: true,
            bodyStyle: 'background: inherit'
        }];
        this.doLayout();
    },

    initComponent: function() {
        var rec = null;
        this.title = 'Loading...';
        this.items = [];
        console.log('calling parents');
        console.log(arguments);
        this.callParent(arguments);
    }
});
