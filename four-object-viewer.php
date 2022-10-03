<?php
/**
* Plugin Name: Four Object Viewer
* Plugin URI: https://3ov.xyz/
* Description: A plugin for viewing 3D files with support for WebXR and Open Metaverse Interoperability GLTF Extensions.
* Version: 0.6.3
* Requires at least: 5.7
* Requires PHP:      7.1.0
* Author:            antpb
* Author URI:        https://antpb.com
* License:           GPL v2 or later
* License URI:       https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain:       four-object-viewer
* Domain Path:       /languages
*/

// Include three-object-block
// Include portal
include_once dirname( __FILE__ ) . '/blocks/four-portal-block/init.php';

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
include_once dirname( __FILE__ ) . '/admin/four-object-viewer-settings/init.php';
