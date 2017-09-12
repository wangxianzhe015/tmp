<?php

if (isset($_POST['action'])){
    $action = $_POST['action'];
} else {
    $action = 'none';
}

switch ($action) {
    case 'save':
        save();
        break;
    case 'load':
        load();
        break;
    case 'load-file-names':
        loadFileNames();
        break;
    case 'load-callback-names':
        loadCallbackNames();
        break;
    case 'load-callback':
        loadCallback();
        break;
    case 'save-callback':
        saveCallback();
        break;
    case 'load-formations':
        loadFormations();
        break;
    case 'save-formations':
        saveFormations();
        break;
    case 'regex-search':
        regexSearch();
        break;
}

function save(){
    $param = $_POST['elements'];
    $fileName = $_POST['fileName'];
//    $path    = './data';
//    $files = array_diff(scandir($path), array('.', '..'));
//    $fileName = sizeof($files);
//    $myFile = fopen("./data/" . $fileName . ".json", "wr") or die("Unable to open file!");
    $myFile = fopen("./data/".$fileName.".json", "wr") or die("Unable to open file!");
    fwrite($myFile, $param);
    fclose($myFile);

    echo "Save completed";
}

function loadFileNames() {
    $path = "./data/";
    $files = scandir($path);

    echo json_encode($files);
}

function load() {
    $fileName = $_POST['fileName'];
    $myFile = fopen("./data/".$fileName.".json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/".$fileName.".json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }

}

function loadCallbackNames() {
    $path = "./callback/";
    $files = scandir($path);

    echo json_encode($files);
}

function saveCallback(){
    $content = $_POST['callback'];
    $fileName = $_POST['name'];
    $myFile = fopen("./callback/".$fileName.".txt", "wr") or die("Unable to open file!");
    fwrite($myFile, $content);
    fclose($myFile);

    echo "Callback Saved";
}

function loadCallback() {
    $fileName = $_POST['name'];
    $myFile = fopen("./callback/".$fileName.".txt", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./callback/".$fileName.".txt"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }

}

function loadFormations(){
    $myFile = fopen("./cluster/formation.json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./cluster/formation.json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }
}

function saveFormations(){
    $data = $_POST['data'];
    $myFile = fopen("./cluster/formation.json", "wr") or die("Unable to open file!");
    if ($myFile) {
        fwrite($myFile, $data);
        fclose($myFile);
        echo "Formation Saved";
    } else {
        echo 'fail';
    }
}

function regexSearch(){
    $text = $_POST['text'];
    $myFile = fopen("./places-temp.csv", "r") or die("Unable to open file!");
    if ($myFile){
        $result = [];
        while(! feof($myFile))
        {
            $line = fgets($myFile). "<br />";
            $temp = explode(",", $line);
            $head = $temp[1];
            if (stripos($head, $text) !== false){
                array_push($result, ['head'=>$head,'tag'=>$temp[3]]);
            }
        }
        fclose($myFile);
        echo json_encode($result);
    } else {
        echo "fail";
    }
}