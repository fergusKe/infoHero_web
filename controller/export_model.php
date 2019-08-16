<?php
	require_once('./_config.php');

	// 這裡是要搬到的路徑
	$target_dir = UPLOAD_PATH;
	$output_dir = DOWNLOAD_PATH;
	// 抓取 file type
	$csvFileType = strtolower(pathinfo(basename($_FILES['csv']['name']),PATHINFO_EXTENSION));

	if( $csvFileType != "csv"){
		die('{"status":403,"message":"Only accept csv type file."}');		
	}

	$fileName = $_FILES['csv']['tmp_name'];

	$savePath = $target_dir . $_FILES['csv']['name'];

	if(!move_uploaded_file( $fileName, $savePath) ){
		die('{ "status": 403, "message": "Move ' . $_FILES['csv']['name'] . ' file error!" }');
	}

	$fileWithoutExt = basename($_FILES['csv']['name'], ".csv");

	$message = system('Rscript '. MODEL_FILE_PATH . ' ' . $fileWithoutExt . ' '. MODEL_DIR_PATH);
	$predictedFilePath = $output_dir . $fileWithoutExt . "-predicted.csv";

	echo '{"status": 200, "message": "Sucessful moving!", "file_path": "' . $predictedFilePath . '"}';
?>