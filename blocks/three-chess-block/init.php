<?php

/**
 * Register block
 */
add_action('init', function () {
        register_block_type_from_metadata(__DIR__);
});

add_action( 'enqueue_block_assets', function () {
    wp_enqueue_script(
        'three-chess-block-front',
        plugins_url( '../../build/assets/js/blocks.three-chess-block.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor' )
    );
});

