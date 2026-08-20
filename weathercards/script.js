var season =
prompt("Enter season");

var image="";
var temp="";

if(season=="summer"){

image="summer.png";
temp="38°C";

}

else if(season=="winter"){

image="winter.png";
temp="10°C";

}

else if(season=="spring"){

image="spring.jpg";
temp="25°C";

}

else if(season=="autumn"){

image="autumn.png";
temp="20°C";

}

document.write(

"<div class='card'>"+

"<img src='"+image+"'>"+

"<h1>"+season+"</h1>"+

"<h2>"+temp+"</h2>"+

"</div>"

);