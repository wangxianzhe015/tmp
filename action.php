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
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
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
        fclose($handle);
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
