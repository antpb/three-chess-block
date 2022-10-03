<?php 
/** Functions **/

/**
* Registers JavaScript and CSS for threeobjectloaderinit
* @uses "wp_enqueue_script" action
*/
function fourobjectviewer_register_threeobjectloaderinit() {
    $dependencies = [];
    $version = '0.1.0';

    wp_register_script(
        'threeobjectloaderinit',
        plugins_url("/inc/threeobjectloaderinit/index.js", __DIR__ ),
        $dependencies,
        $version
    );
    wp_register_style(
        'threeobjectloaderinit',
        plugins_url("/inc/threeobjectloaderinit/index.css", __DIR__ ),
        [],
        $version
    );
}

/**
* Enqueue JavaScript and CSS for threeobjectloaderinit
* @uses "wp_enqueue_script" action
*/
function fourobjectviewer_enqueue_threeobjectloaderinit() {
    $handle = 'threeobjectloaderinit';
    wp_enqueue_script(
        'threeobjectloaderinit',
    );
    wp_enqueue_style(
        'threeobjectloaderinit'
    );
}

// add_action('wp_enqueue_scripts', __NAMESPACE__ . '\fourobjectviewer_frontend_assets');

add_filter( 'three-object-environment-frontend-js', __NAMESPACE__ . '\custom_frontend_js', 10, 4);

function custom_frontend_js() {
    $some_frontend_path = "../../four-object-viewer/build/assets/js/blocks.frontend.js";
   return $some_frontend_path;
}



add_filter( 'three-object-environment-inner-allowed-blocks', __NAMESPACE__ . '\custom_plugin_allow_inner', 10, 4);

function custom_plugin_allow_inner( $allowed_blocks ) {
    $new_blocks[] = 'four-object-viewer/four-portal-block';
    $allowed_blocks = array_merge($allowed_blocks, $new_blocks );
   return $allowed_blocks;
}

