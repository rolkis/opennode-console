Ext.Loader.setConfig({enabled: true});
Ext.require([
    '*',
    'Ext.ux.form.MultiSelect'
]);

Ext.define('Onc.view.compute.ZabbixRegistrationView', {
    extend: 'Ext.window.Window',
    alias: 'widget.zabbix2',

    title: 'Zabbix registration',
    modal: true,
    border: false,
    width: 300,
    resizable: false,

    config: {
        hostGroupStore: null
    },

    defaults: {
        border: false,
        bodyStyle: 'background: inherit',
        bodyPadding: 4
    },

    initComponent: function(){
        this.items = [{
            items: [{
                xtype: 'fieldset',
                title: 'Host group',
                items: [{
                    anchor: '100%',
                    xtype: 'multiselect',
                    msgTarget: 'side',
                    name: 'multiselect',
                    id: 'multiselect-field',
                    allowBlank: false,
                    height: 200,
                    store: this.hostGroupStore
                }]
            }, {
                xtype: 'fieldset',
                title: 'Zabbix agent',
                items: [{
                    xtype: 'radiogroup',
                    allowBlank: false,
                    msgTarget: 'side',
                    autoFitErrors: false,
                    anchor: '-18',
                    layout: 'column',
                    defaultType: 'container',
                    items: [{
                        defaultType: 'textfield',
                        items: [
                                {width:215, fieldLabel: "DNS Name", id: 'zabixx_dns_name',  name: 'dns_name'},
                                {width:215, fieldLabel: "IP Address", id: 'zabixx_ipv4_address', name: 'ipv4_address', disabled:true},
                                {width:215, fieldLabel: "Agent port", id: 'zabixx_agent_port', name: 'agent_port'}
                        ]
                        }, {
                        defaultType: 'radiofield',
                        items: [{
                            width:15,
                            name: 'rb-cust',
                            checked:true,
                            inputValue: 1,
                            padding: '0 0 5 5',
                            listeners: {
                                'change': function(th, newValue){
                                    Ext.getCmp('zabixx_dns_name').setDisabled(!newValue);
                                    Ext.getCmp('zabixx_ipv4_address').setDisabled(newValue);
                                }
                            }
                        }, {
                            width:15,
                            name: 'rb-cust',
                            inputValue: 2,
                            padding: '0 0 5 5'
                        }
                        ]}
                    ]}
                ]}
            ],
            buttons: [{
                text: 'Cancel' , handler: function() {
                    this.up('window').destroy();
                }
            }, {
                text: 'Save', itemId: 'save-zabbix-regitration-button'
            }]
        }];

        this.callParent(arguments);
    }
});
