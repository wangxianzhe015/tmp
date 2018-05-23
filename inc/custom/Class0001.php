<?php

namespace inc\custom;

class Class0001 {
    public function process($rows, $params){
        $pattern = $params[0];
        $count = (int)trim($params[1]);
        $result = [];
        $neighborWords = "";

        foreach ($rows as $row) {
            $words = preg_split("/\s+|\t+/", $row['text']);
            foreach ($words as $i => $w) {
                if (preg_match($pattern, $w)){
                    for ($j = max($i - $count, 0); $j <= min($i + $count, sizeof($words) - 1); $j ++){
                        $neighborWords .= $words[$j] . " ";
                    }
                    $row['text_found'] = 1;
                    $row['simple_text'] = trim($neighborWords);
                    $neighborWords = "";
                    array_push($result, $row);
                }
            }
            if (!isset($row['text_found'])){
                $row['text_found'] = 0;
                array_push($result, $row);
            }
            $neighborWords = "";
        }
        return json_encode($result);
    }
}
