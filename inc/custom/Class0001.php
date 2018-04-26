<?php

namespace inc\custom;

class Class0001 {
    public function process($rows, $params){
        $pattern = $params[0];
        $count = $params[1];
        $result = [];
        $neighborWords = "";

        foreach ($rows as $row) {
            $words = preg_split("/\s+|\t+/", $row['text']);
            foreach ($words as $i => $w) {
                if (stripos($pattern, $w) !== false){
                    for ($j = max($i - $count, 0); $j <= min($i + $count + 1, sizeof($words) - 1); $j ++){
                        $neighborWords += $words[$j];
                    }
                    $row['text_found'] = 1;
                    $row['simple_text'] = $neighborWords;
                    array_push($result, $row);
                }
            }
            $row['text_found'] = 0;
            array_push($result, $row);
        }
        return json_encode($result);
    }
}
