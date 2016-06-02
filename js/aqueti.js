/************************************************************
 * aqueti.js
 *
 * Interface function for aqueti web services
 *************************************************************/
"use strict";

//Global variables
var socket = null; 
//var io=require('../socket.io');



/************************************************************
 * Initialization function that establishes connection when run
 ************************************************************/
var Init; (Init = function Init () {
      //Establish socket connection 
      socket = io.connect('http//192.168.2.140:8080');
      $(window).on('beforeunload', function(){
         socket.close();
      });
/*
      socket.on('data', function(data)
      {
         alert("Socket on!");
         console.log("data received");
      });
*/
})()

/************************************************************
 * listCollections
 *
 * under development
 ************************************************************/
function listCollections()
{
   //Query collection names
   var collNames = ['c1','c2'];
   var collList = generateUL(collNames );

   //Generate array
   var listContainer= document.createElement("div")
   document.getElementsByTagName("body")[0].appendChild(listContainer);
   
   listContainer.appendChild( collList );
};

/************************************************************
 * function to get a list of images
 *
 * This function gets a list of images from the database
 ************************************************************/
function genImageList( id )
{
   var query = {};
//   query["version"] ={};
//   query["version"]["$gt"]="1";
   var sort ={};

   var listElement = document.getElementById(id);
   
   //Set up processing function for callback to be called when imagelist data is receieved
   var callback = {
      args:{"listElement":listElement, "fields":["test1","test2"]},
      process: function(data, args){
         alert('Made process');
         var items=data.length;
         for( var i = 0; i<items; ++i)
         {
           
            var listItem = document.createElement("li");

            var item="test";
            alert(item);
            //Generate components
            var link = "<a href=\"mosaic.disp.duke.edu:/"+data[i]["outputFiles"]["krpano"]+"/index.html\"></a>";
            var div = "<div class=\"title\">"+data[i]["title"]+"</div>";
            var img = "<img src=\"http://mosaic.disp.duke.edu/"+data[i]["outputFiles"]["krpano"]+"/preview.jpg\">";

            var item = "<img src=\"http://mosaic.disp.duke.edu/\""+data[i]["outputFiles"]["krpano"]+"/preview.jpg\" data-img=\"http://mosaic.disp.duke.edu/"+data[i]["outputFiles"]["krpano"]+"/preview.jpg\"><div><h2>"+data[i]["title"]+"</h2><p>"+data[i]["description"]+"</p></div></li>";

            alert("item:"+item);

            listItem.innerHTML = item;
            listElement.appendChild(listItem);
         }
      }
   };

   //Initial call to get data
   getData(query, sort, callback );
};

/************************************************************
 * generateUL
 ************************************************************/
function generateUL(id, query, sort, fields)
{
   //Find container element in html
   var listElement = document.getElementById(id);

   //Establish listen function to process results
   socket.on('data', function(data)
   {
      if(data.error)
      {
         alert("Data transmission error!");
      }
      else
      {
         var items=data.length;
         for( var i = 0; i<items; ++i)
         {
            var listItem = document.createElement("li");
            listItem.innerHTML = JSON.stringify(data[i]['title']);
            listElement.appendChild(listItem);
         }
      }
   });

   //Everything is ready. Emit data request. Call back should take results.
   socket.emit("getData", {"query":query, "sort":sort});
}

/************************************************************
 * getData object
 *
 * intputs
 ************************************************************/
var getData = function (query, sort, callback){
   //Establish listen function to process results
   socket.on('data', function(data)
   {
      if(data.error)
      {
         alert("Data transmission error!");
      }
      else
      {
         alert("calling callback");
         callback.process(data,callback.args);
      }
   });

   //Everything is ready. Emit data request. Call back should take results.
   socket.emit("getData", {"query":query, "sort":sort});

};
