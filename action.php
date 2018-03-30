<?php

include_once('inc/simplexlsx.class.php');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
include_once('inc/phpmailer/Exception.php');
include_once('inc/phpmailer/PHPMailer.php');
include_once('inc/phpmailer/SMTP.php');

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
    case 'download-csv':
        downloadCSV();
        break;
    case 'regex-search':
        regexSearch();
        break;
    case 'get-text-from-url':
        getTextFromCSV();
        break;
    case 'get-file-from-url':
        getFileFromCSV();
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
    case 'get-wrapper-words':
        getWrapperWords();
        break;
    case 'set-wrapper-words':
        setWrapperWords();
        break;
    case 'tagger-file-upload':
        uploadTaggerFile();
        break;
    case 'get-tagger-file-names':
        getTaggerFileNames();
        break;
    case 'get-tagger-file':
        getTaggerFile();
        break;
    case 'load-json-from-url':
        loadJSONFromURL();
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

function downloadCSV(){
    $path = $_POST['path'];
    $ip = getUserIP();
    if (fopen($path, 'r')) {
        file_put_contents("./data/places/" . $ip . "-data.csv", fopen($path, 'r'));
        echo "CSV file download success";
    } else {
        echo "CSV file download fail";
    }
}

function regexSearch(){
//    $xlsx = new SimpleXLSX('./data/places/data.xlsx');
//
//    $result = [];
//    try {
//        foreach ($xlsx->rows() as $row) {
//            $head = $row[0];
//            $head2 = $row[1];
//            if (stripos($head, $text) !== false || stripos($head2, $text) !== false) {
//                $tag = ""; $hidden = "";
//                if (isset($row[3])){
//                    $tag = date("d-M-Y", ($row[3] - 25569) * 86400);
//                }
//                if (isset($row[2])){
//                    if ($tag == ""){
//                        $tag = $row[2];
//                    } else {
//                        $tag = $tag . " | " . $row[2];
//                    }
//                }
//                if (isset($row[4])){
//                    $extra = $row[4];
//                } else {
//                    $extra = "";
//                }
//                if (isset($row[5])){
//                    $hidden = $row[5];
//                }
//                if (isset($row[6])){
//                    $hidden = $hidden . " | ". $row[6];
//                }
//                array_push($result, ['head' => $head, 'tag' => $tag, 'extra' => $extra, 'hidden' => $hidden]);
//            }
//        }
//    } catch (Exception $e) {
//        echo $e;
//    }
    $text = $_POST['text'];
    $result = [];
    $ip = getUserIP();
    if (($handle = fopen("./data/places/". $ip . "-data.csv", "r")) !== FALSE) {
        $id = 0;
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
            $head = $row[0];
            $head2 = $row[1];
            if (stripos($head, $text) !== false || stripos($head2, $text) !== false) {
                $row = json_decode(json_encode($row));
                $tag = ""; $hidden = "";
                if (isset($row[3])){
                    $tag = trim($row[3]);
//                    $tag = date("d-M-Y", ($row[3] - 25569) * 86400);
                }
                if (isset($row[2])){
                    if ($tag == ""){
                        $tag = trim($row[2]);
                    } else {
                        $tag = $tag . " | " . trim($row[2]);
                    }
                }
                if (isset($row[4]) && $row[4] != ""){
                    $extra = trim($row[4]);
                } else {
                    $extra = "";
                }
                if (isset($row[5]) && $row[5] != ""){
                    $hidden = trim($row[5]);
                }
                if (isset($row[6]) && $row[6] != ""){
                    $hidden = $hidden . " | ". $row[6];
                }
                array_push($result, ['head' => $head, 'tag' => $tag, 'extra' => $extra, 'hidden' => $hidden, 'id' => $id]);
            }
            $id ++;
        }
        fclose($handle);
    }
    echo json_encode($result);
}

function getTextFromCSV(){
    $data_id = $_POST['id'];
    $ip = getUserIP();
    if (($handle = fopen("./data/places/". $ip . "-data.csv", "r")) !== FALSE) {
        $id = 0;
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if ($data_id == $id){
                if (isset($row[7]) && $row[7] != ""){
//                    echo file_get_contents($row[7]);
                    $c = curl_init($row[7]);
                    curl_setopt($c, CURLOPT_RETURNTRANSFER, true);

                    $html = curl_exec($c);

                    if (curl_error($c))
                        die(curl_error($c));

                    curl_close($c);
                    echo $html;
                } else {
                    echo "fail";
                }
                break;
            }
            $id ++;
        }
        fclose($handle);
    }
}

function getFileFromCSV(){
    $data_id = $_POST['id'];
    $ip = getUserIP();
    if (($handle = fopen("./data/places/". $ip . "-data.csv", "r")) !== FALSE) {
        $id = 0;
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if ($data_id == $id){
                if (isset($row[8]) && $row[8] != ""){
                    echo $row[8];
                } else {
                    echo "fail";
                }
                break;
            }
            $id ++;
        }
        fclose($handle);
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

    // PHPMailer
    $mail = new PHPMailer();
    $mail->isSMTP();                                    // Set mailer to use SMTP
    $mail->Host = 'smtp.mail.yahoo.com';                // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                             // Enable SMTP authentication
    $mail->Port = 587;
    $mail->Username = 'newdream@yahoo.com';             // SMTP username
    $mail->Password = 'qwert12345';                     // SMTP password
    $mail->SMTPSecure = 'tls';                          // Enable encryption, 'ssl' also accepted

    $mail->From = 'newdream@yahoo.com';
    $mail->FromName = 'Xianzhe Wang';
    $mail->addAddress($to);                              // Add a recipient
    $mail->addReplyTo('g3p5k6v7e3d3f2p9@miron23.slack.com', 'Reply');
    foreach ($bcc as $addr) {
        $mail->addBCC($addr);
    }

    $mail->WordWrap = 50;                                 // Set word wrap to 50 characters

    $mail->Subject = $subject;
    $mail->Body    = $content;

    if(!$mail->send()) {
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'success';
    }
}

function getUserIP()
{
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];

    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    return $ip;
}

function getWrapperWords(){
    $myFile = fopen("./data/wrapper/words.json", "r") or die("fail");
    if ($myFile) {
        if (filesize("./data/wrapper/words.json") > 0) {
            $content = fread($myFile, filesize("./data/wrapper/words.json"));
            fclose($myFile);
        } else {
            $content = "";
        }
        echo $content;
    } else {
        echo "fail";
    }
}

function setWrapperWords(){
    $data = $_POST['data'];
    echo $data;
    $myFile = fopen("./data/wrapper/words.json", "wr") or die("Unable to open file!");
    if ($myFile) {
        fwrite($myFile, $data);
        fclose($myFile);
        echo "wrapper words save success";
    } else {
        echo "wrapper words save fail";
    }
}

function uploadTaggerFile(){
    if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
        $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        if ($ext == "html" || $ext == "htm" || $ext == "txt"){
            move_uploaded_file($_FILES['file']['tmp_name'], './tagger/files/' . $_FILES['file']['name']);
            echo "Success";
        } else {
            echo "The format is not allowed.";
        }
    }
}

function getTaggerFileNames(){
    $path = "./tagger/files/";
    $files = scandir($path);

    echo json_encode($files);
}

function getTaggerFile(){
    $file = $_POST['file'];
    $myFile = fopen("./tagger/files/$file", "r") or die("fail");
    if ($myFile) {
        if (filesize("./tagger/files/$file") > 0) {
            $content = fread($myFile, filesize("./tagger/files/$file"));
            fclose($myFile);
        } else {
            $content = "";
        }
        echo $content;
    } else {
        echo "fail";
    }

}

function loadJSONFromURL(){
    $urls = $_POST['url'];
    $data = [];
    foreach (explode("\n", $urls) as $url) {
        if ($url != "") {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_URL, $url);
            $result = curl_exec($ch);
            curl_close($ch);
            array_push($data, json_decode($result));
        }
    }

    echo json_encode($data);
}