/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

$(function() {
    $('#submitButton').click(function() {
        var btn = $(this);
        btn.button('loading');
        window.setTimeout(function() {
            btn.button('reset');
            btn.toggleClass('btn-success');
            btn.text('Success!');
            window.setTimeout(function() {
                btn.toggleClass('btn-success');
                btn.text('Submit');
            }, 2000);
        }, 2000);
    });

    var root = $('#root');

    //$('form').prepend(genMenu('document', 'Document:', [{value: "02252014075100", label: "02252014075100 - 20140225 - Cameron Crazies"},
    //    {value: "02072014104900", label: "02072014104900 - 20140202 - National Anthem"},
    //    {value: "02132014095000", label: "02132014095000 - 20140206 - Downtown Durham"},
    //    {value: "02142014030700", label: "02142014030700 - undefined - WBB: Duke vs. UNC"},
    //    {value: "02162014085900", label: "02162014085900 - undefined - WBB: Duke vs. UNC"},
    //    {value: "02162014100100", label: "02162014100100 - undefined - WBB: Duke vs. UNC"}]));
    //$('form').prepend(genMenu('collection', 'Collection:', [{label: 'composites', value: 'composites'}, {label: 'albums', value: 'albums'}, {label: 'snapshots', value: 'snapshots'}]));

    //root.append(genInput('eventId', 'Event ID:', true, 'Event ID'));
    //root.append(genDropdown('access', 'Access', [genDropGroup('users', 'Users:', [{name: 'user0', label: '0', elements: [genInput('hi', 'hii', true)]}])], true));


    $('.panel-title').click(function() {
        $(this).find('span').toggleClass('glyphicon-chevron-up');
        $(this).find('span').toggleClass('glyphicon-chevron-down');
    });
});

function genInput(name, label, li, placeholder, value, disabled) {
    if (!name || !label)
        return null;
    value = value ? value : '';
    placeholder = placeholder ? placeholder : '';
    disabled = disabled ? ' disabled' : '';
    var li1 = '', li2 = '';
    if (li) {
        li1 = '<li>';
        li2 = '</li>';
    }

    return $(li1 + '<div class="form-group"><label class="control-label col-sm-3" for="' + name + '">'
            + label + '</label><div class="col-sm-9"><input id="' + name
            + '" class="form-control input-sm"  placeholder="' + placeholder +
            '" type="text" value="' + value + '" name="' + name + '" title="'
            + name + '"' + disabled + '/></div></div>' + li2);
}

function genDropdown(name, label, contents, li) {
    // contents is an array of jQuery objects to put in a UL inside the dropdown
    if (!name || !label)
        return null;
    var li1 = '', li2 = '';
    if (li) {
        li1 = '<li>';
        li2 = '</li>';
    }
    
    var dd = $(li1 + '<div class="panel-group" id="' + name + '"><div class="panel panel-default">\
            <div class="panel-heading"><a data-toggle="collapse" data-parent="#' + name + '" href="#' + name + 'Collapse">\
            <h3 class="panel-title">' + label + '<span class="glyphicon glyphicon-chevron-down pull-right"></span></h3>\
            </a></div><div id="' + name + 'Collapse" class="panel-collapse collapse">\
            <div class="panel-body"></div></div></div></div>' + li2);
    var addTo = dd.find('.panel-body');
    var ul = $('<ul></ul>');
    for(var k = 0; k < contents.length; k++){
        ul.append(contents[k]);
    }
    addTo.append(ul);
    return dd;
}

function genMenu(name, label, options, li) {
    // options should be an array of objects, each containing 2 fields - value and label
    if (!name || !label || !options)
        return null;
    var li1 = '', li2 = '';
    if (li) {
        li1 = '<li>';
        li2 = '</li>';
    }
    var select = $(li1 + '<div title="' + name + '" id="' + name + 'Div" class="form-group"><label class="control-label col-sm-3 text-right" for="' + name + 'Div">' + label + '</label><div class="col-sm-9"><select class="form-control input-sm" id="' + name + 'Select"></select></div></div></div>' + li2);
    for (var k = 0; k < options.length; k++)
        select.find('#' + name + 'Select').append('<option value="' + options[k].value + '" label="' + options[k].label + '"></option>');

    return select;
}

function genDropGroup(name, label, sections, li) {
    //sections is an arrray of objects.  Each object includes a name, label, and elements: an array of jQuery elements within that dropdown.
    if (!name || !sections)
        return null;
    var li1 = '', li2 = '';
    if (li) {
        li1 = '<li>';
        li2 = '</li>';
    }

    var group = $(li1 + '<label>' + label + '</label><div class="panel-group" id="' + name + '"></div>' + li2);

    for (var k = 0; k < sections.length; k++) {
        var set = $('<div class="panel panel-default"><div class="panel-heading"><a data-toggle="collapse" data-parent="#'
                + name + '" href="#' + name + 'collapse' + k + '"><h3 class="panel-title">' + sections[k].label +
                '</h3></a></div><div id="' + name + 'collapse' + k +
                '" class="panel-collapse collapse in"><div class="panel-body"><ul class="group"></ul></div></div></div>');
        var ul = set.find('ul');
        for (var j = 0; j < sections[k].elements.length; j++)
            ul.append(sections[k].elements[j]);
        group.append(set);
    }

    return group;
}