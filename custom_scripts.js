// ------ T A B L E    O F     C O N T E N T S ----------
class createTableOfContent extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content){          
      createToc({
        content: content,
        tocElement: '.sommaire',
        titleElements: [ 'h2.edition-block-title', 'h3.edition-block-title', 'h4.edition-block-title' ]
      });
    }
    
  }

//Paged.registerHandlers(createTableOfContent);



// ------ ajout de classe sur les pages blanches  ----------
class blankClass extends Paged.Handler {
  constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
  }

  afterRendered(pages){
    pages.forEach(page => {
      if(page.element.classList.contains("pagedjs_blank_page")){
        if(page.element.nextElementSibling.classList.contains('pagedjs_part-one_page')){
          page.element.classList.add('pagedjs_part-one_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_part-two_page')){
          page.element.classList.add('pagedjs_part-two_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_part-three_page')){
          page.element.classList.add('pagedjs_part-three_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_titrepartiepart-two_page')){
          page.element.classList.add('pagedjs_titrepartiepart-two_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_titrepartiepart-one_page')){
          page.element.classList.add('pagedjs_titrepartiepart-one_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_titrepartiepart-three_page')){
          page.element.classList.add('pagedjs_titrepartiepart-three_page');
        }

        if(page.element.nextElementSibling.classList.contains('pagedjs_fiche_page')){
          page.element.classList.add('pagedjs_fiche_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_fiches_page')){
          page.element.classList.add('pagedjs_fiches_page');
        }
        if(page.element.nextElementSibling.classList.contains('pagedjs_part-noir_page')){
          page.element.classList.add('pagedjs_part-noir_page');
        }


        


        
      }
    });
    // let blanks = parsed.querySelectorAll(".pagedjs_blank_page");
    
    // blanks.forEach(blank => {
    //   console.log(blank);
    //   if(blank.nextElementSibling.classList.contains('.pagedjs_part-two_page')){
    //     blank.classList.add('.pagedjs_part-two_page');
    //   }
    // });
    
  }
}

Paged.registerHandlers(blankClass);

// ------ R A T I O    O F     I M A G E S ----------
class imageRatio extends Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
    }

    afterParsed(parsed) {
        // create an array that will store the images data later on
        let imagePromises = [];
        // find all images parsed by paged.js
        let images = parsed.querySelectorAll("img");
        // for each image  
        images.forEach(image => {
            // load the image as an object
            let img = new Image();
            // test if the image is loaded
            let resolve, reject;
            let imageLoaded = new Promise(function (r, x) {
                resolve = r;
                reject = x;
            });
            // when the image loads
            img.onload = function () {
                // find its height
                let height = img.naturalHeight;
                
                // find its width
                let width = img.naturalWidth;

                // calculate the ratio
                let ratio = width / height;
                var parent =  getParentByTag(image, 'figure');
                // if the ratio is superior than 1.4, set it as a lanscape adn add a class to the image (and to the parent figure)
                if (ratio >= 1.4) {
                    image.classList.add("landscape");
                    
                    parent.classList.add("fig-landscape");
                    // image.parentNode.classList.add("fig-landscape");
                } 
                // if the ratio is inferior than 0.8, set it as a portrait adn add a class to the image (and to the parent figure)

                else if (ratio <= 0.8) {
                    image.classList.add("portrait");
                    parent.classList.add("fig-portrait");
                    // image.parentNode.classList.add("fig-portrait");
                } 
                // else, if it’s between 1.39 and 0.8, add a “square” class.
                else if (ratio < 1.39 || ratio > 0.8) {
                    image.classList.add("square");
                    parent.classList.add("fig-square");
                    // image.parentNode.classList.add("fig-square");
                }
                // resolve the promise
                resolve();
            };
            // if there is an error, reject the promise
            img.onerror = function () {
                reject();
            };

            img.src = image.src;

            imagePromises.push(imageLoaded);
        });
        
        return Promise.all(imagePromises).catch(err => {
            console.warn(err);
        });
    }
} 

function getParentByTag(elem, lookingFor) {
  lookingFor = lookingFor.toUpperCase();
  while (elem = elem.parentNode) if (elem.tagName === lookingFor) return elem;
}


// and we register the handler

Paged.registerHandlers(imageRatio);


// ------ C R E A T E   S U B M E N U   B Y    P A R T   S C R I P T ----------

class createSubMenu extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }  
  beforeParsed(content){
  // Créer un sous-menu automatiquement pour les parties 
    let titresPartie = content.querySelectorAll('.titre-partie');
    var elParent;
    
    titresPartie.forEach(titre => {
      // if(titre.classList.contains('part-two')){
      //   let allH4 = nextUntil(titre.querySelector('.is-level-1'), '.is-level-1');
      //   console.log(allH4);
      //   let indexUl = document.createElement("ul");
      //   indexUl.classList.add("tableofcontents-block-title"); 
      //   allH4.forEach(h4 => {

      //     let indexLi = document.createElement("li");
      //     indexLi.classList.add("list-index-element");
      //     let h3Content = h4.querySelector('h4.edition-block-title');
      //     if(h3Content != null){
      //       indexLi.innerHTML = h3Content.innerHTML;
      //       indexUl.appendChild(indexLi);
      //       elParent = h4.closest(".is-level-2");
      //     }
      //   });
      //   titre.appendChild(indexUl);
      // }
      // else{
        let allH3 = nextUntil(titre, '.titre-partie');
        let indexUl = document.createElement("ul");
        indexUl.classList.add("tableofcontents-block-title"); 
        allH3.forEach(h3 => {
          let indexLi = document.createElement("li");
          indexLi.classList.add("list-index-element");
          let h3Content = h3.querySelector('h3.edition-block-title');
          if(h3Content != null){
            indexLi.innerHTML = h3Content.innerHTML;
            indexUl.appendChild(indexLi);
            elParent = h3.closest(".is-level-1");
          }
        });
        titre.appendChild(indexUl);

      // }

    });


  // Créer un sous-menu automatiquement pour les sous-parties
    let sections = content.querySelectorAll('.is-level-1');
    var elSubParent;
    
    sections.forEach(section => {
      // console.log(section);
      let allH4 = nextUntil(section, '.is-level-1');
      let indexSubUl = document.createElement("ul");
      indexSubUl.classList.add("tableofcontents-block-title"); 
      allH4.forEach(h4 => {
        let indexLi = document.createElement("li");
        indexLi.classList.add("list-index-element");
        let h4Content = h4.querySelector('h4.edition-block-title');
        if(h4Content != null){
          indexLi.innerHTML = h4Content.innerHTML;
          indexSubUl.appendChild(indexLi);
          elSubParent = h4.closest(".is-level-2");
        }
      });
      ;
      insertAfter(section.querySelector('h3.edition-block-title'), indexSubUl);
    });
  }

}

// Paged.registerHandlers(createSubMenu);

// FONCTIONS
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/*!
 * Get all following siblings of each element up to but not including the element matched by the selector
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   elem     The element
 * @param  {String} selector The selector to stop at
 * @param  {String} filter   The selector to match siblings against [optional]
 * @return {Array}           The siblings
 */
var nextUntil = function (elem, selector, filter) {

  // Setup siblings array
  var siblings = [];

  // Get the next sibling element
  elem = elem.nextElementSibling;

  // As long as a sibling exists
  while (elem) {

    // If we've reached our match, bail
    if (elem.matches(selector)) break;

    // If filtering by a selector, check if the sibling matches
    if (filter && !elem.matches(filter)) {
      elem = elem.nextElementSibling;
      continue;
    }

    // Otherwise, push it to the siblings array
    siblings.push(elem);

    // Get the next sibling element
    elem = elem.nextElementSibling;

  }

  return siblings;

};

var getPreviousSibling = function (elem, selector) {

  // Get the next sibling element
  var sibling = elem.previousElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }

};

var getNextSibling = function (elem, selector) {

  // Get the next sibling element
  var sibling = elem.nextElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling
  }

};

// ------------------ T R A M E    P L U S   S C R I P T ----------------
class tramePlus extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }
  afterRendered(pages){
    pages.forEach(page => {
      // Crée une trame de plus sur les interpages au début et à la fin 
      if(page.element.classList.contains('pagedjs_trameplus_page')){
        var plusContainer = document.createElement("div");
        plusContainer.classList.add("plus-trame-container");
        page.element.appendChild(plusContainer);
        for(var i=0; i<=160; i++){
          var random = Math.floor(Math.random()*2);
          var randomRotation = Math.floor(Math.random()*8);
          var plus = document.createElement("div");
          if(random == 1){
            plus.innerHTML = '+';
            plus.classList.add("plus-trame");
            if(randomRotation == 1){
              var randomAngle = Math.floor(Math.random()*360);
              plus.style.transform = 'rotate('+randomAngle+'deg)';
            }
          }
          else{
            plus.classList.add("empty-trame");
          }
          
          plusContainer.appendChild(plus);
          
        }
      }
    });
  }
} 

Paged.registerHandlers(tramePlus); 

// ------------------ R A N D O M    P L U S   S C R I P T ----------------

class addPlus extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }
  afterRendered(pages){
  	pages.forEach(page => {
  		// console.log(page);
  		// Ajoute le nombre de plus correspondant au numéro de page positionné aléatoirement sur les interpages
  		if(page.element.classList.contains('pagedjs_blank_page') || page.element.classList.contains('pagedjs_titrepartiepart-one_page') || page.element.classList.contains('pagedjs_titrepartiepart-two_page') || page.element.classList.contains('pagedjs_titrepartiepart-three_page') || page.element.classList.contains('pagedjs_fiche_first_page') || page.element.classList.contains('pagedjs_fiches_first_page')|| page.element.classList.contains('pagedjs_part-one_first_page') || page.element.classList.contains('pagedjs_part-two_first_page') || page.element.classList.contains('pagedjs_part-three_first_page')){
				var pageNumber = page.position + 1;
				for(var i=0; i<=pageNumber; i++){
					var plus = document.createElement("div");
					plus.innerHTML = '+';
					plus.classList.add("plus");
					var randomX = Math.floor(Math.random()*600);
					var randomY = Math.floor(Math.random()*750);
					plus.style.top = randomY + "px";
					plus.style.left = randomX + "px";
					page.element.appendChild(plus);

				}
			}
			// Crée une trame de plus derriere les tutoriels
			// console.log(page.element.className);
			if(page.element.classList.contains('pagedjs_tutoriel_page')){
				var plusContainer = document.createElement("div");
				plusContainer.classList.add("plus-tutoriel-container");
				page.element.appendChild(plusContainer);
				console.log(plusContainer);
				for(var i=0; i<=4619; i++){
					var plus = document.createElement("div");
					plus.innerHTML = '+';
					plus.classList.add("plus-tutoriel");
					plusContainer.appendChild(plus);
				}
			}
  	});
  }
}  



Paged.registerHandlers(addPlus);


// -------------- M A R G I N     N O T E S      S C R I P T -----------------

let classNotes = "footnote"; // ← Change the CLASS of the notes here
let notesFloat = "left"; // ← Change the POSITION of the notes here

class marginNotes extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);

  }

  beforeParsed(content) {

    let notes = content.querySelectorAll("." + classNotes);


    // for (let i = 0; i < notes.length; ++i) {

    //   // Add call notes
    //   var spanCall = document.createElement("span");
    //   spanCall.classList.add("note-call");
    //   spanCall.classList.add("note-call_" + classNotes);
    //   spanCall.dataset.noteCall = classNotes + '-' + i + 1;
    //   notes[i].parentNode.insertBefore(spanCall, notes[i]);

    //   // Add marker notes
    //   var spanMarker = document.createElement("span");
    //   spanMarker.classList.add("note-marker");
    //   spanMarker.classList.add("note-marker_" + classNotes);
    //   spanMarker.dataset.noteMarker = classNotes + '-' + i + 1;
    //   notes[i].prepend(spanMarker);


    //   // Hide notes to avoid rendering problems
    //   notes[i].style.display = "none";
    // }


    /* NOTE FLOAT ---------------------------------------------------------------------------------- */

    let positionRight = 'left: calc(var(--pagedjs-pagebox-width) - var(--pagedjs-margin-left) - var(--pagedjs-margin-right) - 1px); width: var(--pagedjs-margin-right);';
    let positionLeft = 'left: calc(var(--pagedjs-margin-left)*-1 + 4px); width: calc(var(--pagedjs-margin-left) - 4px);'

    let notePosition;

    switch (notesFloat) {
      case 'inside':
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionRight + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionLeft + '}';
        break;
      case 'left':
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionLeft + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionLeft + '}';
        break;
      case 'right':
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionRight + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionRight + '}';
        break;
      default:
        notePosition = '.pagedjs_left_page .' + classNotes + '{' + positionLeft + '} \
          .pagedjs_right_page .' + classNotes + '{' + positionRight + '}';
    }


    /* SPECIFIC CSS ---------------------------------------------------------------------------------- */

    addcss('\
      body {\
        counter-reset: callNote_' + toCamelClassNote(classNotes) + ' markerNote_' + toCamelClassNote(classNotes) + ';\
      }\
      \
      .' + classNotes + '{\
          position: absolute;\
          text-align-last: initial;\
          box-sizing: border-box;\
      }\
      \
      .note-call_' + classNotes + ' {\
        counter-increment: callNote_' + toCamelClassNote(classNotes) + ';\
      }\
      \
      .note-call_' + classNotes + '::after {\
        content: counter(callNote_' + toCamelClassNote(classNotes) + ');\
      }\
      \
      .note-marker_' + classNotes + ' {\
          counter-increment: markerNote_' + toCamelClassNote(classNotes) + ';\
      }\
      .note-marker_' + classNotes + '::before {\
        content: counter(markerNote_' + toCamelClassNote(classNotes) + ') ". ";\
      }\
    ' + notePosition);


  } /* end beforeParsed*/


  afterPageLayout(pageElement, page, breakToken) {
    let notes = pageElement.querySelectorAll("." + classNotes);
    let noteOverflow = false;

    let notesHeightAll = [];

    if (typeof (notes) != 'undefined' && notes != null && notes.length != 0) {

      for (let n = 0; n < notes.length; ++n) {
        // Display notes of the page 
        notes[n].style.display = "inline-block";
        // Add height of the notes to array notesHeightAll 
        let noteHeight = notes[n].offsetHeight;
        notesHeightAll.push(noteHeight);
        // Add margins of the notes to array notesHeightAll 
        if (n >= 1) {
          let margins = biggestMargin(notes[n - 1], notes[n]);
          notesHeightAll.push(margins);
        }
      }


      /* FIT PAGE ------------------------------------------------------------------------------------- */

      // Calculate if all notes fit on the page;
      let reducer = (accumulator, currentValue) => accumulator + currentValue;
      let allHeight = notesHeightAll.reduce(reducer);
      let maxHeight = pageElement.querySelectorAll(".pagedjs_page_content")[0].offsetHeight;

      if (allHeight > maxHeight) {
        console.log("doesn't fit");

        /* IF DOESN'T FIT ----------------------------------------------------------------------------- */

        // positions all the notes one after the other starting from the top
        notes[0].style.top = parseInt(window.getComputedStyle(notes[0]).marginBottom, 10) * -1 + "px";
        for (let a = 1; a < notes.length; ++a) {
          let notePrev = notes[a - 1];
          let newMargin = biggestMargin(notePrev, notes[a]);
          let newTop = notePrev.offsetTop + notePrev.offsetHeight - marginNoteTop(notes[a]) + newMargin + 5 ;
          notes[a].style.top = newTop + "px";
        }
        // alert
        let pageNumber = pageElement.dataset.pageNumber;
        // alert("Rendering issue \n ☞ A marginal note overflow on page " + pageNumber + " (this is because there is too many on this page and paged.js can't breaks notes between pages for now.)");
        noteOverflow = true;

      } else {
        console.log("fit");
        /* PUSH DOWN ---------------------------------------------------- */
        for (let i = 0; i < notes.length; ++i) {
          if (i >= 1) {
            let noteTop = notes[i].offsetTop;
            let notePrev = notes[i - 1];
            let newMargin = biggestMargin(notes[i], notePrev);
            let notePrevBottom = notePrev.offsetTop - marginNoteTop(notePrev) + notePrev.offsetHeight + newMargin + 5;
            // Push down the note to bottom if it's over the previous one 
            if (notePrevBottom > noteTop) {
              console.log("overflow");
              notes[i].style.top = notePrevBottom +  "px";
            }
          }
        }

        /* PUSH UP ---------------------------------------------- */

        // Height of the page content 
        let contentHeight = pageElement.querySelectorAll(".pagedjs_page_content")[0].querySelectorAll("div")[0].offsetHeight;

        // Check if last note overflow 
        let nbrLength = notes.length - 1;
        let lastNote = notes[nbrLength];
        let lastNoteHeight = lastNote.offsetHeight + marginNoteTop(lastNote);
        let noteBottom = lastNote.offsetTop + lastNoteHeight;

        if (noteBottom > contentHeight) {

          // Push up the last note 
          lastNote.style.top = contentHeight - lastNoteHeight - 13 + "px";

          // Push up previous note(s) if if it's over the note
          for (let i = nbrLength; i >= 1; --i) {
            let noteLastTop = notes[i].offsetTop;
            let notePrev = notes[i - 1];
            let notePrevHeight = notePrev.offsetHeight;
            let newMargin = biggestMargin(notePrev, notes[i]);
            let notePrevBottom = notePrev.offsetTop + notePrev.offsetHeight + newMargin + 13;
            if (notePrevBottom > noteLastTop) {
              notePrev.style.top = notes[i].offsetTop - marginNoteTop(notePrev) - notePrevHeight - newMargin - 17 + "px";
            }
          }

        } /* end push up */

      }

    }
  }/* end afterPageLayout*/

}

 Paged.registerHandlers(marginNotes);



/* FUNCTIONS -------------------------------------------------------------------------------------- 
--------------------------------------------------------------------------------------------------- */

// MARGINS

function marginNoteTop(elem) {
  let marginTop = parseInt(window.getComputedStyle(elem).marginTop, 10)
  return marginTop;
}

function marginNoteBottom(elem) {
  let marginBottom = parseInt(window.getComputedStyle(elem).marginBottom, 10)
  return marginBottom;
}

function biggestMargin(a, b) {
  let margin;
  let marginBottom = marginNoteBottom(a);
  let marginTop = marginNoteTop(b);
  if (marginBottom > marginTop) {
    margin = marginBottom;
  } else {
    margin = marginTop;
  }
  return margin;
}


// ADD CSS

function addcss(css) {
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  if (s.styleSheet) {   // IE
    s.styleSheet.cssText = css;
  } else {// the world
    s.appendChild(document.createTextNode(css));
  }
  head.appendChild(s);
}


// CAMEL CLASS NOTE

function toCamelClassNote(elem) {
  let splitClass = elem.split("-");
  if (splitClass.length > 1) {
    for (let s = 1; s < splitClass.length; ++s) {
      let strCapilize = splitClass[s].charAt(0).toUpperCase() + splitClass[s].slice(1)
      splitClass[s] = strCapilize;
    }
  }
  let reducer = (accumulator, currentValue) => accumulator + currentValue;
  let classCamel = splitClass.reduce(reducer);
  return classCamel;
}


// TABLE OF CONTENTS
function createToc(config){
    const content = config.content;
    const tocElement = config.tocElement;
    const titleElements = config.titleElements;

    let tocElementDiv = content.querySelector(tocElement);
    let tocUl = document.createElement("ul");
    tocUl.id = "list-toc-generated";
    tocElementDiv.appendChild(tocUl);

    // add class to all title elements
    let tocElementNbr = 0;
    for(var i= 0; i < titleElements.length; i++){

        let titleHierarchy = i + 1;
        let titleElement = content.querySelectorAll(titleElements[i]);


        titleElement.forEach(function(element) {

            // add classes to the element
            element.classList.add("title-element");
            element.setAttribute("data-title-level", titleHierarchy);

            // add id if doesn't exist
            tocElementNbr++;
            idElement = element.id;
            if(idElement == ''){
                element.id = 'title-element-' + tocElementNbr;
            }
            let newIdElement = element.id;

        });

    }

    // create toc list
    let tocElements = content.querySelectorAll(".title-element");

    for(var i= 0; i < tocElements.length; i++){
        let tocElement = tocElements[i];

        let tocNewLi = document.createElement("li");

        // Add class for the hierarcy of toc
        tocNewLi.classList.add("toc-element");
        tocNewLi.classList.add("toc-element-level-" + tocElement.dataset.titleLevel);

        // Keep class of title elements
        //let classTocElement = tocElement.classList;
        //for(var n= 0; n < classTocElement.length; n++){
        //    if(classTocElement[n] != "title-element"){
        //      tocNewLi.classList.add(classTocElement[n]);
        //    }
       //  }
        let classTocElement = tocElement.classList;
        for(var n= 0; n < classTocElement.length; n++){
           if(classTocElement[n] != "title-element"){
             tocNewLi.classList.add("toc-"+classTocElement[n]);
           }
        }

        // Create the element
        tocNewLi.innerHTML = '<a href="#' + tocElement.id + '">' + tocElement.innerHTML + '</a>';
        tocUl.appendChild(tocNewLi);
    }

}





