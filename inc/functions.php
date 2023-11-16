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
	$authorization = $request->get_header('Authorization');
	
	if (empty($authorization)) {
	  return new WP_REST_Response('Unauthorized', 401);
	}
  
	$data = json_decode($request->get_body(), true);
	$currentMove = $data['currentMove'] ?? '';
	$gameHistory = $data['movesHistory'] ?? [];
	$availableMoves = $data['availableMoves'] ?? [];
	
	$token = explode(" ", $authorization)[1] ?? '';
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
		'Authorization' => 'Bearer ' . $token,
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
  