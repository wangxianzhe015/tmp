<?php

if (isset($_POST['action'])) {
    $action = $_POST['action'];
} else {
    $action = "none";
}

switch ($action){
    case "get-all-apps":
        getAllApps();
        break;
    case "get-app":
        getApp();
        break;
    case "save-app":
        saveApp();
        break;
    case "rename-app":
        renameApp();
        break;
    default:
        break;
}

if (isset($_FILES["file"])){
    $f = $_FILES["file"];
    $file = $f["name"];

    $target_dir = "upload/";
    $target_file = $target_dir . basename($file) . "---" . time();
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

//    if(isset($_POST["submit"])) {
//        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
//        if($check !== false) {
//            echo "File is an image - " . $check["mime"] . ".";
//            $uploadOk = 1;
//        } else {
//            echo "File is not an image.";
//            $uploadOk = 0;
//        }
//    }
// Check if file already exists
    if (file_exists($target_file)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }
// Check file size
//    if ($_FILES["fileToUpload"]["size"] > 500000) {
//        echo "Sorry, your file is too large.";
//        $uploadOk = 0;
//    }
// Allow certain file formats
//    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
//        && $imageFileType != "gif" ) {
//        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
//        $uploadOk = 0;
//    }
// Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($f["tmp_name"], $target_file)) {
            echo "The file ". basename( $f["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

function getAllApps(){
    $path = "./data/";
    $files = scandir($path);
    $res = [];
    foreach ($files as $f) {
        if ($f != "." && $f != ".." && $f != ".gitignore"){
            array_push($res, $f);
        }
    }

    sort($res);

    echo json_encode($res);
}

function getApp(){
    $name = $_POST['name'];

    $myFile = fopen("./data/" . $name, "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/" . $name));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }
}

function saveApp(){
    $data = $_POST['data'];
    $time = time();

    if (isset($_POST['name'])){
        $fileName = $_POST['name'];
    } else {
        $fileName = "--" . $time;
    }

    $myFile = fopen("./data/" . $fileName, "wr") or die("fail");
    fwrite($myFile, $data);
    fclose($myFile);

    echo $time;

}

function renameApp(){
    $oldName = $_POST['oldName'];
    $newName = $_POST['newName'];

    rename("./data/" . $oldName, "./data/" . $newName);
}