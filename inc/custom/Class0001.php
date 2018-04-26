<?php

namespace inc\custom;

class Class0001 {
    public function process($rows, $params){
        $pattern = $params[0];
        $count = $params[1];
        $result = [];
        $neighborWords = "";

        for ($k = 0; $k < sizeof($rows); $k ++) {
            $row = $rows[$k];
            $words = preg_split("/\s+|\t+/", $row['text']);
            for ($i = 0; $i < sizeof($words); $i ++) {
                $w = $words[$i];
                if (stripos($pattern, $w) > -1){
                    for ($j = max($i - $count, 0); $j <= min($i + $count, sizeof($words) - 1); $j ++){
                        $neighborWords .= $words[$j] . " ";
                    }
                    $row['text_found'] = 1;
                    $row['simple_text'] = trim($neighborWords);
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
