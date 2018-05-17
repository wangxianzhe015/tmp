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

function getAllApps(){
    $path = "./data/";
    $files = scandir($path);
    $res = [];
    foreach ($files as $f) {
        if ($f != "." && $f != ".." && $f != ".gitignore"){
            array_push($res, $f);
        }
    }

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
        $fileName = "data-" . $time;
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