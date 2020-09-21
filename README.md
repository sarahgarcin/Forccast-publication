# Liste des détails / particularités pour la mise en page avec pagedjs

--> beaucoup d'exemple ici: https://gitlab.pagedmedia.org/tools/experiments

## Ligne de base
--> https://gitlab.pagedmedia.org/tools/experiments/tree/master/baseline
https://github.com/daneden/Baseline.js
http://stephanecurzi.me/baselinecss.2009/
https://bohemianalps.com/tools/grid/
*tips* : pour afficher la ligne de grille, configurer et ajouter ce css dans le fichier preview_styles.css
<pre>
.pagedjs_pagebox {
        --pagedjs-baseline: 11px;
        --pagedjs-baseline-position: -4px;
        --pagedjs-baseline-color: cyan;
        background: linear-gradient(var(--color-paper) 0%, var(--color-paper) calc(var(--pagedjs-baseline) - 1px), var(--pagedjs-baseline-color) calc(var(--pagedjs-baseline) - 1px), var(--pagedjs-baseline-color) var(--pagedjs-baseline)), transparent;
        background-size: 100% var(--pagedjs-baseline);
        background-repeat: repeat-y;
        background-position-y: var(--pagedjs-baseline-position);
    }
</pre>

## Orphelines
??

## Césure
--> https://gitlab.pagedmedia.org/tools/experiments/tree/master/hyphens

## Espaces insécables
--> smartypants: https://daringfireball.net/projects/smartypants/

## Notes dans la marges 
--> voir le fichier margin-notes.js

## Titre courant 
- https://www.pagedjs.org/documentation/07-generated-content-in-margin-boxes/#named-string-classical-running-headersfooters
- https://www.pagedjs.org/documentation/07-generated-content-in-margin-boxes/#running-elements-headersfooter-with-specific-complex-content

## Cibler une page en particulier
Utile pour les background 
page référence: https://www.pagedmedia.org/pagedjs-sneak-peeks/

```
<section class="part">
    <h1>Awesome part</h1>
    <p>In this part, we'll talk about a lot of different things</p>
</section>
```

```
section.part {
    page: part;
}
```


```
@page part {
    background-color: lightcyan;
    
    @top-right-corner {
         content: none;
    }
    @top-right {
        content: none;
    }
    @top-left-corner {
         content: none;
    }
    @top-left {
        content: none;
    }
}
```

## faire commencer une page sur la page de droite
.chapter {
  break-before: right;
}









