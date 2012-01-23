Ext.define('Onc.tabs.VmMapTab', {
    extend: 'Onc.tabs.Tab',
    alias: 'widget.computevmmaptab',

    layout: 'fit',

    initComponent: function() {
        this.items = [{
            xtype: 'gridpanel',
            hideHeaders: true,
            columnLines: true,
            store: 'PhysicalComputesStore',

            columns: [
                {header: 'Name', dataIndex: 'hostname', width: 100},
                //{header: 'Disk pool size', dataIndex: 'diskspace', width: 15},
                {header: 'Map', dataIndex: 'id', flex: 1,
                    renderer: function(value, meta, rec) {
                        var totalMemory = rec.get('memory_usage'),
                            freeMemory = totalMemory,
                            vms = rec.getChild('vms').children(),
                            vm_list = "";

                        vms.each( function(vm) {
                            var memory = vm.get('memory_usage'),
                                width = parseInt(100 * (memory / totalMemory));
                            freeMemory -= memory;
                            vm_list += ["<td width=\"" + width + "%\">",
                                "<div class=\"vmmap-name\">" + vm.get('hostname') + "</div>",
                                "<div class=\"vmmap-mem\">" + parseInt(memory) + "</div>",
                                "<div class=\"vmmap-uptime\">" + vm.getUptime() + "</div>",
                                "<div class=\"vmmap-num-cores\">" + vm.get('num_cores') + "</div>",
                                "</td>"].join('\n');
                        });

                        if (freeMemory) {
                            var width = parseInt(100 * (freeMemory / totalMemory));
                            vm_list += ["<td width=\"" + width + "%\">",
                                "<div class=\"vmmap-name\">free</div>",
                                "<div class=\"vmmap-mem\">" + parseInt(freeMemory) + "</div>",
                                "</td>"].join('\n');
                        }

                        return ["<table width=\"100%\"><tbody><tr>",
                        vm_list,
                        "</tr></tbody></table>"].join('\n');
                    }
                }
            ]
        }];

        this.callParent(arguments);
    }
});