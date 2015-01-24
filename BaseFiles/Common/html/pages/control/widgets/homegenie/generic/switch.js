﻿[{
    Name: "Generic Switch",
    Author: "Generoso Martello",
    Version: "2013-03-31",

    GroupName: '',
    IconImage: 'pages/control/widgets/homegenie/generic/images/socket_off.png',
    StatusText: '',
    Description: '',
    UpdateTime: '',
    CurrentInstance: 0,

    RenderView: function (cuid, module) {
        var _this = this;
        var container = $(cuid);
        var widget = container.find('[data-ui-field=widget]');
        var controlpopup = widget.data('ControlPopUp');
        //
        // create and store a local reference to control popup object
        //
        if (!controlpopup) {
            container.find('[data-ui-field=controlpopup]').trigger('create');
            controlpopup = container.find('[data-ui-field=controlpopup]').popup();
            //
            controlpopup.find('[id=zwave-multi-00]').on('click', function () {
                _this.CurrentInstance = 0;
                var module2 = HG.WebApp.Utility.GetModuleByDomainAddress(module.Domain, module.Address);
                _this.RenderView(cuid, module2);
            });
            controlpopup.find('[id=zwave-multi-01]').on('click', function () {
                _this.CurrentInstance = 1;
                var module2 = HG.WebApp.Utility.GetModuleByDomainAddress(module.Domain, module.Address);
                _this.RenderView(cuid, module2);
            });
            controlpopup.find('[id=zwave-multi-02]').on('click', function () {
                _this.CurrentInstance = 2;
                var module2 = HG.WebApp.Utility.GetModuleByDomainAddress(module.Domain, module.Address);
                _this.RenderView(cuid, module2);
            });
            //
            controlpopup.find('[data-ui-field=command_on]').on('click', function () {
                if (_this.CurrentInstance == 0) {
                    HG.Control.Modules.ServiceCall('Control.On', module.Domain, module.Address, '', function (data) { });
                }
                else {
                    HG.Control.Modules.ServiceCall('MultiInstance.Set/Switch.Binary/' + _this.CurrentInstance + '/255', module.Domain, module.Address, '', function (data) { });
                    HG.Control.Modules.ServiceCall('MultiInstance.Get/Switch.Binary/' + _this.CurrentInstance, module.Domain, module.Address, '', function (data) { });
                }
            });
            //
            controlpopup.find('[data-ui-field=command_off]').on('click', function () {
                if (_this.CurrentInstance == 0) {
                    HG.Control.Modules.ServiceCall('Control.Off', module.Domain, module.Address);
                }
                else {
                    HG.Control.Modules.ServiceCall('MultiInstance.Set/Switch.Binary/' + _this.CurrentInstance + '/0', module.Domain, module.Address, '', function (data) { });
                    HG.Control.Modules.ServiceCall('MultiInstance.Get/Switch.Binary/' + _this.CurrentInstance, module.Domain, module.Address, '', function (data) { });
                }
            });
            //
            widget.data('ControlPopUp', controlpopup);
            //
            // initialization stuff here
            //
            // when options button is clicked control popup is shown
            widget.find('[data-ui-field=options]').on('click', function () {
                if ($(cuid).find('[data-ui-field=widget]').data('ControlPopUp')) {
                    $(cuid).find('[data-ui-field=widget]').data('ControlPopUp').popup('open');
                }
            });
            //
            // ui events handlers
            //
            // on button action
            widget.find('[data-ui-field=on]').on('click', function () {
                HG.Control.Modules.ServiceCall("Control.On", module.Domain, module.Address, null, function (data) { });
            });
            controlpopup.find('[data-ui-field=on]').on('click', function () {
                HG.Control.Modules.ServiceCall("Control.On", module.Domain, module.Address, null, function (data) { });
            });
            //
            // off button action
            widget.find('[data-ui-field=off]').on('click', function () {
                HG.Control.Modules.ServiceCall("Control.Off", module.Domain, module.Address, null, function (data) { });
            });
            controlpopup.find('[data-ui-field=off]').on('click', function () {
                HG.Control.Modules.ServiceCall("Control.Off", module.Domain, module.Address, null, function (data) { });
            });
            //
            // settings button
            widget.find('[data-ui-field=settings]').on('click', function () {
                HG.WebApp.Control.EditModule(module);
            });
        }
        //
        // read some context data
        //
        this.GroupName = container.attr('data-context-group');
        //
        // get module watts prop
        //
        var watts = HG.WebApp.Utility.GetModulePropertyByName(module, "Meter.Watts");
        if (watts != null) {
            var w = Math.round(watts.Value.replace(',', '.'));
            if (w > 0) {
                watts = w + 'W';
            } else watts = '';
        } else watts = '';
        //
        // get module level prop for status text
        //
        var level = HG.WebApp.Utility.GetModulePropertyByName(module, "Status.Level");
        if (level != null) {
            var updatetime = level.UpdateTime;
            if (typeof updatetime != 'undefined') {
                updatetime = updatetime.replace(' ', 'T'); // fix for IE and FF
                var d = new Date(updatetime);
                this.UpdateTime = HG.WebApp.Utility.FormatDate(d) + ' ' + HG.WebApp.Utility.FormatDateTime(d); //HG.WebApp.Utility.GetElapsedTimeText(d);
            }
            //
            level = this.GetLevel(level);
            if (level != 'OFF') {
                this.StatusText = '<img width="15" height="15" src="images/common/led_green.png" style="vertical-align:middle" />';
            }
            else {
                this.StatusText = '<img width="15" height="15" src="images/common/led_black.png" style="vertical-align:middle" />';
            }
        } else level = '';
        //
        var level1 = '';
        var level2 = '';
        var nodeinfo = HG.WebApp.Utility.GetModulePropertyByName(module, "ZWaveNode.NodeInfo");
        if (nodeinfo != null && (' ' + nodeinfo.Value + ' ').indexOf(' 60 ') >= 0) {
            controlpopup.find('[data-ui-field=zwave-multi-options]').show();
            //
            // multi channel
            level1 = HG.WebApp.Utility.GetModulePropertyByName(module, "ZWaveNode.MultiInstance.SwitchBinary.1"); // instance 1 level
            if (level1 != null) {
                level1 = this.GetLevel(level1);
            } else level1 = '';
            //
            level2 = HG.WebApp.Utility.GetModulePropertyByName(module, "ZWaveNode.MultiInstance.SwitchBinary.2"); // instance 1 level
            if (level2 != null) {
                level2 = this.GetLevel(level2);
            } else level2 = '';
        }
        else {
            controlpopup.find('[data-ui-field=zwave-multi-options]').hide();
            widget.find('[data-ui-field=options]').hide();
        }
        this.StatusText = '<span style="vertical-align:middle">' + watts + '&nbsp;&nbsp;&nbsp; ' + level + ' ' + level1 + ' ' + level2 + '</span> ' + this.StatusText;
        //
        // set icon image
        //
        var widgeticon = HG.WebApp.Utility.GetModulePropertyByName(module, 'Widget.DisplayIcon');
        if (widgeticon != null && widgeticon.Value != '') {
            if (level != 'OFF')
                this.IconImage = widgeticon.Value.replace('_off', '_on');
            else
                this.IconImage = widgeticon.Value;
        }
        else if (level != 'OFF') {
            this.IconImage = 'pages/control/widgets/homegenie/generic/images/socket_on.png';
        }
        else {
            this.IconImage = 'pages/control/widgets/homegenie/generic/images/socket_off.png';
        }
        this.Description = (module.Domain.substring(module.Domain.lastIndexOf('.') + 1)) + ' ' + module.Address;
        //
        // render widget
        //
        widget.find('[data-ui-field=name]').html(module.Name);
        widget.find('[data-ui-field=description]').html(this.Description);
        widget.find('[data-ui-field=status]').html(this.StatusText);
        widget.find('[data-ui-field=icon]').attr('src', this.IconImage);
        widget.find('[data-ui-field=updatetime]').html(this.UpdateTime);
        //
        // render control popup
        //
        controlpopup.find('[data-ui-field=icon]').attr('src', this.IconImage);
        controlpopup.find('[data-ui-field=group]').html(this.GroupName);
        controlpopup.find('[data-ui-field=name]').html(module.Name);
        //
        controlpopup.find('[data-ui-field=status]').html(level + '<br />' + watts);
        //
        controlpopup.find("input[name*=zwave-multi-check]:checked").each(function () {
            if ($(this).val() == '0')
                controlpopup.find('[data-ui-field=status]').html(level + '<br />' + watts);
            else if ($(this).val() == '1')
                controlpopup.find('[data-ui-field=status]').html(level1 + '<br />' + watts);
            else if ($(this).val() == '2')
                controlpopup.find('[data-ui-field=status]').html(level2 + '<br />' + watts);
        });
    },

    GetLevel: function (paramlevel) {
        level = paramlevel.Value.replace(',', '.') * 100;
        if (level >= 99 || level == 0) {
            level = (level >= 99 ? 'ON' : 'OFF');
        }
        else {
            level = level.toFixed(0) + '%';
        }
        return level;
    }

}]