<?php 
/** Actions and Filters **/
//Register JavaScript and CSS for threeobjectloaderinit
add_action( 'wp_enqueue_scripts', 'fourobjectviewer_register_threeobjectloaderinit', 5 );

//Enqueue JavaScript and CSS for threeobjectloaderinit
add_action( 'wp_enqueue_scripts', 'fourobjectviewer_enqueue_threeobjectloaderinit', 10 );
