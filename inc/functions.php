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
        'three-chess-block',
        plugins_url( '../build/assets/js/blocks.frontend.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor' )
    );
	// localize the path of the build folder
	wp_localize_script(
		'three-chess-block',
		'threeCustomBlock',
		array(
			'pluginDirPath' => plugins_url( '', __FILE__ ),
		)
	);
});

add_filter( 'three-object-environment-inner-allowed-blocks', __NAMESPACE__ . '\custom_plugin_allow_inner', 10, 4);

function custom_plugin_allow_inner( $allowed_blocks ) {
    $new_blocks[] = 'three-object-viewer/three-chess-block';
    $allowed_blocks = array_merge($allowed_blocks, $new_blocks );
   return $allowed_blocks;
}

// Register a new REST API route.
add_action( 'rest_api_init', function () {
	register_rest_route( 'myplugin/v1', '/chess-move', array(
	  'methods' => 'POST',
	  'callback' => 'handle_chess_move_request',
	  'permission_callback' => '__return_true', // This allows any authenticated user to access the endpoint. Adjust as necessary for security.
	) );
  } );
  
  // Handle the POST request to the custom endpoint.
  function handle_chess_move_request( WP_REST_Request $request ) {
	$openai_api_key = get_option('openai_api_key');
    if (empty($openai_api_key)) {
        return new WP_REST_Response('OpenAI API key is not set in the plugin settings.', 401);
    }
  
	$data = json_decode($request->get_body(), true);
	$currentMove = $data['currentMove'] ?? '';
	$gameHistory = $data['movesHistory'] ?? [];
	$availableMoves = $data['availableMoves'] ?? [];
	
	$messages = [
		[
		  'role' => 'system',
		  'content' => "We are playing a game of chess in the metaverse. You are playing as Black. Respond only with your data in raw json string format including moveTo and gameStatus data objects where gameStatus is your current thoughts on the match. Your message is broadcasted back to me so be playful but don't give away all of your plans. Do feel free to coach me and comment on my moves. The current game state is as follows: " . json_encode($gameHistory) . ". Your only available moves are: " . json_encode($availableMoves) . ". RESPOND ONLY IN JSON with moveTo and gameStatus DO NOT USE CODE BLOCKS IN YOUR RESPONSES."
		],
		[
		  'role' => 'user',
		  'content' => "It's your turn. Please make the next move for Black."
		]
	  ];

	// Here you'd put together the data you want to send to the OpenAI API.
	$postData = [
	  'model' => "gpt-4-vision-preview",
	  'messages' => $messages,
	  'temperature' => 0.5,
	  'max_tokens' => 150
	];
  
	$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
	  'headers' => [
		'Authorization' => 'Bearer ' . $openai_api_key,
		'Content-Type' => 'application/json'
	  ],
	  'body' => json_encode($postData),
	  'data_format' => 'body',
	]);
  
	if (is_wp_error($response)) {
	  return new WP_REST_Response($response->get_error_message(), $response->get_error_code());
	}
  
	$body = wp_remote_retrieve_body( $response );
	$gptData = json_decode($body, true);
	
	if (isset($gptData['choices'][0]['message']['content'])) {
	  $suggestedMove = trim($gptData['choices'][0]['message']['content']);
	} else {
	  $suggestedMove = "No move suggested.";
	}
  
	$wittyComment = "Let's make a strategic move."; // This could be dynamic based on the response
  
	$responseBody = [
	  'wittyComment' => $wittyComment,
	  'suggestedMove' => $suggestedMove
	];
  
	return new WP_REST_Response($responseBody, 200);
  }
  

  // Add menu item for settings page
add_action('admin_menu', 'register_my_custom_menu_page');
function register_my_custom_menu_page(){
    add_options_page('OpenAI Settings', 'OpenAI Settings', 'manage_options', 'openai-settings', 'openai_settings_page');
}

// Display the settings page content
function openai_settings_page(){
    ?>
    <div class="wrap">
        <h1>OpenAI Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields('openai-settings-group'); ?>
            <?php do_settings_sections('openai-settings-group'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">OpenAI API Key</th>
                    <td><input type="text" name="openai_api_key" value="<?php echo esc_attr(get_option('openai_api_key')); ?>" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Register settings
add_action('admin_init', 'register_my_custom_settings');
function register_my_custom_settings() {
    register_setting('openai-settings-group', 'openai_api_key');
}