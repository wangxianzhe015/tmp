<?php

include_once('inc/simplexlsx.class.php');
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
    case 'load-json-from-sql':
        loadJSONFromPGSQL();
        break;
    case 'save-sql-setting':
        saveSQLSettings();
        break;
    case 'load-sql-setting':
        loadSQLSettings();
        break;
    case 'save-line':
        saveLineAndBox();
        break;
    case 'load-line':
        loadLineAndBox();
        break;
    case 'load-line-file-names':
        loadLineFileNames();
        break;
    case 'load-eml':
        getHtmlFromEml();
        break;
    case 'save-drop-frame':
        saveDropFrame();
        break;
    case 'load-drop-frame':
        loadDropFrame();
        break;
    case 'save-text-cell':
        saveTextCells();
        break;
    case 'load-text-cell-names':
        loadTextCellNames();
        break;
    case 'load-text-cell':
        loadTextCell();
        break;
    case 'save-word-mapper':
        saveWordMapper();
        break;
    case 'load-word-mapper':
        loadWordMapper();
        break;
    case 'load-mapper-names':
        loadMapperNames();
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
//    echo $data;
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

function saveSQLSettings(){
    $host = $_POST['host'];
    $port = $_POST['port'];
    $db = $_POST['db'];
    $user = $_POST['user'];
    $pwd = $_POST['pwd'];
    $key = $_POST['key'];

    $setting = [
        "host" => $host,
        "port" => $port,
        "db" => $db,
        "user" => $user,
        "pwd" => $pwd,
        "key" => $key
    ];

    $myFile = fopen("./data/pgsql/setting.json", "wr") or die("Unable to open file!");
    if ($myFile) {
        fwrite($myFile, json_encode($setting));
        fclose($myFile);
        echo "Settings saved successfully";
    } else {
        echo "Settings save fail";
    }

}

function loadSQLSettings(){
    $myFile = fopen("./data/pgsql/setting.json", "r") or die("fail");
    if ($myFile) {
        if (filesize("./data/pgsql/setting.json") > 0) {
            $content = fread($myFile, filesize("./data/pgsql/setting.json"));
            fclose($myFile);
        } else {
            $content = "";
        }
        echo $content;
    } else {
        echo "fail";
    }
}

function loadJSONFromPGSQL(){
    $host = $_POST['host'];
    $port = $_POST['port'];
    $db = $_POST['db'];
    $user = $_POST['user'];
    $pwd = $_POST['pwd'];

    $dbconn = pg_connect("host=$host port=$port dbname=$db user=$user password=$pwd")
    or die('connection_fail');

    $queryString = trim($_POST['query']);
    $query = trim(explode(":", $queryString)[1]);
    if (strpos($query, "limit") < 0){
        if (strpos($query, ";")) {
            $query = substr($query, 0, strpos($query, ";"));
        }
        $query = $query . " limit 1000;";
    }
//    $result = pg_query($query);
    $result = pg_query($query) or die('query_fail');

//    $array = [];
//    $row = "";
//    $order = 0;

    $array = pg_fetch_all($result);
//    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
//        foreach ($line as $col_value) {
//            if ($order == 0) {
//                $row = $col_value;
//            } else {
//                $row = $row . ", " . $col_value;
//            }
//            $order ++;
//        }
//        array_push($array, $row);
//        $order = 0;
//        $row = "";
//    }
    pg_free_result($result);
    pg_close($dbconn);

    try {
        $funcString = trim(explode(":", $queryString)[0]);
        if ($funcString != "") {
            $funcName = trim(explode("{", $funcString)[0]);
            $funcParams = explode(",", substr(trim(explode("{", $funcString)[1]), 0,strlen(trim(explode("{", $funcString)[1])) - 1));

            define("CUSTOM_DIR", "\\inc\\custom\\");
            include_once(__DIR__ . "/inc/custom/Class" . $funcName . ".php");

            $className = CUSTOM_DIR . "Class" . $funcName;
            $class = new $className();

            echo $class->process($array, $funcParams);
            return;
        }
    } catch ( Exception $e){
        echo 'invalid_string';
        return;
    }

    echo json_encode($array);
}

function saveLineAndBox(){
    $param = $_POST['objects'];
    $fileName = $_POST['fileName'];
    $myFile = fopen("./data/hud/".$fileName.".json", "wr") or die("Unable to open file!");
    fwrite($myFile, $param);
    fclose($myFile);

    echo "Save completed";
}

function loadLineFileNames() {
    $path = "./data/hud/";
    $files = scandir($path);

    echo json_encode($files);
}

function loadLineAndBox() {
    $fileName = $_POST['fileName'];
    $myFile = fopen("./data/hud/".$fileName.".json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/hud/".$fileName.".json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }
}

function getHtmlFromEml() {
    include_once(__DIR__ . '/inc/eml/MailMimeParser.php');

    $mailParser = new ZBateson\MailMimeParser\MailMimeParser();
    $mailDataPath = __DIR__ . "/data/eml/";
    $files = scandir($mailDataPath);
    $result = [];

    foreach ($files as $file) {
        if ($file == '.' || $file == '..') continue;
        $handle = fopen($mailDataPath . $file, 'r');
        $message = $mailParser->parse($handle);         // returns a \ZBateson\MailMimeParser\Message
        fclose($handle);

//echo $message->getHeaderValue('from');          // user@example.com
//echo $message
//    ->getHeader('from')
//    ->getPersonName();                          // Person Name
//echo $message->getHeaderValue('subject');       // The email's subject

//echo $message->getTextContent();
        array_push($result, ["subject" => $message->getHeaderValue('subject'), "content" => $message->getHtmlContent()]);
    }

    echo json_encode($result);
}

function saveDropFrame(){
    $param = $_POST['data'];
    $myFile = fopen("./drop/data.json", "wr") or die("Unable to open file!");
    fwrite($myFile, $param);
    fclose($myFile);

    echo "Save completed";
}

function loadDropFrame() {
    $myFile = fopen("./drop/data.json", "r") or die("Unable to open file!");
    if ($myFile) {
        if (filesize("./drop/data.json") > 0) {
            $content = fread($myFile, filesize("./drop/data.json"));
            fclose($myFile);
            echo $content;
        } else {
            echo "no_content";
        }
    } else {
        echo "fail";
    }

}

function saveTextCells(){
    $param = $_POST['elements'];
    $fileName = $_POST['fileName'];
    $myFile = fopen("./data/cells/".$fileName.".json", "wr") or die("Unable to open file!");
    fwrite($myFile, $param);
    fclose($myFile);

    echo "Save completed";
}

function loadTextCellNames() {
    $path = "./data/cells/";
    $files = scandir($path);

    echo json_encode($files);
}

function loadTextCell() {
    $fileName = $_POST['fileName'];
    $myFile = fopen("./data/cells/".$fileName.".json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/cells/".$fileName.".json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }
}

function saveWordMapper(){
    $data = $_POST['data'];
    $name = $_POST['name'];
    $myFile = fopen("./data/word-mapper/" . $name . ".json", "wr") or die("Unable to open file!");
    fwrite($myFile, $data);
    fclose($myFile);

    echo "Save completed";
}

function loadMapperNames() {
    $path = "./data/word-mapper/";
    $files = scandir($path);

    echo json_encode($files);
}

function loadWordMapper() {
    $name = $_POST['name'];
    $myFile = fopen("./data/word-mapper/" . $name . ".json", "r") or die("Unable to open file!");
    if ($myFile) {
        $content = fread($myFile, filesize("./data/word-mapper/" . $name . ".json"));
        fclose($myFile);
        echo $content;
    } else {
        echo "fail";
    }

}

