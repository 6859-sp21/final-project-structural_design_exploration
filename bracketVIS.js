const width = window.innerWidth;
const height = window.innerHeight;

function loopGrid(){

  var index = 0;
  var appendedIndex = 0;
  var tempImg = new Image();

  //if image loads, append image to html doc
  tempImg.onload = function(){
     appendImage();
  }

  tempImg.onerror = function() {
    if (index<634) {
      index = index + 1;
      tryLoadImage(index);
    } else {
      //add carousel Indicators
      for (x = 0; x < Math.floor(appendedIndex/16); x++) {
        var li = document.createElement('li');
        li.setAttribute('data-target', "#myCarousel");
        li.setAttribute('data-slide-to', x.toString());
        if (x == 0) {
          li.className = "active";
        }
        else {}
        document.getElementById("carousel-indicator").appendChild(li);
      }
    }
  };

  //function to attempt to load image via file path and index
  var tryLoadImage = function( index ){
     tempImg.src = 'data/renderings/iso_ver_magdisp/' + index + '_ver_magdisp.png';
  }

  //function to append image
  var appendImage = function() {
    if (appendedIndex % 16 == 0) {
      // create first div
      var div1 = document.createElement('div');

      if (appendedIndex == 0) {
        div1.className = 'item active';
      }
      else {
        div1.className = 'item';
      }

      div1.id = 'item' + Math.floor(appendedIndex/16).toString();
      document.getElementById("carousel-grid").appendChild(div1);

      //create first row
      var div2 = document.createElement('div');
      div2.className = "row";
      div2.id = 'row' + Math.floor(appendedIndex/4).toString();
      document.getElementById('item' + Math.floor(appendedIndex/16).toString()).appendChild(div2);

      //attaches first image to first div
      var div3 = document.createElement('div');
      div3.className = "col-sm-3";
      div3.id = "col" + appendedIndex.toString();
      document.getElementById('row' + Math.floor(appendedIndex/4).toString()).appendChild(div3);

      var img = document.createElement('img');
      img.src = tempImg.src;
      document.getElementById("col" + appendedIndex.toString()).appendChild( img );
    }
    else {
      if (appendedIndex % 4 == 0) {
        //create row
        var div2 = document.createElement('div');
        div2.className = "row";
        div2.id = 'row' + Math.floor(appendedIndex/4).toString();
        document.getElementById('item' + Math.floor(appendedIndex/16).toString()).appendChild(div2);

        //attach image to row
        var div3 = document.createElement('div');
        div3.className = "col-sm-3";
        div3.id = "col" + appendedIndex.toString();
        document.getElementById('row' + Math.floor(appendedIndex/4).toString()).appendChild(div3);

        var img = document.createElement('img');
        img.src = tempImg.src;
        document.getElementById("col" + appendedIndex.toString()).appendChild( img );
      }
      else {
        //attach image
        var div3 = document.createElement('div');
        div3.className = "col-sm-3";
        div3.id = "col" + appendedIndex.toString();
        document.getElementById('row' + Math.floor(appendedIndex/4).toString()).appendChild(div3);

        var img = document.createElement('img');
        img.src = tempImg.src;
        document.getElementById("col" + appendedIndex.toString()).appendChild( img );
      }
    }

    appendedIndex = appendedIndex + 1;
    tryLoadImage( index++ );
  }

  // activation of function attempt to load image
  tryLoadImage( index );
}

loopGrid();
