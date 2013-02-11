Ext.define('Onc.controller.NewVmController', {
    extend: 'Ext.app.Controller',

    views: ['compute.NewVmView'],
    stores: ['ComputesStore'],

    refs: [
        {ref: 'window', selector: 'window.newvm'},
        {ref: 'form', selector: 'window.newvm form'}
    ],

    busListeners: {
        displayNewVMDialog: function(hn){
            this.getView('compute.NewVmView').create({
                parentCompute: hn
            }).show();
        }
    },

    init: function() {
        this.control({
            '#create-new-vm-button': {
                click: function(sender) {
                    var form = this.getForm().getForm();
                    if (form.isValid()) {
                        var data = form.getFieldValues();

                        // tags
                        var tagger = this.getForm().child('#tags').child('tagger');
                        var tags = tagger.cloneTags();
                        data['tags'] = tags;

                        // cleanup for auto-generated properties from form input fields
                        // TODO: figure out how to exclude input field from Tagger widget to generate properties in form.getFieldValues() call
                        for (var key in data) {
                            if (key.indexOf('ext-') === 0 || key.indexOf('combobox-') === 0)
                                delete data[key];
                         }

                        var virtualizationContainer = this.getWindow().parentCompute.getChild('vms');
                        var url = virtualizationContainer.get('url');
                        this.fireBusEvent('displayNotification', 'Creating new Virtual Machine...');
                        Onc.core.Backend.request('POST', url, {
                            jsonData: data,
                            success: function(response) {
                                var ret = Ext.JSON.decode(response.responseText);
                                if (!ret['success']) {
                                    form.markInvalid(ret['errors']);
                                } else {
                                    // poll the status until IDeployed feature is received
                                    this.getWindow().destroy();
                                    this.pollIDeployedFeature(ret['result'], 0);
                                }
                            }.bind(this),
                            failure: function(response) {
                                console.error(response.responseText);
                                this.fireBusEvent('displayNotification', 'Error occurred while creating new Virtual Machine', 'error');
                            }.bind(this)
                        });
                    }
                }
            }
        });
    },

    pollIDeployedFeature: function(result, retryAttempt) {
        var maxRetryAttempts = 5;
        var retryPeriod = 3; //seconds
        if (maxRetryAttempts > retryAttempt) {
            var url = result.url;
            console.log(result);
            Onc.core.Backend.request('GET', url, {
                success: function(response) {
                    console.log(response);
                    var ret = Ext.JSON.decode(response.responseText);

                    if ( ret.features.contains('IDeployed')) {
                        Ext.MessageBox.alert('Status', 'Node has been successfully created');
                    } else {
                        console.log('IDeployed feature not found, retrying');
                        setTimeout(function () {
                            this.pollIDeployedFeature(result, retryAttempt+1)}.bind(this), retryPeriod * 1000);
                    }
                }.bind(this),
                failure: function(request, response) {
                    console.log('Failure from the VM get request, ' + result.url);
                    setTimeout(function () {
                        this.pollIDeployedFeature(result, retryAttempt+1)}.bind(this), retryPeriod * 1000);
                }.bind(this)
            });
        } else {
            Ext.MessageBox.alert('Status', 'Node creation has failed');
        }
    }
});
