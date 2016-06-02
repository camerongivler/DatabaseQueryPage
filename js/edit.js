/************************************************************
 * edit.js
 *
 * Interface function for aqueti web services
 *************************************************************/
"use strict";

/************************************************************
 * Listener function for page events
 ************************************************************/
$(document).ready(function()
{
   //AddItem button callback
   $(document.body).on('click', "#addButton", function() 
   {
      //Go to parent and down to sibling UL
      var par = $(this).parent()
      var child = $(par).children().first(); //sibling UL

      //Create copy of last LI
      //get last li elment in sibling
      var ref = $(child).children().last();//.children().first(); 
//      var element = $(ref).clone()
      var params = ref.data('genData');
     console.log(params.contents);
      var contents = [];
      for (var content in params.contents){
         console.log(params.contents[content]);
         contents.push(params.contents[content].clone());
      }
      var element = genDropdown(params.name + 1, params.label, contents, params.li, params.listtype);

      //Step through element and change values
//      clearElement( element);

      //Get child of child to set UL value
//      var index = $(element).val();
//      $(element).attr("index", index+1);

      //Create li element
//      var li = document.createElement("li");
//      var text = document.createTextNode(index+1);
//      li.appendChild(text);
//      li.appendChild(element[0]);

      //Add element into html
      $(element).appendTo(child);
   });

   //We are submitting data
   $(document.body).on('click', "#submitButton", function()
   {
      ///////////////////////
      //Extract query data
      ///////////////////////
 
      var args = {};

      //Get collection name from the title
      var collection = $(this).attr("name");

      //The top-level ul is defined by the id of root
      var root = document.getElementById("root");

      var data = parseInputTree(root);

      //Put data in a form for submission
      args.collection = collection;
      args.data = data["root"];
      args.query = {"id":args.data["id"]};
      args.sort = {};

      db.setData( args, setResultCallback);
   });
   genWorkPage();
});

/************************************************************
 * clear values for a given element and all of its children
 ************************************************************/
function clearElement( element )
{
   $(element).val("");

   var children = $(element).children();

   if(children.length > 0)
   {
      for( var i= 0; i <children.length; i++)
      {
         clearElement(children[i]);
      }
   }
}

/************************************************************
 * function to get a list of images
 *
 * This function gets a list of images from the database
 ************************************************************/
var genEditDiv = function(args)
{
   //Create the args variable - passed through sub classes on construction
//   args.collection = document.body.getAttribute("collection");

   args.query={};
   args.sort={};

   if(args.id == "new")
   {
      args.create = true;
      db.genNewId( args, genNewIdCallback);

      return;
   }

   //Create query from the input value
   args.query["id"] = args["id"];
   
   //get template for teh specified type
   db.getTemplate(args,loadTemplateCallback);
}

/************************************************************
 * Callback to get new timestamp
 ************************************************************/
var genNewIdCallback = function(args)
{ 
   args.data = args.query;
   args.query["id"] = args["id"];

   //get template for the specified type
   db.getTemplate(args, loadTemplateCallback);
}


/************************************************************
 * Callback from the loadTemplate Function
 ************************************************************/
var loadTemplateCallback = function(args,json) 
{
   args.template = json;

   //get Data and generate form
   db.getData( args, getDataCallback);
}

/************************************************************
 * Function that generates forms
 *
 * args:
 *    collection - name of collection
 *    query      - search parameters
 *    sort       - sort paramerts
 *    template   - reference template
 *    data       - array of data from the database
 ************************************************************/
var getDataCallback = function(args)
{
   var mainDiv = $('#mainDiv');
   var workDiv = $('#workDiv');
   //empty workdiv
   //console.log("workDiv.length = " + workDiv.length);
//   if( workDiv.length == 0){
//      workDiv = $(document.createElement('div'));
//      workDiv.attr({id: 'workDiv', title: args.collection});
//      mainDiv.append(workDiv);
//   } else
      workDiv.empty();
   var item={};

   //Take first object if more than one generated
   if(isObject(args.data[0]))
      item = args.data[0];
   else
      item = args["query"];

   //Check if the root ul exists. It so, delete it.
   //Function to generate the edit form
   var ul = genUL( args["template"], item, "" );

   ul.setAttribute("title", "root");
   ul.setAttribute("id", "root");
   workDiv.append(ul);

   var submitButton = genButton('submit', 'Submit');

   workDiv.append(submitButton);
}
   
/************************************************************
 * Generate an iamge form a given value
 *
 * Top level function to generate the homepage
 ************************************************************/
function genWorkPage()
{
   db.getCollections( getCollectionCallback);
}

/************************************************************
 * This function is called whenever a new list of collections
 * is selected.
 *
 * Top level function to generate the homepage.
 *
 * args variables
 * - data - list of collection in the database
 ************************************************************/
var getCollectionCallback = function(data)
{
   var collectionselect = genMenu('collections', 'Collections:', data);
   $('#form').append(collectionselect.div);
   var collectionsdrop = collectionselect.dropdown;
   //Create listener for a colleciton change
   collectionsdrop.change( function()
   {
      var args = {};

      //Establish collection and query
      //Get selected value and generate remaining pages
      args.collection = collectionsdrop.val();
      args.query={};
      args.sort={};

      //get data with the given callback
      db.getData(args, collectionChangeCallback);
   });

   //trigger default selection
   $(collectionsdrop).trigger('change');
}

/************************************************************
 * Function that is executed when a collection is selected
 *
 * Inputs:
 * - args.collection - name of selected collection
 * - args.query - query values for selecting items
 * - args.sort - sort options for data
 * - args.data - results from the getData
 ************************************************************/
var collectionChangeCallback = function(args)
{
   //Get the queryDiv and set the title to the new value
//   var mainDiv = $("#mainDiv");
   var form = $('#form');

   $('#workDiv').remove();
   //create queryDiv if it doesn't exist
//   if(workDiv.length == 0) {
      var workDiv = $(document.createElement("div"));
      workDiv.attr("id","workDiv");
//   } else
      //form.empty();
//      workDiv.empty();

   //Create a preview box
   workDiv.attr("title", args.collection);

   var documentoptions = {};

   //Add option for a new item if we're not a collection (they are added when an image is uploade)
   if( args.collection != "composites")
   {
      documentoptions['new'] = 'new';
   }

   //Add an item for each item returned in args["data"]
   for( var item in args["data"])
   {
      documentoptions[args["data"][item]["id"]+" - "+args["data"][item]["date"]+" - "+args["data"][item]["title"]] = args["data"][item]["id"];
   }

   $('#documentsDiv').remove();
   var documentselect = genMenu('documents', 'Documents:', documentoptions);
   form.append(documentselect.div);
   form.append(workDiv);
   var documentsdrop = documentselect.dropdown;

   //Create listener to detect change in selected document
   documentsdrop.change( function() 
   {
      var args={};
      args.collection = workDiv.attr("title");

      //Pull value from the calling function
      args.id = $(this).val();

      //Generate the edit element
      genEditDiv(args);
   });

   //Call change for the defult (new value0
   documentsdrop.trigger('change');
}

/************************************************************
 * Generate an dropdown list
 ************************************************************/
function genDropDownList( name, id, options )
{
   var select = document.createElement("select");

   for( var i = 0; i < options.length; i++ )
   {
      var opt = document.createElement("option");
      var text = document.createTextNode(options[i]);
      opt.appendChild(text);

      select.appendChild(opt);
   }

   select.setAttribute("id",id);
   select.setAttribute("name",name);

   return select;
}
      

/************************************************************
 * Generate an iamge form a given value
 ************************************************************/
function genImage(args)
{
   var frame = document.createElement("iframe");
   frame.setAttribute("src",args["src"]);
   frame.setAttribute("width",args["width"]);
   frame.setAttribute("height",args["height"]);
   if( args["allowfullscreen"])
      frame.setAttribute("allowfullscreen",true);
   if( args["seamless"])
      frame.setAttribute("seamless",true);
   
   return frame;
}

var setResultCallback = function(args)
{
   var url = document.URL;
   url = url.substring(0,url.indexOf("?"));
   url = url+"?"+args.collection+"="+args.query["id"];

   //reload with the given url
   window.location.assign(url);
   window.location.reload(true);
}

/************************************************************
 * parseInputTree
 *
 * Funciton to extract data from long list
 ************************************************************/
function parseInputTree( root )
{
   var tag = $(root).prop("tagName");
   var children = root.childNodes;
   var title = $(root).attr("title");

   //If UL
   if( tag == "UL")
   {
      /////////////////////////////////////////////
      //If we're an array
      /////////////////////////////////////////////
      if( $(root).attr("class") == "array")
      {
         var  arr = [];

         for( var i= 0; i <children.length; i++)
         {
            var data = {};

            var tag = $(children[i]).prop("tagName");
            if( tag == "LI")
            {
               
               var local = {};
               var element = parseInputTree(children[i]);

               if( element != "")
                  arr.push(element);
            }
         }

         var data = {};
         data[title] = arr;

         return data;
      }
      /////////////////////////////////////////////
      //If we're a group
      /////////////////////////////////////////////
      else if( $(root).attr("class") == "group")
      {
         var result = [];
         var data = {};
         for(var i = 0; i< children.length; i++)
         {
            var element = parseInputTree(children[i]);

            if(element != -1)
            {
               var keys = Object.keys(element);
               for( key in keys)
                  data[keys[key]] = element[keys[key]];
            }
         }

         result.push(data);
         return data;
      }

      //Standard list processing
      else
      {
         var result={};
         var data={};

//         var listkey = $(root).attr("title");
         var listkey = title;

         for( var i= 0; i <children.length; i++)
         {
            var value = parseInputTree( children[i]);

            if( value != -1)
            {
               var keys = Object.keys(value);
               for( key in keys)
                  data[keys[key]] = value[keys[key]];
            }
         }
         result[listkey] = data;

         return result;
//         return data;
      }
   }
   //If an li element, add to dictionary
   else if( tag == "LI" )
   {
      for( var i = 0; i < children.length; i++)
      {

         var element = parseInputTree( children[i]);

         if( element != -1)
         {
            return element;
         }
      }
      return -1;
   }
   //If an input element, return value
   else if( tag == "INPUT")
   {
      var data = {};
//      var key = $(root).attr("title");
      var key = title;
      data[key] = $(root).val();
      return data
   }
   else if( tag == "SELECT")
   {
      var data = {};
      var key = title;
//      var s = $(root).find('option:selected');
//      alert("Options:"+s.text());

      data[key] = $(root).find("option:selected").text();
      return data;
   }

   return -1;
}

/************************************************************
 * Recursive parsing function
 ************************************************************/
var parseChildren = function(item)
{
   var mydata = {};
   var title = item.getAttribute("title");
   var tag = $(item).prop("tagName");
   
   //If select option
   if(tag == "SELECT")
   {
      var value = $(item).val();
      var name = $(item).attr("title");
      var id = $(item).attr("id");

      if( typeof name == 'undefined')
         mydata[title] = name;
      else
      {
         var keys = name.split(":");
         mydata[title] = parseTitle( keys.shift(), value)
      }
   }

   //INPUT and SELECT options
   else if(tag == "INPUT")
   {
      var value = $(item).val();
      var name = $(item).attr("title");
      if( typeof name == 'undefined')
         mydata[title] = name;
      else
      {
         var keys = name.split(":");
         mydata[title] = parseTitle( keys.shift(), value);
      }
   }

   return mydata[name];
}
   
/***********************************************************
 * genUL
 *
 * function to generate the TOP LEVEL unordered list
 ***********************************************************/
function genUL( template, item)
{
   //Create the unordered list
   var ul = document.createElement("ul");

   //Loop through all of the keys in the template and
   //generate the appropriate item
   for( var key in template)
   {
      if(item==undefined)
         var li = genInput( template[key],"",key);
      else
         var li = genInput( template[key],item[key], key);

//      li.setAttribute("title",key);
      ul.appendChild(li.get(0));
   }
   return ul;
}

/***********************************************************
 * genList
 *
 * function to generate any SUB LEVEL unordered lists
 ***********************************************************/
function genList(template, item, name, li) {
    if(!li)
        li = false;
    console.log("genList" + template + " " + item + " " + name + " " + li);
//      var ul = document.createElement("ul");
//   var name = template[key];
   var list = [];
   //Loop through all of the keys in the template and
   //generate the appropriate item
   var i = 0;
   for( var key in template)
   {
      i++;
      console.log("key: " + key);
      if(item==undefined | item == -1)
         var li1 = genInput( template[key],i,key);
      else
         var li1 = genInput( template[key],item[key], key);

//      li.setAttribute("title",key);
      //ul.appendChild(li);
      list.push(li1);
   }
   return genDropdown(name, name, list, li, "dict");
}

/***********************************************************
 * genInput
 *
 * Function to generate the input Form
 *
 * Steps through all template component provided.
 ************************************************************/
function genInput(template, item, key)
{

   //console.log(template);
   //if(item)
   //console.log(item);
   //else
   //console.log("null");
   //console.log(key);

   //Create an li component
   var li = $(document.createElement("li"));

   /////////////////////////////////////////////
   //Generate a dictionary UL
   /////////////////////////////////////////////
   if(template["type"] == "dictionary")
   {
      var ul2 = genList(template["data"], item, key);
      //ul2.setAttribute("title",key);
      //ul2.setAttribute("class","dict");

      //var text = document.createTextNode(key);

      //li.appendChild(text);
      li.append(ul2);
   }

   /////////////////////////////////////////////
   // Generate an array ul
   /////////////////////////////////////////////
   else if( template["type"] =="array")
   {
      //Create a ne ul element
      //var ul = document.createElement("ul");

//      ul.setAttribute("class","array");
//      ul.setAttribute("title",key);
     
      var list = [];

      //Key key if it does not exist make it an empty array
      if( !isArray(item))
         item = [];

      //Add text to descript li
      var text = $(document.createTextNode(key));
      li.append(text);

      if(item.length == 0)
      {
         item.push("");
      }

      //Loop through the array and generate an li for each
      //if( item.length > 0)
      //{
      //   var i = -1;
      //   for( var index in template["data"])
      //   {
      //      i++;
            //var li2 = $(document.createElement("li"));
            //var text = document.createTextNode(i);
            //li2.appendChild(text);

            //sdf - perhaps we shoudl 
            //generate an UL
            //cdg - no.
      //      console.log('index: ' + index);
      //      var input = genInput(template["data"][index], item[i], index);
      //      input.attr("index", i);
      //      input.attr("class","group");

            //li2.appendChild(input);
            //ul.appendChild(li2);
      //      list.push(input);
            
   //   }

 //       var ul = genDropdown(key, key, list, false, "array");

         //Create add button
         //var addButton = document.createElement("button");
         //var text = document.createTextNode("Add");
         var ul = $(document.createElement('ul'));
         for(var i = 0; i < item.length; i++);{
//              console.log("list: " + template["data"] + " " + item[i] + " " + i)
              ul.append(genList(template['data'], item[i], key, i, true));
         }
         var addButton = genButton("add", "Add", "", "default");
         //addButton.appendChild(text);
         //addButton.setAttribute("title",key);
         //addButton.setAttribute("id","addButton");

         li.append(ul);
         li.append(addButton);
 //     }
   }

   /////////////////////////////////////////////
   // If input is select type
   /////////////////////////////////////////////
   else if( template["type"] == "select")
   {
      var select = genMenu(key, key, template["options"], false);
      //console.log(template["options"]);
      //select.setAttribute("title",key);

      for( var value in template["options"])
      {
         if( item == template["options"][value])
         {
            select['dropdown'].val(item);
         }
      }

      //li.innerHTML = key;
      li.append(select['div']);
   }

   /////////////////////////////////////////////
   // If all else fails, use normal text input
   /////////////////////////////////////////////
   else
   {
      //Normal processing
      var value;

      if( isObject(item))
         value = item[key];
      else
         value = item;
      //var input = document.createElement("input");
      var input = genTextField(key, key, false, value, value, template['edit']);

//      input.setAttribute("type","text");
//      input.setAttribute("name",key);
//      input.setAttribute("title",key);

      //check if readonly
//      if( template["edit"] == false)
//      {
//         input.setAttribute("readonly",true);
//         input.setAttribute("disable",true);
//      }

//      li.setAttribute("title",key);
//      li.innerHTML=key;
      li.append(input);
   }
   
   return li;
}
   
/************************************************************
 * genArray
 ************************************************************/
function genArray( template )
{
   var item = {};

   //Loop through template and add a field for each item
   for( var key in template)
   {
      if(template[key]["type"] == "array")
         item[key]= [];
      else if( template[key]["type"] == "dictionary")
         item[key]= {};
      else
         item[key]="";
   }

   return item;
 }
   
/************************************************************
 * genDropDownList 
 *
 * Generate a dropdown list for an dictionary passed in
 ************************************************************/
var genSelectInput = function(items, fields) 
{
   var select = document.createElement("select");
   var item="";
   for( var i = 0; i < items.length; i++)
   {
      var option = document.createElement("option");
      option.value = items[i][fields[0]];
      option.text =  items[i][fields[0]];
      select.appendChild(option);
   }
   
   return select;
}

/************************************************************
 * isArray
 ************************************************************/
function isArray( obj )
 {
    return isObject(obj) && (obj instanceof Array);
 }

 /************************************************************
  * isObject 
  ************************************************************/
function isObject( obj )
  {
     return obj && (typeof obj  === "object");
  }



