// ------ T A B L E    O F     C O N T E N T S ----------
class createTableOfContent extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content){          
      createToc({
        content: content,
        tocElement: '.table-of-contents',
        titleElements: [ 'h2.edition-block-title', 'h3.edition-block-title', 'h4.edition-block-title' ]
      });
    }
    
  }

Paged.registerHandlers(createTableOfContent);

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

Paged.registerHandlers(createSubMenu);

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

// ------------------ R A N D O M    P L U S   S C R I P T ----------------

class addPlus extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }
  afterRendered(pages){
  	pages.forEach(page => {
  		// console.log(page);
  		// Ajoute le nombre de plus correspondant au numéro de page positionné aléatoirement sur les interpages
  		if(page.element.classList.contains('pagedjs_blank_page') || page.element.classList.contains('pagedjs_fiche_first_page') || page.element.classList.contains('pagedjs_part-one_first_page') || page.element.classList.contains('pagedjs_part-two_first_page') || page.element.classList.contains('pagedjs_part-three_first_page')){
				var pageNumber = page.position + 1;
				for(var i=0; i<=pageNumber; i++){
					var plus = document.createElement("div");
					plus.innerHTML = '+';
					plus.classList.add("plus");
					var randomX = Math.floor(Math.random()*600);
					var randomY = Math.floor(Math.random()*770);
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
				for(var i=0; i<=4700; i++){
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

let classNotes = "footnote-p"; // ← Change the CLASS of the notes here
let notesFloat = "left"; // ← Change the POSITION of the notes here

class marginNotes extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);

  }

  beforeParsed(content) {

    let notes = content.querySelectorAll("." + classNotes);


    for (let i = 0; i < notes.length; ++i) {

      // Add call notes
      var spanCall = document.createElement("span");
      spanCall.classList.add("note-call");
      spanCall.classList.add("note-call_" + classNotes);
      spanCall.dataset.noteCall = classNotes + '-' + i + 1;
      notes[i].parentNode.insertBefore(spanCall, notes[i]);

      // Add marker notes
      var spanMarker = document.createElement("span");
      spanMarker.classList.add("note-marker");
      spanMarker.classList.add("note-marker_" + classNotes);
      spanMarker.dataset.noteMarker = classNotes + '-' + i + 1;
      notes[i].prepend(spanMarker);


      // Hide notes to avoid rendering problems
      notes[i].style.display = "none";
    }


    /* NOTE FLOAT ---------------------------------------------------------------------------------- */

    let positionRight = 'left: calc(var(--pagedjs-pagebox-width) - var(--pagedjs-margin-left) - var(--pagedjs-margin-right) - 1px); width: var(--pagedjs-margin-right);';
    let positionLeft = 'left: calc(var(--pagedjs-margin-left)*-1 - 1px); width: var(--pagedjs-margin-left);'

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
          let newTop = notePrev.offsetTop + notePrev.offsetHeight - marginNoteTop(notes[a]) + newMargin;
          notes[a].style.top = newTop + "px";
        }
        // alert
        let pageNumber = pageElement.dataset.pageNumber;
        alert("Rendering issue \n ☞ A marginal note overflow on page " + pageNumber + " (this is because there is too many on this page and paged.js can't breaks notes between pages for now.)");
        noteOverflow = true;

      } else {
        console.log("fit");
        /* PUSH DOWN ---------------------------------------------------- */
        for (let i = 0; i < notes.length; ++i) {
          if (i >= 1) {
            let noteTop = notes[i].offsetTop;
            let notePrev = notes[i - 1];
            let newMargin = biggestMargin(notes[i], notePrev);
            let notePrevBottom = notePrev.offsetTop - marginNoteTop(notePrev) + notePrev.offsetHeight + newMargin;
            // Push down the note to bottom if it's over the previous one 
            if (notePrevBottom > noteTop) {
              notes[i].style.top = notePrevBottom + "px";
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
          lastNote.style.top = contentHeight - lastNoteHeight + "px";

          // Push up previous note(s) if if it's over the note
          for (let i = nbrLength; i >= 1; --i) {
            let noteLastTop = notes[i].offsetTop;
            let notePrev = notes[i - 1];
            let notePrevHeight = notePrev.offsetHeight;
            let newMargin = biggestMargin(notePrev, notes[i]);
            let notePrevBottom = notePrev.offsetTop + notePrev.offsetHeight + newMargin;
            if (notePrevBottom > noteLastTop) {
              notePrev.style.top = notes[i].offsetTop - marginNoteTop(notePrev) - notePrevHeight - newMargin + "px";
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





