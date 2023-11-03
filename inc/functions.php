<?php 
/** Functions **/

/**
* Registers JavaScript and CSS for threeobjectloaderinit
* @uses "wp_enqueue_script" action
*/
function threecustomblock_register_threeobjectloaderinit() {
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
function threecustomblock_enqueue_threeobjectloaderinit() {
    $handle = 'threeobjectloaderinit';
    wp_enqueue_script(
        'threeobjectloaderinit',
    );
    wp_enqueue_style(
        'threeobjectloaderinit'
    );
}

// enqueue javascript on the post frontend. file in the same directory ./three-mirror-block-front.js
add_action( 'enqueue_block_assets', function () {
    wp_enqueue_script(
        'three-custom-block',
        plugins_url( '../build/assets/js/blocks.frontend.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor' )
    );
});

add_filter( 'three-object-environment-inner-allowed-blocks', __NAMESPACE__ . '\custom_plugin_allow_inner', 10, 4);

function custom_plugin_allow_inner( $allowed_blocks ) {
    $new_blocks[] = 'three-object-viewer/three-custom-block';
    $allowed_blocks = array_merge($allowed_blocks, $new_blocks );
   return $allowed_blocks;
}

