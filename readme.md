
##Selo 


Selo is a trigger of  the  custom selection text  **end** event fire. [see](https://developer.mozilla.org/en-US/docs/Web/Events/selectionchange) 

####İnstall

    npm i selo -S

##Set properties & Use

    <script src="selopath/selo.min.js"></script>
    //or
	var Selo = require('selo');
    //or
	import Selo from 'require'
	
    var el = document.getElementById('selsection');
    
    var Selo = new Selo({
	    el:el, // if you don't set el properties this properties set as body by Selo
    	log:false, // if you don't want to see log you can pass log:true
    });

	document.addEventListener('selectionEnd',function () {
		//Do this
	})

	document.addEventListener('selectionStart',function () {
		//Do this
	})

	document.addEventListener('selectionBeforeStart',function () {
		//Do this
	})
