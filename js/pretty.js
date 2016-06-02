/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

$(function() {
//    $('#submitButton').click(function() {
//        var btn = $(this);
//        btn.button('loading');
//        window.setTimeout(function() {
//            btn.button('reset');
//            btn.toggleClass('btn-success');
//            btn.text('Success!');
//            window.setTimeout(function() {
//                btn.toggleClass('btn-success');
//                btn.text('Submit');
//            }, 2000);
//        }, 2000);
//    });

//    var root = $('#root');

    //$('form').prepend(genMenu('document', 'Document:', [{value: "02252014075100", label: "02252014075100 - 20140225 - Cameron Crazies"},
    //    {value: "02072014104900", label: "02072014104900 - 20140202 - National Anthem"},
    //    {value: "02132014095000", label: "02132014095000 - 20140206 - Downtown Durham"},
    //    {value: "02142014030700", label: "02142014030700 - undefined - WBB: Duke vs. UNC"},
    //    {value: "02162014085900", label: "02162014085900 - undefined - WBB: Duke vs. UNC"},
    //    {value: "02162014100100", label: "02162014100100 - undefined - WBB: Duke vs. UNC"}]));
    //$('form').prepend(genMenu('collection', 'Collection:', [{label: 'composites', value: 'composites'}, {label: 'albums', value: 'albums'}, {label: 'snapshots', value: 'snapshots'}]));

    //root.append(genInput('eventId', 'Event ID:', true, 'Event ID'));
    //root.append(genDropdown('access', 'Access', [genDropGroup('users', 'Users:', [{name: 'user0', label: '0', elements: [genInput('hi', 'hii', true)]}])], true));

});

function genForm(id) {
   var elem = $(document.createElement("form"));
   elem.addClass('form-horizontal');
   elem.attr({'role': 'form', 'id': id});
   return elem;
}

function genTextField(name, label, li, placeholder, value, disabled) {
    if (!name || !label)
        return null;
    value = value ? value : '';
    placeholder = placeholder ? placeholder : '';
    disabled = disabled ? ' disabled' : '';
//    var li1 = '', li2 = '';
//    if (li) {
//        li1 = '<li>';
//        li2 = '</li>';
//    }

   var div = $(document.createElement("div"));
   div.css('margin-bottom','4px');
   div.addClass('form-group');

   if(li){
      var textField = $(document.createElement("li"));
      textField.append(div);
   } else {
      var textField = div;
   }


    div.append('<label class="control-label col-sm-3" for="' + name + '">'
            + label + '</label><div class="col-sm-9"><input id="' + name
            + '" class="form-control input-sm"  placeholder="' + placeholder +
            '" type="text" value="' + value + '" name="' + name + '" title="'
            + name + '"' + disabled + '/></div>');

    //$('.form-group').css({'margin-bottom': '4px'});
    return textField;
}

function genDropdown(name, label, contents, li, listtype) {
    // contents is an array of jQuery LI objects to put in a UL inside the dropdown

    console.log(name + " " + label + " " + contents + " " + li + " " + listtype);

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
            <div class="panel-body"><ul class="group " + listtype + "></ul></div></div></div></div>' + li2);
    var addTo = dd.find('.group');
    var ul = $('<ul></ul>');
    for(var k = 0; k < contents.length; k++){
        ul.append(contents[k]);
    }
    addTo.append(ul);
    dd.find('.panel-title').click(function() {
        $(this).find('span').toggleClass('glyphicon-chevron-up');
        $(this).find('span').toggleClass('glyphicon-chevron-down');
    });
    dd.data("genData", {"name": name, "label": label, "contents": contents, "li": li, "listtype": listtype});
    return dd;
}

function genMenu(name, label, options, li) {
    // options should be an object formatted as {label1:value1, label2:value2}
   //Returns a set: containing the dropdown and and it's enclosing div
    if (!name || !label || !options)
        return null;
    var li1 = '', li2 = '';
    if (li) {
        li1 = '<li>';
        li2 = '</li>';
    }
    //console.log(options instanceof Array);
    //console.log(options);
    if(options instanceof Array){
        var optionobject = {};
        for(var i = 0; i < options.length; i++){
            //console.log(options[i]);
            optionobject[options[i]] = options[i];
        }
        options = null;
        options = optionobject;
    }
    //console.log(options);

    var select = $(li1 + '<div title="' + name + '" id="' + name + 'Div" class="form-group"><label class="control-label col-sm-3 text-right" for="' + name + 'Div">' + label + '</label><div class="col-sm-9"><select class="form-control input-sm" id="' + name + 'Select"></select></div></div></div>' + li2);
    var dropdown = select.find('#' + name + 'Select');
    for (var label in options)
        dropdown.append('<option value="' + options[label] + '" label="' + label + '"></option>');

    return {div: select, dropdown: dropdown};
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

function genButton(name, label, value, buttonClass){
   if(!value)
      value = "submit";
   if(!buttonClass)
      buttonClass = "primary";
   return $('<button type="button" class="btn btn-' + buttonClass + '" id="' +  name + 'Button" value="' + value + '" name="composites">' + label + '</button>');
}
