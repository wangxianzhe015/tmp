<?php

include_once('inc/simplexlsx.class.php');

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
    case 'save-tagger':
        saveTagger();
        break;
    case 'load-tagger-names':
        loadTaggerNames();
        break;
    case 'load-tagger-app':
        loadTaggerApp();
        break;
    case 'save-accordion':
        saveAccordion();
        break;
    case 'send-email':
        sendEmail();
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
    $xlsx = new SimpleXLSX('./data/places/data.xlsx');

    $result = [];
    try {
        foreach ($xlsx->rows() as $row) {
            $head = $row[0];
            $head2 = $row[1];
            if (stripos($head, $text) !== false || stripos($head2, $text) !== false) {
                $tag = ""; $hidden = "";
                if (isset($row[3])){
                    $tag = date("d-M-Y", ($row[3] - 25569) * 86400);
                }
                if (isset($row[2])){
                    if ($tag == ""){
                        $tag = $row[2];
                    } else {
                        $tag = $tag . " | " . $row[2];
                    }
                }
                if (isset($row[4])){
                    $extra = $row[4];
                } else {
                    $extra = "";
                }
                if (isset($row[5])){
                    $hidden = $row[5];
                }
                if (isset($row[6])){
                    $hidden = $hidden . " | ". $row[6];
                }
                array_push($result, ['head' => $head, 'tag' => $tag, 'extra' => $extra, 'hidden' => $hidden]);
            }
        }
    } catch (Exception $e) {
        echo $e;
    }
    echo json_encode($result);
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

function saveTagger(){
    $data = json_encode($_POST['data']);
    $name = $_POST['name'];
    $myFile = fopen("./data/tagger/$name", "wr") or die("Unable to open file!");
    if ($myFile) {
        fwrite($myFile, $data);
        fclose($myFile);
        echo "success";
    } else {
        echo 'fail';
    }
}

function loadTaggerNames() {
    $path = "./data/tagger/";
    $files = scandir($path);

    echo json_encode($files);
}

function loadTaggerApp(){
    $name = $_POST['name'];
    $myFile = fopen("./data/tagger/$name", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/tagger/$name"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }
}

function saveAccordion(){
    $data = json_encode($_POST['data']);
    $myFile = fopen("./data/accordion/data.json", "wr") or die("Unable to open file!");
    if ($myFile) {
        fwrite($myFile, $data);
        fclose($myFile);
        echo "success";
    } else {
        echo 'fail';
    }
}

function sendEmail(){
    $data = $_POST['data'];
    $to = $data['to'];
    $date = $data['date'];
    $subject = $data['subject'];
    $bcc = $data['bcc'];
    $content = $data['content'];

    $headers = "From: " . "test@yahoo.com" . "\r\n";
    $headers .= "Reply-To: ". strip_tags("test@yahoo.com") . "\r\n";
    foreach ($bcc as $addr) {
        $headers .= "BCC: $addr\r\n";
    }
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    ini_set("SMTP", "smtp.mail.yahoo.com");
    ini_set("smtp_port", 465);
    ini_set("auth_username", "vipin_misura@yahoo.com");
    ini_set("auth_password", "dreams@paradise23");
    ini_set("force_sender", "vipin_misura@yahoo.com");

    if (mail($to, $subject, $content, $headers)) {
        echo 'success';
    } else {
        echo error_get_last()['message'];;
    }

}