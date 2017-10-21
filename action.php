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
    case 'save-people':
        savePeople();
        break;
    case 'load-people':
        loadPeople();
        break;
    case 'array-from-people-list':
        getArrayFromPeopleList();
        break;
}

function save(){
    $param = $_POST['elements'];
    $fileName = $_POST['fileName'];
//    $path    = './data';
//    $files = array_diff(scandir($path), array('.', '..'));
//    $fileName = sizeof($files);
//    $myFile = fopen("./data/" . $fileName . ".json", "wr") or die("Unable to open file!");
    $myFile = fopen("./data/canvas/".$fileName.".json", "wr") or die("Unable to open file!");
    fwrite($myFile, $param);
    fclose($myFile);

    echo "Save completed";
}

function loadFileNames() {
    $path = "./data/canvas/";
    $files = scandir($path);

    echo json_encode($files);
}

function load() {
    $fileName = $_POST['fileName'];
    $myFile = fopen("./data/canvas/".$fileName.".json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/canvas/".$fileName.".json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }

}

function loadCallbackNames() {
    $path = "./data/callback/";
    $files = scandir($path);

    echo json_encode($files);
}

function saveCallback(){
    $content = $_POST['callback'];
    $fileName = $_POST['name'];
    $myFile = fopen("./data/callback/".$fileName.".txt", "wr") or die("Unable to open file!");
    fwrite($myFile, $content);
    fclose($myFile);

    echo "Callback Saved";
}

function loadCallback() {
    $fileName = $_POST['name'];
    $myFile = fopen("./data/callback/".$fileName.".txt", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/callback/".$fileName.".txt"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }

}

function loadFormations(){
    $myFile = fopen("./data/cluster/formation.json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/cluster/formation.json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }
}

function saveFormations(){
    $data = $_POST['data'];
    $myFile = fopen("./data/cluster/formation.json", "wr") or die("Unable to open file!");
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

function loadPeople(){
    $myFile = fopen("./data/people/data.json", "r") or die("Unable to open file!");
    if ($myFile) {
        if (filesize("./data/people/data.json") > 0) {
            $content = fread($myFile, filesize("./data/people/data.json"));
            fclose($myFile);
        } else {
            $content = "";
        }
        echo $content;
    } else {
        echo "fail";
    }
}

function savePeople(){
    $data = trim($_POST['data']);
    $myFile = fopen("./data/people/data.json", "wr") or die("Unable to open file!");
    if ($myFile) {
        $result = array();
        foreach(preg_split("/((\r?\n)|(\r\n?))/", $data) as $line){
            $pattern = '/[a-z0-9_\-\+]+@[a-z0-9\-]+\.([a-z]{2,3})(?:\.[a-z]{2})?/i';
            preg_match($pattern, $line, $matches);
            $mail = $matches[0];
            $tmp1 = str_replace($mail, "", $line);
            $pattern = '/\s*@[a-zA-Z0-9]+/i';
            preg_match($pattern, $tmp1, $matches);
            $slack = $matches[0];
            $name = str_replace($slack, "", $tmp1);
            array_push($result, [$mail, trim($name), trim($slack)]);
        }

        fwrite($myFile, json_encode($result));
        fclose($myFile);
        echo "People Saved";
    } else {
        echo 'fail';
    }
}
