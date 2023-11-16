<?php
/**
* Plugin Name: Three Chess Block
* Plugin URI: https://3ov.xyz/
* Description: An example plugin extending 3OV.
* Version: 0.1
* Requires at least: 5.7
* Requires PHP:      7.1.0
* Author:            antpb
* Author URI:        https://3ov.xyz
* License:           GPL v2 or later
* License URI:       https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain:       three-chess-block
* Domain Path:       /languages
*/

// Include three-object-block
// Include portal
include_once dirname( __FILE__ ) . '/blocks/three-chess-block/init.php';

/**
* Include the autoloader
*/
add_action( 'plugins_loaded', function () {
    if ( file_exists(__DIR__ . '/vendor/autoload.php' ) ) {
        include __DIR__ . '/vendor/autoload.php';
    }
}, 1 );

include_once dirname( __FILE__ ). '/inc/functions.php';
include_once dirname( __FILE__ ). '/inc/hooks.php';
