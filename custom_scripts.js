class addPlus extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  afterRendered(pages){
  	pages.forEach(page => {
  		// console.log(page);
  		// Ajoute le nombre de plus correspondant au numéro de page positionné aléatoirement sur les interpages
  		if(page.element.classList.contains('pagedjs_blank_page')){
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

